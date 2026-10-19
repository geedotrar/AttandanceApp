import argon2 from "argon2";

const findAll = async (req, res) => {
  try {
    const response = await req.context.models.pengguna.findAll({
      attributes: ["id", "username", "nama", "jabatan", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const findOne = async (req, res) => {
  try {
    const response = await req.context.models.pengguna.findOne({
      attributes: ["id", "username", "nama", "jabatan", "role"],
      where: { id: req.params.id },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const create = async (req, res) => {
  const { username, password, confPassword, nama, jabatan, role } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
  const hashPassword = await argon2.hash(password);
  try {
    await req.context.models.pengguna.create({
      username: username,
      password: hashPassword,
      nama: nama,
      jabatan: jabatan,
      role: role,
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
  const { username, password, confPassword, nama, jabatan, role } = req.body;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
  try {
    await req.context.models.pengguna.update(
      {
        username: username,
        password: hashPassword,
        nama: nama,
        jabatan: jabatan,
        role: role,
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

// const findAll = async (req, res) => {
//   try {
//     const pengguna = await req.context.models.pengguna.findAll();
//     return res.send(pengguna);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

// const findOne = async (req, res) => {
//   try {
//     const pengguna = await req.context.models.pengguna.findOne({
//       where: { id: req.params.id },
//     });
//     return res.send(pengguna);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

// const create = async (req, res) => {
//   try {
//     const pengguna = await req.context.models.pengguna.create({
//       username: req.body.username,
//       password: req.body.password,
//       role: req.body.role,
//       nama: req.body.nama,
//       jabatan: req.body.jabatan,
//     });
//     return res.send(pengguna);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

// const update = async (req, res) => {
//   try {
//     const pengguna = await req.context.models.pengguna.update(
//       {
//         username: req.body.username,
//         password: req.body.password,
//         role: req.body.role,
//         nama: req.body.nama,
//         jabatan: req.body.jabatan,
//       },
//       { returning: true, where: { id: req.params.id } }
//     );
//     return res.send(pengguna);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

// const deleted = async (req, res) => {
//   try {
//     const pengguna = await req.context.models.pengguna.destroy({
//       where: { id: req.params.id },
//     });
//     return res.send(`delete ${pengguna} rows`);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };
