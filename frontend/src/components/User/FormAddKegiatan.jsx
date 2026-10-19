import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoSaveOutline, IoDocumentTextOutline } from "react-icons/io5";
import { API_URL } from "../../config";

const FormAddKegiatan = () => {
  const [kegiatan, setKegiatan] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getKegiatanById = async () => {
      try {
        const response = await axios.get(`${API_URL}/kegiatan/${id}`);
        if (response.data && response.data.nama_kegiatan) {
          setKegiatan(response.data.nama_kegiatan);
        }
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getKegiatanById();
  }, [id]);

  const addKegiatan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/kegiatan/${id}`, {
        nama_kegiatan: kegiatan,
      });
      navigate("/absen");
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Karyawan &gt; Absensi &gt; Kegiatan</span>
          <div className="ribbon-title-wrap">
            <Link to="/absen" className="ribbon-back-btn" title="Kembali">
              <IoArrowBackOutline />
            </Link>
            <h1 className="ribbon-title">Catatan Kegiatan Harian</h1>
          </div>
        </div>
      </div>

      <div className="glass-form-card">
        {msg && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px 18px", borderRadius: "14px", marginBottom: "18px", fontSize: "13px", fontWeight: "600" }}>
            {msg}
          </div>
        )}

        <form onSubmit={addKegiatan}>
          <div className="form-group-field">
            <label className="form-label-custom">Deskripsi Tugas &amp; Kegiatan Kerja</label>
            <textarea
              className="form-input-custom"
              style={{ height: "130px", paddingTop: "14px", resize: "vertical" }}
              value={kegiatan}
              onChange={(e) => setKegiatan(e.target.value)}
              placeholder="Contoh: Menyelesaikan revisi modul absensi, meeting koordinasi sprint, review laporan mingguan..."
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <Link to="/absen" className="btn-pill-light">
              Batal
            </Link>
            <button type="submit" disabled={isLoading} className="btn-pill-dark">
              <IoSaveOutline style={{ fontSize: "18px" }} />
              <span>{isLoading ? "Menyimpan..." : "Simpan Kegiatan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddKegiatan;
