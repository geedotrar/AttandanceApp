import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { 
  IoArrowBackOutline, 
  IoCheckmarkCircleOutline, 
  IoTimeOutline, 
  IoCameraOutline, 
  IoDocumentTextOutline,
  IoCalendarOutline
} from "react-icons/io5";
import { API_URL } from "../../config";

const AbsenDetailList = () => {
  const [absenDetail, setAbsenDetail] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getAbsen();
  }, [id]);

  const getAbsen = async () => {
    try {
      const response = await axios.get(`${API_URL}/absensi/${id}`);
      setAbsenDetail(response.data);
    } catch (error) {
      console.error("Error fetching absensi detail:", error);
    }
  };

  if (!absenDetail) {
    return (
      <div className="hero-stat-card" style={{ padding: "40px", textAlign: "center" }}>
        <p>Memuat data detail presensi...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Karyawan &gt; Absensi &gt; Detail</span>
          <div className="ribbon-title-wrap">
            <Link to="/absen" className="ribbon-back-btn" title="Kembali">
              <IoArrowBackOutline />
            </Link>
            <h1 className="ribbon-title">Detail Presensi Harian</h1>
          </div>
        </div>

        <div className="ribbon-right">
          <Link to="/absen" className="btn-pill-light">
            <span>Kembali ke Daftar</span>
          </Link>
          {!absenDetail.jam_check_out && (
            <Link to={`/absen/edit/${id}`} className="btn-pill-dark">
              <IoTimeOutline />
              <span>Check Out Sekarang</span>
            </Link>
          )}
        </div>
      </div>

      <div className="hero-stat-grid" style={{ marginBottom: "24px" }}>
        <div className="hero-stat-card">
          <div className="hero-card-header">
            <div className="hero-tile-icon hero-tile-teal">
              <IoCameraOutline />
            </div>
            <div className="hero-meta-block">
              <div className="hero-tag-row">
                <span className="hero-tag-text">Foto Masuk (Check-In)</span>
                <span className="pill-badge green">Tercatat</span>
              </div>
              <h2 className="hero-card-title">{absenDetail.jam_check_in || "-"} WIB</h2>
              <p className="hero-card-desc">Tanggal Presensi: {absenDetail.tanggal_absen}</p>
            </div>
          </div>

          <div style={{ borderRadius: "20px", overflow: "hidden", background: "#0f172a", maxHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {absenDetail.foto_checkin ? (
              <img 
                crossOrigin="anonymous" 
                src={`${API_URL}/${absenDetail.foto_checkin}`} 
                alt="Foto Check In" 
                style={{ width: "100%", height: "280px", objectFit: "cover" }} 
              />
            ) : (
              <div style={{ color: "#94a3b8", padding: "40px", textAlign: "center" }}>
                Tidak ada foto check-in
              </div>
            )}
          </div>
        </div>

        <div className="hero-stat-card">
          <div className="hero-card-header">
            <div className="hero-tile-icon hero-tile-pink">
              <IoTimeOutline />
            </div>
            <div className="hero-meta-block">
              <div className="hero-tag-row">
                <span className="hero-tag-text">Foto Pulang (Check-Out)</span>
                <span className={`pill-badge ${absenDetail.jam_check_out ? "green" : "amber"}`}>
                  {absenDetail.jam_check_out ? "Selesai" : "Belum Selesai"}
                </span>
              </div>
              <h2 className="hero-card-title">
                {absenDetail.jam_check_out ? `${absenDetail.jam_check_out} WIB` : "Belum Check-Out"}
              </h2>
              <p className="hero-card-desc">Status hari kerja: {absenDetail.jam_check_out ? "Hari kerja lengkap" : "Sedang bertugas"}</p>
            </div>
          </div>

          <div style={{ borderRadius: "20px", overflow: "hidden", background: "#0f172a", maxHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {absenDetail.foto_checkout ? (
              <img 
                crossOrigin="anonymous" 
                src={`${API_URL}/${absenDetail.foto_checkout}`} 
                alt="Foto Check Out" 
                style={{ width: "100%", height: "280px", objectFit: "cover" }} 
              />
            ) : (
              <div style={{ color: "#94a3b8", padding: "40px", textAlign: "center" }}>
                <p style={{ marginBottom: "12px" }}>Karyawan belum melakukan check-out</p>
                <Link to={`/absen/edit/${id}`} className="btn-pill-dark" style={{ fontSize: "12px" }}>
                  Ambil Foto Check Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hero-stat-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="mini-tile-badge" style={{ background: "var(--grad-blue)" }}>
              <IoDocumentTextOutline />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)" }}>Laporan Kegiatan Hari Ini</h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Ringkasan pekerjaan atau tugas yang diselesaikan</p>
            </div>
          </div>

          <Link to={`/kegiatan/add/${id}`} className="btn-pill-light" style={{ padding: "6px 14px", fontSize: "12px" }}>
            {absenDetail.kegiatan && absenDetail.kegiatan.length > 0 ? "Edit Kegiatan" : "+ Tulis Kegiatan"}
          </Link>
        </div>

        <div style={{ background: "rgba(241, 245, 249, 0.6)", padding: "20px 24px", borderRadius: "18px", border: "1px solid rgba(226, 232, 240, 0.8)" }}>
          {absenDetail.kegiatan && absenDetail.kegiatan.length > 0 ? (
            <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: "1.6" }}>
              {absenDetail.kegiatan[0].nama_kegiatan}
            </p>
          ) : (
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", fontStyle: "italic" }}>
              Belum ada catatan kegiatan yang diisi untuk absensi ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbsenDetailList;
