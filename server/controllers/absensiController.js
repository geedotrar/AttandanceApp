//absensi Controller
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

      const { foto_checkin } = req.body;
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString();

      try {
        // Create absensi with the uploaded file
        const absensi = await req.context.models.absensi.create({
          tanggal_absen: currentDate,
          jam_check_in: currentTime,
          foto_checkin: path.basename(req.file.path), // Use req.file.path to get the file
          user_id: req.userId,
        });

        // Create kegiatan
        await req.context.models.kegiatan.create({
          absensi_id: absensi.id,
          nama_kegiatan: "",
        });

        res.status(201).json({ msg: "Absen Created Successfully" });
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
    let response;
    response = await req.context.models.absensi.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: req.context.models.pengguna,
          as: "user",
          attributes: ["username", "nama", "jabatan", "role"],
        },
        {
          model: req.context.models.kegiatan,
          as: "kegiatan",
          attributes: ["id", "absensi_id", "nama_kegiatan"],
        },
      ],
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
    if (req.role === "admin") {
      response = await req.context.models.absensi.findOne({
        where: {
          id: absensi.id,
        },
        include: [
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
        include: {
          model: req.context.models.kegiatan,
          as: "kegiatan",
          attributes: ["id", "nama_kegiatan"],
        },
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
      attributes: ["id", "username", "nama", "jabatan", "role"],
      where: { id: req.params.id },
      include: [
        {
          model: req.context.models.absensi,
          as: "absensis",
          attributes: ["id", "tanggal_absen", "jam_check_in", "jam_check_out", "jam_check_out", "foto_checkin", "foto_checkout"],
          include: [
            {
              model: req.context.models.kegiatan,
              as: "kegiatan",
            },
          ],
        },
      ],
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

      // Check if the user making the request is authorized
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

    if (req.role === "admin") {
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

// const create = async (req, res) => {
//   const { foto_checkin } = req.body;
//   const currentDate = new Date();
//   const currentTime = currentDate.toLocaleTimeString();
//   try {
//     const absensi = await req.context.models.absensi.create({
//       tanggal_absen: currentDate,
//       jam_check_in: currentTime,
//       foto_checkin: foto_checkin,
//       user_id: req.userId,
//     });
//     await req.context.models.kegiatan.create({
//       absensi_id: absensi.id,
//       nama_kegiatan: "",
//     });
//     res.status(201).json({ msg: "Absen Created Successfuly" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const updates = async (req, res) => {
//   try {
//     const absensi = await req.context.models.absensi.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!absensi) return res.status(404).json({ msg: "Data tidak ditemukan" });
//     const { foto_checkout } = req.body;
//     const currentDate = new Date();
//     const currentTime = currentDate.toLocaleTimeString();
//     if (req.role === "admin") {
//       await req.context.models.absensi.update(
//         { jam_check_out: currentTime, foto_checkout: foto_checkout },
//         {
//           where: {
//             id: absensi.id,
//           },
//         }
//       );
//     } else {
//       if (req.userId !== absensi.user_id) return res.status(403).json({ msg: "Akses terlarang" });
//       await req.context.models.absensi.update(
//         { jam_check_out: currentTime, foto_checkout: foto_checkout },
//         {
//           where: {
//             [Op.and]: [{ id: absensi.id }, { user_id: req.userId }],
//           },
//         }
//       );
//       await req.context.models.kegiatan.update({
//         absensi_id: req.absensi_id,
//         nama_kegiatan: req.body.nama_kegiatan,
//       });
//     }
//     res.status(200).json("absensi updated successfully");
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };
export default { findAll, create, findOne, update, deleted, findOneByUserId };

// ==========================================================================================
// import { Op } from "sequelize";
// import kegiatan from "../models/kegiatan";

// // const findAll = async (req, res) => {
// //   try {
// //     let response;
// //     if (req.role === "admin") {
// //       response = await req.context.models.absensi.findAll({
// //         // attributes:['uuid','name','price'],
// //         include: [
// //           {
// //             model: req.context.models.pengguna,
// //             as: "user",
// //             // attributes: ["id", "username", "nama", "jabatan", "role"],
// //             attributes: ["username", "nama", "jabatan", "role"],
// //           },
// //         ],
// //       });
// //     } else {
// //       response = await req.context.models.absensi.findAll({
// //         // attributes:['uuid','name','price'],
// //         where: {
// //           user_id: req.userId,
// //         },
// //         include: [
// //           {
// //             model: req.context.models.pengguna,
// //             as: "user",
// //             // attributes: ["id", "username", "nama", "jabatan", "role"],
// //             attributes: ["username", "nama", "jabatan", "role"],
// //           },
// //         ],
// //       });
// //     }
// //     res.status(200).json(response);
// //   } catch (error) {
// //     res.status(500).json({ msg: error.message });
// //   }
// // };
// const findAll = async (req, res) => {
//   try {
//     let response;
//     response = await req.context.models.absensi.findAll({
//       where: {
//         user_id: req.userId,
//       },
//       include: [
//         {
//           model: req.context.models.pengguna,
//           as: "user",
//           attributes: ["username", "nama", "jabatan", "role"],
//         },
//         {
//           model: req.context.models.kegiatan,
//           as: "kegiatan",
//           attributes: ["id", "absensi_id", "nama_kegiatan"],
//         },
//       ],
//     });
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const findOne = async (req, res) => {
//   try {
//     const absensi = await req.context.models.absensi.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!absensi) return res.status(404).json({ msg: "Data tidak ditemukan" });
//     let response;
//     if (req.role === "admin") {
//       response = await req.context.models.absensi.findOne({
//         where: {
//           id: absensi.id,
//         },
//         include: [
//           //   // {
//           //   //   model: req.context.models.pengguna,
//           //   //   as: "user",
//           //   //   attributes: ["username", "nama", "jabatan", "role"],
//           //   // },
//           {
//             model: req.context.models.kegiatan,
//             as: "kegiatan",
//             attributes: ["id", "nama_kegiatan"],
//           },
//         ],
//       });
//     } else {
//       response = await req.context.models.absensi.findOne({
//         where: {
//           [Op.and]: [{ id: absensi.id }, { user_id: req.userId }],
//         },
//         include:
//           //   // {
//           //   //   model: req.context.models.pengguna,
//           //   //   as: "user",
//           //   //   attributes: ["username", "nama", "jabatan", "role"],
//           //   // },
//           {
//             model: req.context.models.kegiatan,
//             as: "kegiatan",
//             attributes: ["id", "nama_kegiatan"],
//           },
//       });
//     }
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const findOneByUserId = async (req, res) => {
//   try {
//     const absensi = await req.context.models.pengguna.findOne({
//       attributes: ["id", "username", "nama", "jabatan", "role"],
//       where: { id: req.params.id },
//       include: [
//         {
//           model: req.context.models.absensi,
//           as: "absensis",
//           attributes: ["id", "tanggal_absen", "jam_check_in", "jam_check_out", "jam_check_out", "foto_checkin", "foto_checkout"],
//           include: [
//             {
//               model: req.context.models.kegiatan,
//               as: "kegiatan",
//             },
//           ],
//         },
//       ],
//     });

//     if (!absensi) return res.status(404).json({ msg: "Data tidak ditemukan" });
//     return res.send(absensi);
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// };

// const create = async (req, res) => {
//   const { foto_checkin } = req.body;
//   const currentDate = new Date();
//   const currentTime = currentDate.toLocaleTimeString();
//   try {
//     const absensi = await req.context.models.absensi.create({
//       tanggal_absen: currentDate,
//       jam_check_in: currentTime,
//       foto_checkin: foto_checkin,
//       user_id: req.userId,
//     });
//     await req.context.models.kegiatan.create({
//       absensi_id: absensi.id,
//       nama_kegiatan: "",
//     });
//     res.status(201).json({ msg: "Absen Created Successfuly" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const update = async (req, res) => {
//   try {
//     const absensi = await req.context.models.absensi.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!absensi) return res.status(404).json({ msg: "Data tidak ditemukan" });
//     const { foto_checkout } = req.body;
//     const currentDate = new Date();
//     const currentTime = currentDate.toLocaleTimeString();
//     if (req.role === "admin") {
//       await req.context.models.absensi.update(
//         { jam_check_out: currentTime, foto_checkout: foto_checkout },
//         {
//           where: {
//             id: absensi.id,
//           },
//         }
//       );
//     } else {
//       if (req.userId !== absensi.user_id) return res.status(403).json({ msg: "Akses terlarang" });
//       await req.context.models.absensi.update(
//         { jam_check_out: currentTime, foto_checkout: foto_checkout },
//         {
//           where: {
//             [Op.and]: [{ id: absensi.id }, { user_id: req.userId }],
//           },
//         }
//       );
//       await req.context.models.kegiatan.update({
//         absensi_id: req.absensi_id,
//         nama_kegiatan: req.body.nama_kegiatan,
//       });
//     }
//     res.status(200).json("absensi updated successfully");
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const deleted = async (req, res) => {
//   try {
//     const absensi = await req.context.models.absensi.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!absensi) return res.status(404).json({ msg: "Data tidak ditemukan" });

//     if (req.role === "admin") {
//       await req.context.models.absensi.destroy({
//         where: {
//           id: absensi.id,
//         },
//       });
//     } else {
//       if (req.userId !== absensi.user_id) return res.status(403).json({ msg: "Akses terlarang" });
//       await req.context.models.absensi.destroy({
//         where: {
//           [Op.and]: [{ id: absensi.id }, { user_id: req.userId }],
//         },
//       });
//     }
//     res.status(200).json("deleted successfully");
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// // const findAll = async (req, res) => {
// //   try {
// //     const absensi = await req.context.models.absensi.findAll();
// //     return res.send(absensi);
// //   } catch (error) {}
// //   return res.status(400).send(error);
// // };

// // const findOne = async (req, res) => {
// //   try {
// //     const absensi = await req.context.models.absensi.findOne({
// //       where: { id: req.params.id },
// //       include: [{ model: req.context.models.pengguna, as: "user" }],
// //     });

// //     if (!absensi) {
// //       return res.status(404).send("Absensi not found");
// //     }

// //     const response = {
// //       id: absensi.id,
// //       tanggal_absen: absensi.tanggal_absen,
// //       jam_check_in: absensi.jam_check_in,
// //       jam_check_out: absensi.jam_check_out,
// //       foto_checkin: absensi.foto_checkin,
// //       foto_checkout: absensi.foto_checkout,
// //       userId: {
// //         id: absensi.user.id,
// //         username: absensi.user.username,
// //         password: absensi.user.password,
// //         role: absensi.user.role,
// //         nama: absensi.user.nama,
// //         jabatan: absensi.user.jabatan,
// //       },
// //     };

// //     return res.send(response);
// //   } catch (error) {
// //     return res.status(400).send(error);
// //   }
// // };

// // const create = async (req, res) => {
// //   try {
// //     const currentDate = new Date();
// //     const currentDateString = currentDate.toISOString();
// //     const currentTimeString = currentDate.toLocaleTimeString();

// //     const absensi = await req.context.models.absensi.create({
// //       tanggal_absen: currentDateString,
// //       jam_check_in: currentTimeString,
// //       user_id: req.body.user_id,
// //       foto_checkin: req.body.foto_checkin,
// //     });
// //     return res.send(absensi);
// //   } catch (error) {
// //     return res.status(400).send(error);
// //   }
// // };

// // const update = async (req, res) => {
// //   try {
// //     const currentDate = new Date();
// //     const currentDateString = currentDate.toISOString();
// //     const currentTimeString = currentDate.toLocaleTimeString();

// //     const updatedAbsensi = await req.context.models.absensi.update(
// //       {
// //         tanggal_absen: currentDateString,
// //         // jam_check_in: currentTimeString,
// //         jam_check_out: currentTimeString,
// //         // user_id: req.body.user_id,
// //         // foto_checkin: req.body.foto_checkin,
// //         foto_checkout: req.body.foto_checkout,
// //       },
// //       { returning: true, where: { id: req.params.id } }
// //     );
// //     if (updatedAbsensi[0] === 0) {
// //       return res.status(404).send("Absensi entry not found");
// //     }
// //     const updatedEntry = await req.context.models.absensi.findOne({
// //       where: { id: req.params.id },
// //     });
// //     return res.send(updatedEntry);
// //   } catch (error) {
// //     return res.status(400).send(error);
// //   }
// // };

// // const deleted = async (req, res) => {
// //   try {
// //     const absensi = await req.context.models.absensi.destroy({
// //       where: { id: req.params.id },
// //     });
// //     return res.send(`delete ${absensi} rows`);
// //   } catch (error) {
// //     return res.status(400).send(error);
// //   }
// // };

// // const findOneByUserId = async (req, res) => {
// //   try {
// //     const absensiList = await req.context.models.absensi.findAll({
// //       where: { user_id: req.params.userId },
// //       include: [{ model: req.context.models.pengguna, as: "user" }],
// //     });

// //     if (absensiList.length === 0) {
// //       return res.status(404).send("No matching Absensi found for the specified user_id.");
// //     }

// //     const response = absensiList.map((absensi) => ({
// //       id: absensi.user.id,
// //       username: absensi.user.username,
// //       password: absensi.user.password,
// //       role: absensi.user.role,
// //       nama: absensi.user.nama,
// //       jabatan: absensi.user.jabatan,
// //       absensi: {
// //         id: absensi.id,
// //         tanggal_absen: absensi.tanggal_absen,
// //         jam_check_in: absensi.jam_check_in,
// //         jam_check_out: absensi.jam_check_out,
// //         foto_checkin: absensi.foto_checkin,
// //         foto_checkout: absensi.foto_checkout,
// //       },
// //     }));

// //     return res.send(response);
// //   } catch (error) {
// //     return res.status(400).send(error);
// //   }
// // };

// export default { findAll, create, findOne, update, deleted, findOneByUserId };
