import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const UserAbsenList = () => {
  const [absensi, setAbsensi] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getAbsen();
  }, [id]);

  const getAbsen = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/absensi/user/${id}`);
      setAbsensi(response.data);
    } catch (error) {
      console.error("Error fetching absensis:", error);
    }
  };

  const deleteAbsen = async (absenId) => {
    await axios.delete(`http://localhost:5000/absensi/${absenId}`);
    getAbsen();
  };

  return (
    <div>
      <h1 className="title">Absen</h1>
      <h2 className="subtitle">{absensi.nama}</h2>
      <Link to={`/users`} className="button is-small is-info">
        Back
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal Absen</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th>Foto CheckOut</th>
            <th>Foto CheckOut</th>
            <th>Kegiatan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {absensi.absensis &&
            absensi.absensis.map((absen, index) => (
              <tr key={absen.id}>
                <td>{index + 1}</td>
                <td>{absen.tanggal_absen}</td>
                <td>{absen.jam_check_in}</td>
                <td>{absen.jam_check_out}</td>
                {/* <td>{absen.foto_checkin ? absen.foto_checkin : null}</td> */}
                <td>
                  <figure className="image is-128x128">
                    <img crossOrigin="anonymous" src={`http://localhost:5000/${absen.foto_checkin}`} alt="checkinPhoto" />
                  </figure>
                </td>
                {/* <td>{absen.foto_checkout ? absen.foto_checkout : null}</td> */}
                <td>
                  <figure className="image is-128x128">
                    <img crossOrigin="anonymous" src={`http://localhost:5000/${absen.foto_checkout}`} alt="checkOutPhoto" />
                  </figure>
                </td>
                <td>
                  {absen.kegiatan.map((kegiatan) => (
                    <span key={kegiatan.id}>{kegiatan.nama_kegiatan}</span>
                  ))}
                </td>
                <td>
                  <button onClick={() => deleteAbsen(absen.id)} className="button is-small is-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAbsenList;
