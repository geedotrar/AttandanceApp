import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { IoPerson, IoPricetag, IoHome, IoLogOut } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";

const AbsenList = () => {
  const [absensi, setAbsensi] = useState([]);
  useEffect(() => {
    getAbsen();
  }, []);

  const getAbsen = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/absensi/`);
      setAbsensi(response.data);
    } catch (error) {
      console.error("Error fetching absensis:", error);
    }
  };

  return (
    <div>
      <h1 className="title">Absen</h1>
      <h2 className="subtitle">{absensi[0] && absensi[0].user.nama}</h2>
      <Link to="/absen/add" className="button is-primary mb-2">
        Absen Hari ini
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal Absen</th>
            <th>Checkin</th>
            <th>Checkout</th>
            {/* <th>Foto CheckIn</th>
            <th>Foto CheckOut</th> */}
            <th>Kegiatan</th>
            <th>CheckOut</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {absensi &&
            absensi.map((absen, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{absen.tanggal_absen}</td>
                <td>{absen.jam_check_in}</td>
                <td>{absen.jam_check_out}</td>
                <td>
                  <Link to={absen.kegiatan.length > 0 ? `/kegiatan/add/${absen.kegiatan[0].id}` : "/kegiatan/add"} className="button is-small is-light has-text-black">
                    Tambah/Edit Kegiatan
                  </Link>
                </td>
                {/* <td>{absen.foto_checkin ? absen.foto_checkin : null}</td>
                <td>{absen.foto_checkout ? absen.foto_checkout : null}</td> */}
                <td>
                  <Link to={`/absen/edit/${absen.id}`} className="button is-small is-info">
                    CheckOut
                  </Link>
                </td>
                <td>
                  <Link to={`/absen/detail/${absen.id}`}>
                    <IoIosInformationCircleOutline size={30} />
                  </Link>
                </td>
                {/* <td>{absen.kegiatan.length > 0 ? absen.kegiatan.map((kegiatan, kegiatanIndex) => <div key={kegiatanIndex}>{kegiatan.nama_kegiatan}</div>) : "No Kegiatan"}</td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AbsenList;
