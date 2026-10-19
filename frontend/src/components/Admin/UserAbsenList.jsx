import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { 
  IoArrowBackOutline, 
  IoCalendarOutline, 
  IoTrashOutline,
  IoAppsOutline,
  IoListOutline,
  IoEyeOutline,
  IoCheckmarkCircleOutline
} from "react-icons/io5";
import { API_URL } from "../../config";

const UserAbsenList = () => {
  const [absensi, setAbsensi] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const { id } = useParams();

  useEffect(() => {
    getAbsen();
  }, [id]);

  const getAbsen = async () => {
    try {
      const response = await axios.get(`${API_URL}/absensi/user/${id}`);
      setAbsensi(response.data);
    } catch (error) {
      console.error("Error fetching absensis:", error);
    }
  };

  const deleteAbsen = async (absenId) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus data absensi ini?")) {
      try {
        await axios.delete(`${API_URL}/absensi/${absenId}`);
        getAbsen();
      } catch (error) {
        console.error("Error deleting absen:", error);
      }
    }
  };

  const getTileGrad = (index) => {
    const grads = ["var(--grad-pink)", "var(--grad-teal)", "var(--grad-blue)", "var(--grad-amber)", "var(--grad-purple)"];
    return grads[index % grads.length];
  };

  if (!absensi) {
    return (
      <div className="hero-stat-card" style={{ padding: "40px", textAlign: "center" }}>
        <p>Memuat riwayat absensi karyawan...</p>
      </div>
    );
  }

  const list = absensi.absensis || [];

  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Perusahaan &gt; Karyawan &gt; Log Presensi</span>
          <div className="ribbon-title-wrap">
            <Link to="/users" className="ribbon-back-btn" title="Kembali">
              <IoArrowBackOutline />
            </Link>
            <h1 className="ribbon-title">Log Presensi: {absensi.nama}</h1>
          </div>
        </div>

        <div className="ribbon-right">
          <div className="view-toggle-wrap">
            <button 
              className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Tampilan Grid"
            >
              <IoAppsOutline />
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Tampilan Tabel"
            >
              <IoListOutline />
            </button>
          </div>

          <Link to="/users" className="btn-pill-light">
            Kembali ke Daftar
          </Link>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="hero-stat-card" style={{ padding: "48px 24px", textAlign: "center", alignItems: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Karyawan ini belum memiliki catatan absensi.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="cards-4col-grid">
          {list.map((absen, idx) => (
            <div key={absen.id} className="class-mini-card">
              <div className="mini-card-top">
                <div className="mini-tile-badge" style={{ background: getTileGrad(idx) }}>
                  <IoCalendarOutline />
                </div>
                <div className="mini-card-info">
                  <div className="mini-card-meta">{absen.tanggal_absen}</div>
                  <div className="mini-card-title">Presensi Harian</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ height: "90px", borderRadius: "12px", overflow: "hidden", background: "#0f172a" }}>
                  {absen.foto_checkin ? (
                    <img 
                      crossOrigin="anonymous" 
                      src={`${API_URL}/${absen.foto_checkin}`} 
                      alt="Check In" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div style={{ color: "#64748b", fontSize: "10px", textAlign: "center", paddingTop: "35px" }}>No Photo</div>
                  )}
                </div>

                <div style={{ height: "90px", borderRadius: "12px", overflow: "hidden", background: "#0f172a" }}>
                  {absen.foto_checkout ? (
                    <img 
                      crossOrigin="anonymous" 
                      src={`${API_URL}/${absen.foto_checkout}`} 
                      alt="Check Out" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div style={{ color: "#64748b", fontSize: "10px", textAlign: "center", paddingTop: "35px" }}>Belum Out</div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Masuk</span>
                  <strong>{absen.jam_check_in || "-"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Pulang</span>
                  <strong>{absen.jam_check_out || "-"}</strong>
                </div>
              </div>

              <div className="mini-card-actions">
                <span className={`pill-badge ${absen.jam_check_out ? "green" : "amber"}`}>
                  {absen.jam_check_out ? "Lengkap" : "Bekerja"}
                </span>

                <button onClick={() => deleteAbsen(absen.id)} className="header-icon-btn" style={{ width: "32px", height: "32px", color: "#ef4444" }} title="Hapus">
                  <IoTrashOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Foto In</th>
                <th>Foto Out</th>
                <th>Kegiatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((absen, idx) => (
                <tr key={absen.id}>
                  <td>{idx + 1}</td>
                  <td><strong>{absen.tanggal_absen}</strong></td>
                  <td>{absen.jam_check_in || "-"}</td>
                  <td>{absen.jam_check_out || "-"}</td>
                  <td>
                    {absen.foto_checkin ? (
                      <img crossOrigin="anonymous" src={`${API_URL}/${absen.foto_checkin}`} alt="In" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
                    ) : "-"}
                  </td>
                  <td>
                    {absen.foto_checkout ? (
                      <img crossOrigin="anonymous" src={`${API_URL}/${absen.foto_checkout}`} alt="Out" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
                    ) : "-"}
                  </td>
                  <td>
                    {absen.kegiatan && absen.kegiatan.length > 0
                      ? absen.kegiatan.map((k) => k.nama_kegiatan).join(", ")
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => deleteAbsen(absen.id)} className="btn-pill-light" style={{ padding: "4px 10px", fontSize: "11px", color: "#ef4444" }}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserAbsenList;
