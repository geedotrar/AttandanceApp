import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const AbsenDetailList = () => {
  const [absenDetail, setAbsenDetail] = useState([]);
  const [msg, setMsg] = useState("");
  const { id } = useParams();

  useEffect(() => {
    getAbsen();
  }, [id]);

  const getAbsen = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/absensi/${id}`);
      setAbsenDetail(response.data);
    } catch (error) {
      console.error("Error fetching absensis:", error);
    }
  };

  return (
    <div>
      <h1 className="title">Absen</h1>
      <Link to={`/absen`} className="button is-small is-info">
        Back
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Foto CheckIn</th>
            <th>Foto CheckOut</th>
            <th>Kegiatan</th>
          </tr>
        </thead>
        <tbody>
          {absenDetail && absenDetail.foto_checkin && (
            <tr>
              <td>
                <figure className="image is-128x128">
                  <img crossOrigin="anonymous" src={`http://localhost:5000/${absenDetail.foto_checkin}`} alt="checkinPhoto" />
                </figure>
              </td>
              <td>
                <figure className="image is-128x128">
                  <img crossOrigin="anonymous" src={`http://localhost:5000/${absenDetail.foto_checkout}`} alt="checkoutPhoto" />
                </figure>
              </td>
              <td>{absenDetail && absenDetail.kegiatan && absenDetail.kegiatan.length > 0 ? absenDetail.kegiatan[0].nama_kegiatan : null}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AbsenDetailList;
