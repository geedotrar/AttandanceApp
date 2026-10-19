import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  IoArrowBackOutline, 
  IoCalendarOutline, 
  IoTrashOutline,
  IoAppsOutline,
  IoListOutline,
  IoLocationOutline,
  IoMedkitOutline,
  IoSunnyOutline,
  IoCheckmarkCircleOutline
} from "react-icons/io5";
import { API_URL } from "../../config";
import ConfirmModal from "../Common/ConfirmModal";

const UserAbsenList = () => {
  const [absensi, setAbsensi] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [absenToDelete, setAbsenToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const isSuperadmin = user?.role === "superadmin";

  const getAbsen = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/absensi/user/${id}`);
      setAbsensi(response.data);
    } catch (error) {
      console.error("Error fetching absensis:", error);
    }
  }, [id]);

  useEffect(() => {
    getAbsen();
  }, [getAbsen]);

  const handleDeleteClick = (absen) => {
    setAbsenToDelete(absen);
  };

  const handleConfirmDelete = async () => {
    if (!absenToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/absensi/${absenToDelete.id}`);
      setIsDeleting(false);
      setAbsenToDelete(null);
      getAbsen();
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting absen:", error);
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
          <span className="ribbon-breadcrumb">
            Portal Perusahaan &gt; {absensi.divisi || "Karyawan"} &gt; Log Presensi
          </span>
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
            Karyawan ini belum memiliki catatan absensi atau pengajuan izin.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="cards-4col-grid">
          {list.map((absen, idx) => {
            const isIzin = absen.status_kehadiran && absen.status_kehadiran !== "Hadir";
            return (
              <div key={absen.id} className="class-mini-card">
                <div className="mini-card-top">
                  <div className="mini-tile-badge" style={{ background: getTileGrad(idx) }}>
                    <IoCalendarOutline />
                  </div>
                  <div className="mini-card-info">
                    <div className="mini-card-meta">{absen.tanggal_absen}</div>
                    <div className="mini-card-title">{absen.status_kehadiran || "Presensi"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {getStatusBadge(absen.status_kehadiran, absen.jam_check_out)}
                  {absen.latitude && absen.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${absen.latitude},${absen.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "11px", color: "#0d9488", display: "inline-flex", alignItems: "center", gap: "3px", textDecoration: "none", fontWeight: "600" }}
                      title="Lihat Titik Lokasi di Google Maps"
                    >
                      <IoLocationOutline />
                      <span>GPS</span>
                    </a>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div style={{ height: "90px", borderRadius: "12px", overflow: "hidden", background: "#0f172a" }}>
                    {absen.foto_checkin ? (
                      <img 
                        crossOrigin="anonymous" 
                        src={`${API_URL}/${absen.foto_checkin}`} 
                        alt="Check In / Dokumen" 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      />
                    ) : (
                      <div style={{ color: "#64748b", fontSize: "10px", textAlign: "center", paddingTop: "35px" }}>
                        {isIzin ? "Tanpa Lampiran" : "No Photo"}
                      </div>
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
                      <div style={{ color: "#64748b", fontSize: "10px", textAlign: "center", paddingTop: "35px" }}>
                        {isIzin ? "-" : "Belum Out"}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px" }}>
                  {isIzin ? (
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Keterangan: </span>
                      <strong>{absen.keterangan_izin || "-"}</strong>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)" }}>Masuk</span>
                        <strong>{absen.jam_check_in || "-"}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)" }}>Pulang</span>
                        <strong>{absen.jam_check_out || "-"}</strong>
                      </div>
                    </>
                  )}
                </div>

                <div className="mini-card-actions">
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    ID: #{absen.id}
                  </span>

                  {isSuperadmin && (
                    <button 
                      onClick={() => handleDeleteClick(absen)} 
                      className="header-icon-btn" 
                      style={{ width: "32px", height: "32px", color: "#ef4444" }} 
                      title="Hapus Presensi"
                    >
                      <IoTrashOutline />
                    </button>
                  )}
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
                <th>Foto In / Dokumen</th>
                <th>Foto Out</th>
                <th>Keterangan / Kegiatan</th>
                {isSuperadmin && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {list.map((absen, idx) => {
                const isIzin = absen.status_kehadiran && absen.status_kehadiran !== "Hadir";
                return (
                  <tr key={absen.id}>
                    <td>{idx + 1}</td>
                    <td><strong>{absen.tanggal_absen}</strong></td>
                    <td>
                      <span className={`pill-badge ${isIzin ? (absen.status_kehadiran === "Izin Sakit" ? "pink" : "blue") : "teal"}`}>
                        {absen.status_kehadiran || "Hadir"}
                      </span>
                    </td>
                    <td>{absen.jam_check_in || "-"}</td>
                    <td>{absen.jam_check_out || "-"}</td>
                    <td>
                      {absen.latitude && absen.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${absen.latitude},${absen.longitude}`}
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
                      {isIzin
                        ? (absen.keterangan_izin || "-")
                        : (absen.kegiatan && absen.kegiatan.length > 0
                            ? absen.kegiatan.map((k) => k.nama_kegiatan).join(", ")
                            : "-")}
                    </td>
                    {isSuperadmin && (
                      <td>
                        <button onClick={() => handleDeleteClick(absen)} className="btn-pill-light" style={{ padding: "4px 10px", fontSize: "11px", color: "#ef4444" }}>
                          Hapus
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!absenToDelete}
        onClose={() => setAbsenToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus Presensi"
        message={`Apakah Anda yakin ingin menghapus data presensi tanggal "${absenToDelete?.tanggal_absen}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserAbsenList;
