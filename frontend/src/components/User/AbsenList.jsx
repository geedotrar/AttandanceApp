import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoFingerPrintOutline,
  IoAppsOutline, 
  IoListOutline, 
  IoAddOutline,
  IoCheckmarkCircleOutline,
  IoDocumentTextOutline,
  IoEyeOutline
} from "react-icons/io5";
import { API_URL } from "../../config";

const AbsenList = () => {
  const [absensi, setAbsensi] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    getAbsen();
  }, []);

  const getAbsen = async () => {
    try {
      const response = await axios.get(`${API_URL}/absensi/`);
      setAbsensi(response.data || []);
    } catch (error) {
      console.error("Error fetching absensis:", error);
    }
  };

  const getTileGrad = (index) => {
    const grads = ["var(--grad-pink)", "var(--grad-teal)", "var(--grad-blue)", "var(--grad-amber)", "var(--grad-purple)"];
    return grads[index % grads.length];
  };

  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Karyawan &gt; Absensi</span>
          <div className="ribbon-title-wrap">
            <h1 className="ribbon-title">Daftar Kehadiran</h1>
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

          <Link to="/absen/add" className="btn-pill-dark">
            <IoAddOutline style={{ fontSize: "18px" }} />
            <span>Absen Hari Ini</span>
          </Link>
        </div>
      </div>

      {absensi.length === 0 ? (
        <div className="hero-stat-card" style={{ padding: "48px 24px", textAlign: "center", alignItems: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "18px", fontSize: "14px" }}>
            Kamu belum memiliki riwayat absensi.
          </p>
          <Link to="/absen/add" className="btn-pill-dark">
            <IoFingerPrintOutline />
            <span>Mulai Check In Sekarang</span>
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="cards-4col-grid">
          {absensi.map((item, idx) => (
            <div key={item.id} className="class-mini-card">
              <div className="mini-card-top">
                <div className="mini-tile-badge" style={{ background: getTileGrad(idx) }}>
                  <IoCalendarOutline />
                </div>
                <div className="mini-card-info">
                  <div className="mini-card-meta">{item.tanggal_absen}</div>
                  <div className="mini-card-title">{item.user?.nama || "Karyawan"}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(241, 245, 249, 0.5)", padding: "10px 14px", borderRadius: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Masuk</span>
                  <strong>{item.jam_check_in || "-"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Pulang</span>
                  <strong>{item.jam_check_out || "Belum Check-Out"}</strong>
                </div>
              </div>

              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                <strong>Kegiatan: </strong>
                {item.kegiatan && item.kegiatan.length > 0 ? (
                  <span>{item.kegiatan[0].nama_kegiatan}</span>
                ) : (
                  <Link to={`/kegiatan/add/${item.id}`} style={{ color: "#0284c7", fontWeight: "600" }}>
                    + Tulis Kegiatan
                  </Link>
                )}
              </div>

              <div className="mini-card-actions">
                {!item.jam_check_out ? (
                  <Link to={`/absen/edit/${item.id}`} className="btn-pill-dark" style={{ padding: "6px 12px", fontSize: "11px" }}>
                    <IoTimeOutline />
                    <span>Check Out</span>
                  </Link>
                ) : (
                  <span className="pill-badge green">
                    <IoCheckmarkCircleOutline /> Lengkap
                  </span>
                )}

                <Link to={`/absen/detail/${item.id}`} className="btn-pill-light" style={{ padding: "6px 12px", fontSize: "11px" }}>
                  <IoEyeOutline />
                  <span>Detail</span>
                </Link>
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
                <th>Kegiatan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {absensi.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td><strong>{item.tanggal_absen}</strong></td>
                  <td>{item.jam_check_in || "-"}</td>
                  <td>{item.jam_check_out || "-"}</td>
                  <td>
                    {item.kegiatan && item.kegiatan.length > 0 ? (
                      item.kegiatan[0].nama_kegiatan
                    ) : (
                      <Link to={`/kegiatan/add/${item.id}`} style={{ color: "#0284c7", fontWeight: "600" }}>
                        + Isi Kegiatan
                      </Link>
                    )}
                  </td>
                  <td>
                    <span className={`pill-badge ${item.jam_check_out ? "green" : "amber"}`}>
                      {item.jam_check_out ? "Selesai" : "Bekerja"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {!item.jam_check_out && (
                        <Link to={`/absen/edit/${item.id}`} className="btn-pill-dark" style={{ padding: "4px 10px", fontSize: "11px" }}>
                          Check Out
                        </Link>
                      )}
                      <Link to={`/absen/detail/${item.id}`} className="btn-pill-light" style={{ padding: "4px 10px", fontSize: "11px" }}>
                        Detail
                      </Link>
                    </div>
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

export default AbsenList;
