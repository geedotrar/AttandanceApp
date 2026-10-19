import { Op } from "sequelize";
import multer from "multer";
import path from "path";
import upload from "../../config/multer.js";

const create = async (req, res) => {
  try {
    upload.single("foto_checkin")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ msg: "Multer error: " + err.message });
      } else if (err) {
        return res.status(500).json({ msg: "Internal server error: " + err.message });
      }

      const { latitude, longitude, status_kehadiran, keterangan_izin } = req.body;
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString();
      const status = status_kehadiran || "Hadir";
      const fotoPath = req.file ? path.basename(req.file.path) : null;

      try {
        const absensi = await req.context.models.absensi.create({
          tanggal_absen: currentDate,
          jam_check_in: status === "Hadir" ? currentTime : null,
          foto_checkin: fotoPath,
          latitude: latitude || null,
          longitude: longitude || null,
          status_kehadiran: status,
          keterangan_izin: keterangan_izin || null,
          surat_izin: (status !== "Hadir" && fotoPath) ? fotoPath : null,
          user_id: req.userId,
        });

        await req.context.models.kegiatan.create({
          absensi_id: absensi.id,
          nama_kegiatan: keterangan_izin || "",
        });

        res.status(201).json({ msg: "Absen Berhasil Dicatat" });
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const findAll = async (req, res) => {
  try {
    let whereCondition = {};
    if (req.role !== "superadmin") {
      whereCondition.user_id = req.userId;
    }
    const response = await req.context.models.absensi.findAll({
      where: whereCondition,
      include: [
        {
          model: req.context.models.pengguna,
          as: "user",
          attributes: ["username", "nama", "jabatan", "divisi", "role"],
        },
        {
          model: req.context.models.kegiatan,
          as: "kegiatan",
          attributes: ["id", "absensi_id", "nama_kegiatan"],
        },
      ],
      order: [["id", "DESC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const findOne = async (req, res) => {
  try {
    const absensi = await req.context.models.absensi.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!absensi) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin" || req.role === "superadmin") {
      response = await req.context.models.absensi.findOne({
        where: {
          id: absensi.id,
        },
        include: [
          {
            model: req.context.models.pengguna,
            as: "user",
            attributes: ["username", "nama", "jabatan", "divisi", "role"],
          },
          {
            model: req.context.models.kegiatan,
            as: "kegiatan",
            attributes: ["id", "nama_kegiatan"],
          },
        ],
      });
    } else {
      response = await req.context.models.absensi.findOne({
        where: {
          [Op.and]: [{ id: absensi.id }, { user_id: req.userId }],
        },
        include: [
          {
            model: req.context.models.pengguna,
            as: "user",
            attributes: ["username", "nama", "jabatan", "divisi", "role"],
          },
          {
            model: req.context.models.kegiatan,
            as: "kegiatan",
            attributes: ["id", "nama_kegiatan"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const findOneByUserId = async (req, res) => {
  try {
    const absensi = await req.context.models.pengguna.findOne({
      attributes: ["id", "username", "nama", "jabatan", "divisi", "role"],
      where: { id: req.params.id },
      include: [
        {
          model: req.context.models.absensi,
          as: "absensis",
          attributes: [
            "id", 
            "tanggal_absen", 
            "jam_check_in", 
            "jam_check_out", 
            "foto_checkin", 
            "foto_checkout",
            "latitude",
            "longitude",
            "status_kehadiran",
            "keterangan_izin",
            "surat_izin"
          ],
          include: [
            {
              model: req.context.models.kegiatan,
              as: "kegiatan",
            },
          ],
        },
      ],
      order: [[{ model: req.context.models.absensi, as: "absensis" }, "id", "DESC"]],
    });

    if (!absensi) return res.status(404).json({ msg: "Data tidak ditemukan" });
    return res.send(absensi);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const update = async (req, res) => {
  try {
    upload.single("foto_checkout")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ msg: "Multer error: " + err.message });
      } else if (err) {
        return res.status(500).json({ msg: "Internal server error: " + err.message });
      }

      const absensi = await req.context.models.absensi.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!absensi) return res.status(404).json({ msg: "Data tidak ditemukan" });

      const { foto_checkout } = req.body;
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString();

      if (req.userId !== absensi.user_id) {
        return res.status(403).json({ msg: "Akses terlarang" });
      }

      await req.context.models.absensi.update(
        { jam_check_out: currentTime, foto_checkout: path.basename(req.file.path) },
        {
          where: {
            [Op.and]: [{ id: absensi.id }, { user_id: req.userId }],
          },
        }
      );

      await req.context.models.kegiatan.update(
        {
          absensi_id: req.absensi_id,
          nama_kegiatan: req.body.nama_kegiatan,
        },
        {
          where: {
            absensi_id: absensi.id,
          },
        }
      );

      res.status(200).json({ msg: "Absensi updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleted = async (req, res) => {
  try {
    const absensi = await req.context.models.absensi.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!absensi) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (req.role === "admin" || req.role === "superadmin") {
      await req.context.models.absensi.destroy({
        where: {
          id: absensi.id,
        },
      });
    } else {
      if (req.userId !== absensi.user_id) return res.status(403).json({ msg: "Akses terlarang" });
      await req.context.models.absensi.destroy({
        where: {
          [Op.and]: [{ id: absensi.id }, { user_id: req.userId }],
        },
      });
    }
    res.status(200).json("deleted successfully");
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export default { findAll, create, findOne, update, deleted, findOneByUserId };
