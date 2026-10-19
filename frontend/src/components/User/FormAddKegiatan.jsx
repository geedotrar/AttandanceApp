import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const FormAddKegiatan = () => {
  const [kegiatan, setKegiatan] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getKegiatanById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/kegiatan/${id}`);
        setKegiatan(response.data.nama_kegiatan);
      } catch (error) {
        if (error) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getKegiatanById();
  }, [id]);

  const addKegiatan = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/kegiatan/${id}`, {
        nama_kegiatan: kegiatan,
      });
      navigate("/absen");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Add/Edit Kegiatan</h1>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={addKegiatan}>
              <p className="has-text-centered"></p>
              <div className="field">
                <label className="label">Kegiatan</label>
                <div className="control">
                  <textarea style={{ height: "100px" }} type="textarea" className="input" value={kegiatan} onChange={(e) => setKegiatan(e.target.value)} placeholder="Kegiatan" />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Save
                  </button>

                  <Link to="/absen/" className="button is-danger">
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddKegiatan;
