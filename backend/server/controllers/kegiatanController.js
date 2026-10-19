// const findAll = async (req, res) => {
//   try {
//     let response;
//     response = await req.context.models.kegiatan.findAll({
//       where: {
//         absensi_id: req.absensi_id,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

const create = async (req, res) => {
  try {
    const kegiatan = await req.context.models.kegiatan.create({
      absensi_id: req.body.absensi_id,
      nama_kegiatan: req.body.nama_kegiatan,
    });
    return res.send(kegiatan);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const findAll = async (req, res) => {
  try {
    const kegiatan = await req.context.models.kegiatan.findAll();
    return res.send(kegiatan);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const update = async (req, res) => {
  try {
    const kegiatan = await req.context.models.kegiatan.update(
      {
        nama_kegiatan: req.body.nama_kegiatan,
      },
      { returning: true, where: { id: req.params.id } }
    );
    return res.send(kegiatan);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const findOne = async (req, res) => {
  try {
    const kegiatan = await req.context.models.kegiatan.findOne({
      where: { id: req.params.id },
    });
    return res.send(kegiatan);
  } catch (error) {
    return res.status(400).send(error);
  }
};

// const create = async (req, res) => {
//   try {
//     const kegiatan = await req.context.models.kegiatan.create({
//       absensi_id: req.body.absensi_id,
//       nama_kegiatan: req.body.nama_kegiatan,
//     });
//     return res.send(kegiatan);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

// const update = async (req, res) => {
//   try {
//     const kegiatan = await req.context.models.kegiatan.update(
//       {
//         nama_kegiatan: req.body.nama_kegiatan,
//       },
//       { returning: true, where: { id: req.params.id } }
//     );
//     return res.send(kegiatan);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

// const deleted = async (req, res) => {
//   try {
//     const kegiatan = await req.context.models.kegiatan.destroy({
//       where: { id: req.params.id },
//     });
//     return res.send(`delete ${kegiatan} rows`);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

export default { findAll, create, update, findOne };
