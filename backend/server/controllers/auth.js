import argon2 from "argon2";

const Login = async (req, res) => {
  try {
    const user = await req.context.models.pengguna.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    req.session.userId = user.id;
    const id = user.id;
    const username = user.username;
    const nama = user.nama;
    const jabatan = user.jabatan;
    const role = user.role;
    const divisi = user.divisi;
    res.status(200).json({ id, username, nama, jabatan, divisi, role });
  } catch (error) {
    console.error("Error in Login controller:", error);
    res.status(500).json({ msg: error.message });
  }
};

const Me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }
    const user = await req.context.models.pengguna.findOne({
      attributes: ["id", "username", "nama", "jabatan", "divisi", "role"],
      where: {
        id: req.session.userId,
      },
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in Me controller:", error);
    res.status(500).json({ msg: error.message });
  }
};

const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Anda telah logout" });
  });
};

export default { Login, Me, logOut };
