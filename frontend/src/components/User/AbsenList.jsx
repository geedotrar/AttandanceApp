import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoFingerPrintOutline,
  IoAppsOutline, 
  IoListOutline, 
  IoAddOutline,
  IoCheckmarkCircleOutline,
  IoEyeOutline,
  IoLocationOutline,
  IoMedkitOutline,
  IoSunnyOutline
} from "react-icons/io5";
import { API_URL } from "../../config";

const AbsenList = () => {
  const [absensi, setAbsensi] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "superadmin")) {
      navigate("/users");
    }
  }, [user, navigate]);

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

  const getStatusBadge = (status, hasCheckOut) => {
    if (status === "Izin Sakit") {
      return <span className="pill-badge pink"><IoMedkitOutline /> Sakit</span>;
    }
    if (status === "Izin Cuti") {
      return <span className="pill-badge blue"><IoSunnyOutline /> Cuti</span>;
    }
    if (hasCheckOut) {
      return <span className="pill-badge green"><IoCheckmarkCircleOutline /> Lengkap</span>;
    }
    return <span className="pill-badge amber">Bekerja</span>;
  };

  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Karyawan &gt; Absensi</span>
          <div className="ribbon-title-wrap">
            <h1 className="ribbon-title">Daftar Kehadiran & Izin</h1>
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
            <span>Presensi / Izin Hari Ini</span>
          </Link>
        </div>
      </div>

      {absensi.length === 0 ? (
        <div className="hero-stat-card" style={{ padding: "48px 24px", textAlign: "center", alignItems: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "18px", fontSize: "14px" }}>
            Kamu belum memiliki riwayat presensi atau pengajuan izin.
          </p>
          <Link to="/absen/add" className="btn-pill-dark">
            <IoFingerPrintOutline />
            <span>Mulai Presensi Sekarang</span>
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="cards-4col-grid">
          {absensi.map((item, idx) => {
            const isIzin = item.status_kehadiran && item.status_kehadiran !== "Hadir";
            return (
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

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {getStatusBadge(item.status_kehadiran, item.jam_check_out)}
                  {item.latitude && item.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "11px", color: "#0d9488", display: "inline-flex", alignItems: "center", gap: "3px", textDecoration: "none", fontWeight: "600" }}
                    >
                      <IoLocationOutline />
                      <span>GPS</span>
                    </a>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(241, 245, 249, 0.5)", padding: "10px 14px", borderRadius: "14px" }}>
                  {isIzin ? (
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      <strong>Alasan: </strong>
                      <span>{item.keterangan_izin || "Tidak ada keterangan"}</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Masuk</span>
                        <strong>{item.jam_check_in || "-"}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Pulang</span>
                        <strong>{item.jam_check_out || "Belum Check-Out"}</strong>
                      </div>
                    </>
                  )}
                </div>

                {!isIzin && (
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    <strong>Kegiatan: </strong>
                    {item.kegiatan && item.kegiatan.length > 0 && item.kegiatan[0].nama_kegiatan ? (
                      <span>{item.kegiatan[0].nama_kegiatan}</span>
                    ) : (
                      <Link to={`/kegiatan/add/${item.id}`} style={{ color: "#0284c7", fontWeight: "600" }}>
                        + Tulis Kegiatan
                      </Link>
                    )}
                  </div>
                )}

                <div className="mini-card-actions">
                  {!isIzin && !item.jam_check_out ? (
                    <Link to={`/absen/edit/${item.id}`} className="btn-pill-dark" style={{ padding: "6px 12px", fontSize: "11px" }}>
                      <IoTimeOutline />
                      <span>Check Out</span>
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  <Link to={`/absen/detail/${item.id}`} className="btn-pill-light" style={{ padding: "6px 12px", fontSize: "11px" }}>
                    <IoEyeOutline />
                    <span>Detail</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Tipe</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Lokasi GPS</th>
                <th>Kegiatan / Keterangan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {absensi.map((item, idx) => {
                const isIzin = item.status_kehadiran && item.status_kehadiran !== "Hadir";
                return (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td><strong>{item.tanggal_absen}</strong></td>
                    <td>
                      <span className={`pill-badge ${isIzin ? (item.status_kehadiran === "Izin Sakit" ? "pink" : "blue") : "teal"}`}>
                        {item.status_kehadiran || "Hadir"}
                      </span>
                    </td>
                    <td>{item.jam_check_in || "-"}</td>
                    <td>{item.jam_check_out || "-"}</td>
                    <td>
                      {item.latitude && item.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#0d9488", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none", fontWeight: "600", fontSize: "12px" }}
                        >
                          <IoLocationOutline /> Peta
                        </a>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>
                      )}
                    </td>
                    <td>
                      {isIzin ? (
                        <span style={{ fontSize: "12.5px" }}>{item.keterangan_izin || "-"}</span>
                      ) : item.kegiatan && item.kegiatan.length > 0 && item.kegiatan[0].nama_kegiatan ? (
                        item.kegiatan[0].nama_kegiatan
                      ) : (
                        <Link to={`/kegiatan/add/${item.id}`} style={{ color: "#0284c7", fontWeight: "600" }}>
                          + Isi Kegiatan
                        </Link>
                      )}
                    </td>
                    <td>
                      {getStatusBadge(item.status_kehadiran, item.jam_check_out)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {!isIzin && !item.jam_check_out && (
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AbsenList;
