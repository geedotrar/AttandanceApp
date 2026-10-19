import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { 
  IoArrowBackOutline, 
  IoTimeOutline, 
  IoCameraOutline, 
  IoDocumentTextOutline,
  IoLocationOutline,
  IoMedkitOutline,
  IoSunnyOutline,
  IoAttachOutline
} from "react-icons/io5";
import { API_URL } from "../../config";

const AbsenDetailList = () => {
  const [absenDetail, setAbsenDetail] = useState(null);
  const { id } = useParams();

  const getAbsen = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/absensi/${id}`);
      setAbsenDetail(response.data);
    } catch (error) {
      console.error("Error fetching absensi detail:", error);
    }
  }, [id]);

  useEffect(() => {
    getAbsen();
  }, [getAbsen]);

  if (!absenDetail) {
    return (
      <div className="hero-stat-card" style={{ padding: "40px", textAlign: "center" }}>
        <p>Memuat data detail presensi...</p>
      </div>
    );
  }

  const isIzin = absenDetail.status_kehadiran && absenDetail.status_kehadiran !== "Hadir";

  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Karyawan &gt; Absensi &gt; Detail</span>
          <div className="ribbon-title-wrap">
            <Link to="/absen" className="ribbon-back-btn" title="Kembali">
              <IoArrowBackOutline />
            </Link>
            <h1 className="ribbon-title">
              {isIzin ? `Detail Pengajuan: ${absenDetail.status_kehadiran}` : "Detail Presensi Harian"}
            </h1>
          </div>
        </div>

        <div className="ribbon-right">
          <Link to="/absen" className="btn-pill-light">
            <span>Kembali ke Daftar</span>
          </Link>
          {!isIzin && !absenDetail.jam_check_out && (
            <Link to={`/absen/edit/${id}`} className="btn-pill-dark">
              <IoTimeOutline />
              <span>Check Out Sekarang</span>
            </Link>
          )}
        </div>
      </div>

      {absenDetail.latitude && absenDetail.longitude && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", padding: "14px 20px", borderRadius: "18px", border: "1px solid rgba(226, 232, 240, 0.9)", marginBottom: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="mini-tile-badge" style={{ background: "var(--grad-teal)", width: "36px", height: "36px", fontSize: "16px" }}>
              <IoLocationOutline />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>Lokasi Koordinat Presensi (GPS)</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Lintang: {absenDetail.latitude} | Bujur: {absenDetail.longitude}
              </div>
            </div>
          </div>
          <a
            href={`https://www.google.com/maps?q=${absenDetail.latitude},${absenDetail.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="btn-pill-dark"
            style={{ padding: "6px 14px", fontSize: "12px", textDecoration: "none" }}
          >
            Buka di Google Maps
          </a>
        </div>
      )}

      {isIzin ? (
        <div className="hero-stat-grid" style={{ marginBottom: "24px" }}>
          <div className="hero-stat-card">
            <div className="hero-card-header">
              <div className="hero-tile-icon hero-tile-pink">
                {absenDetail.status_kehadiran === "Izin Sakit" ? <IoMedkitOutline /> : <IoSunnyOutline />}
              </div>
              <div className="hero-meta-block">
                <div className="hero-tag-row">
                  <span className="hero-tag-text">Status Pengajuan</span>
                  <span className="pill-badge blue">{absenDetail.status_kehadiran}</span>
                </div>
                <h2 className="hero-card-title">{absenDetail.status_kehadiran}</h2>
                <p className="hero-card-desc">Tanggal Pengajuan: {absenDetail.tanggal_absen}</p>
              </div>
            </div>

            <div style={{ background: "rgba(241, 245, 249, 0.6)", padding: "18px", borderRadius: "16px", marginTop: "14px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                Keterangan / Alasan
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: "1.6" }}>
                {absenDetail.keterangan_izin || "Tidak ada rincian alasan yang dicantumkan."}
              </p>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="hero-card-header">
              <div className="hero-tile-icon hero-tile-teal">
                <IoAttachOutline />
              </div>
              <div className="hero-meta-block">
                <div className="hero-tag-row">
                  <span className="hero-tag-text">Dokumen / Bukti Surat</span>
                  <span className={`pill-badge ${absenDetail.foto_checkin ? "green" : "gray"}`}>
                    {absenDetail.foto_checkin ? "Ada Lampiran" : "Tanpa Lampiran"}
                  </span>
                </div>
                <h2 className="hero-card-title">Surat Pendukung</h2>
                <p className="hero-card-desc">Bukti persetujuan atau surat dokter</p>
              </div>
            </div>

            <div style={{ borderRadius: "20px", overflow: "hidden", background: "#0f172a", maxHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {absenDetail.foto_checkin ? (
                <img 
                  crossOrigin="anonymous" 
                  src={`${API_URL}/${absenDetail.foto_checkin}`} 
                  alt="Bukti Lampiran Izin" 
                  style={{ width: "100%", height: "280px", objectFit: "contain", background: "#1e293b" }} 
                />
              ) : (
                <div style={{ color: "#94a3b8", padding: "40px", textAlign: "center", fontSize: "13px" }}>
                  Tidak ada dokumen lampiran yang diunggah.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
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
      )}

      {!isIzin && (
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
            {absenDetail.kegiatan && absenDetail.kegiatan.length > 0 && absenDetail.kegiatan[0].nama_kegiatan ? (
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
      )}
    </div>
  );
};

export default AbsenDetailList;
