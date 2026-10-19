import argon2 from "argon2";

const findAll = async (req, res) => {
  try {
    let whereCondition = {};
    if (req.role !== "superadmin" && req.role !== "admin") {
      whereCondition.divisi = req.divisi || "General";
    } else if (req.query.divisi) {
      whereCondition.divisi = req.query.divisi;
    }

    const response = await req.context.models.pengguna.findAll({
      attributes: ["id", "username", "nama", "jabatan", "divisi", "role"],
      where: whereCondition,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const findOne = async (req, res) => {
  try {
    const response = await req.context.models.pengguna.findOne({
      attributes: ["id", "username", "nama", "jabatan", "divisi", "role"],
      where: { id: req.params.id },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const create = async (req, res) => {
  const { username, password, confPassword, nama, jabatan, divisi, role } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
  const hashPassword = await argon2.hash(password);
  try {
    await req.context.models.pengguna.create({
      username: username,
      password: hashPassword,
      nama: nama,
      jabatan: jabatan,
      divisi: divisi || "General",
      role: role || "user",
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const update = async (req, res) => {
  const user = await req.context.models.pengguna.findOne({
    where: { id: req.params.id },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const { username, password, confPassword, nama, jabatan, divisi, role } = req.body;
  let hashPassword = user.password;
  if (password && password.trim() !== "") {
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    hashPassword = await argon2.hash(password);
  }
  const isPrivileged = req.role === "superadmin" || req.role === "admin";
  try {
    await req.context.models.pengguna.update(
      {
        username: username || user.username,
        password: hashPassword,
        nama: nama || user.nama,
        jabatan: isPrivileged ? (jabatan || user.jabatan) : user.jabatan,
        divisi: isPrivileged ? (divisi || user.divisi) : user.divisi,
        role: isPrivileged ? (role || user.role) : user.role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleted = async (req, res) => {
  const user = await req.context.models.pengguna.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await req.context.models.pengguna.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export default { findAll, findOne, create, update, deleted };
