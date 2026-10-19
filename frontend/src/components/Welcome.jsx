import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  IoFingerPrintOutline, 
  IoPeopleOutline, 
  IoTimeOutline, 
  IoCheckmarkCircleOutline, 
  IoArrowForwardOutline
} from "react-icons/io5";
import { API_URL } from "../config";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [absensiList, setAbsensiList] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
  const currentDate = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await axios.get(`${API_URL}/absensi/`);
        setAbsensiList(response.data || []);
      } catch (err) {
      }
    };
    fetchRecent();
  }, []);

  const isMonitoringAdmin = user?.role === "superadmin" || user?.role === "admin";
  const latestAbsen = absensiList[0] || null;
  const isCheckedIn = Boolean(latestAbsen && latestAbsen.jam_check_in);
  const isCheckedOut = Boolean(latestAbsen && latestAbsen.jam_check_out);

  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Perusahaan &gt; Beranda</span>
          <div className="ribbon-title-wrap">
            <h1 className="ribbon-title">
              {isMonitoringAdmin ? "Monitoring Kehadiran Perusahaan" : "Dashboard Presensi"}
            </h1>
          </div>
        </div>

        <div className="ribbon-right">
          {isMonitoringAdmin ? (
            <Link to="/users" className="btn-pill-dark">
              <IoPeopleOutline style={{ fontSize: "18px" }} />
              <span>Pantau Karyawan</span>
            </Link>
          ) : !isCheckedIn ? (
            <Link to="/absen/add" className="btn-pill-dark">
              <IoFingerPrintOutline />
              <span>Check In Sekarang</span>
            </Link>
          ) : !isCheckedOut ? (
            <Link to={`/absen/edit/${latestAbsen?.id}`} className="btn-pill-dark">
              <IoTimeOutline />
              <span>Check Out Pulang</span>
            </Link>
          ) : (
            <Link to="/absen" className="btn-pill-dark">
              <IoCheckmarkCircleOutline />
              <span>Lihat Rekap Absen</span>
            </Link>
          )}
        </div>
      </div>

      <div className="hero-stat-grid">
        {isMonitoringAdmin ? (
          <div className="hero-stat-card">
            <div className="hero-card-header">
              <div className="hero-tile-icon hero-tile-teal">
                <IoTimeOutline />
              </div>
              <div className="hero-meta-block">
                <div className="hero-tag-row">
                  <span className="hero-tag-text">{currentDate}</span>
                  <span className="status-dot-pill"></span>
                </div>
                <h2 className="hero-card-title">Pemantauan Presensi Tim</h2>
                <p className="hero-card-desc">
                  Waktu server saat ini pukul {currentTime} WIB. Pantau kehadiran, jam kerja, koordinat GPS, dan verifikasi foto staf secara langsung.
                </p>
              </div>
            </div>
            <div className="hero-card-footer">
              <div className="segmented-progress-wrap">
                <span className="progress-label-text">Aktivitas Presensi</span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600" }}>
                  {absensiList.length} catatan kehadiran
                </span>
              </div>
              <Link to="/users" className="btn-pill-dark" style={{ padding: "8px 18px", fontSize: "12px" }}>
                <span>Pantau Seluruh Karyawan</span>
                <IoArrowForwardOutline />
              </Link>
            </div>
          </div>
        ) : (
          <div className="hero-stat-card">
            <div className="hero-card-header">
              <div className="hero-tile-icon hero-tile-pink">
                <IoFingerPrintOutline />
              </div>
              <div className="hero-meta-block">
                <div className="hero-tag-row">
                  <span className="hero-tag-text">{currentDate}</span>
                  <span className={`status-dot-pill ${isCheckedIn ? "" : "warning"}`}></span>
                </div>
                <h2 className="hero-card-title">
                  {isCheckedIn ? "Presensi Hari Ini: Tercatat" : "Belum Melakukan Check-In"}
                </h2>
                <p className="hero-card-desc">
                  {isCheckedIn 
                    ? `Masuk pukul ${latestAbsen.jam_check_in || "-"} WIB ${latestAbsen.jam_check_out ? `• Pulang ${latestAbsen.jam_check_out} WIB` : "• Sedang Bekerja"}`
                    : `Waktu saat ini menunjukkan pukul ${currentTime} WIB. Pastikan kamu mengambil foto selfie untuk presensi masuk.`
                  }
                </p>
              </div>
            </div>
            <div className="hero-card-footer">
              <div className="segmented-progress-wrap">
                <span className="progress-label-text">Status Kerja Harian</span>
                <div className="segmented-bars">
                  <span className={`segment-pill ${isCheckedIn ? "done" : "empty"}`}></span>
                  <span className={`segment-pill ${isCheckedOut ? "done" : isCheckedIn ? "mid" : "empty"}`}></span>
                  <span className="segment-pill empty"></span>
                </div>
              </div>
              {!isCheckedIn ? (
                <Link to="/absen/add" className="btn-pill-dark" style={{ padding: "8px 18px", fontSize: "12px" }}>
                  <span>Ambil Foto Check-In</span>
                  <IoArrowForwardOutline />
                </Link>
              ) : !isCheckedOut ? (
                <Link to={`/absen/edit/${latestAbsen?.id}`} className="btn-pill-light" style={{ padding: "8px 18px", fontSize: "12px" }}>
                  <span>Selesaikan Kerja &amp; Check-Out</span>
                  <IoArrowForwardOutline />
                </Link>
              ) : (
                <span className="pill-badge green">
                  <IoCheckmarkCircleOutline /> Absensi Lengkap
                </span>
              )}
            </div>
          </div>
        )}

        <div className="hero-stat-card">
          <div className="hero-card-header">
            <div className="hero-tile-icon hero-tile-teal">
              <IoPeopleOutline />
            </div>
            <div className="hero-meta-block">
              <div className="hero-tag-row">
                <span className="hero-tag-text">Sistem Operasional Perusahaan</span>
                <span className="status-dot-pill"></span>
              </div>
              <h2 className="hero-card-title">
                {isMonitoringAdmin ? "Manajemen SDM & Divisi" : "Karyawan & Produktivitas"}
              </h2>
              <p className="hero-card-desc">
                Selamat datang kembali, <strong>{user?.nama || user?.username}</strong>. Semua log absensi tersinkronisasi langsung dengan database server.
              </p>
            </div>
          </div>
          <div className="hero-card-footer">
            <div className="segmented-progress-wrap">
              <span className="progress-label-text">Tim &amp; Departemen</span>
              <div className="avatar-stack-wrap">
                <div className="avatar-circle" style={{ background: "#0284c7" }}>AD</div>
                <div className="avatar-circle" style={{ background: "#0d9488" }}>IT</div>
                <div className="avatar-circle" style={{ background: "#7c3aed" }}>HR</div>
                <div className="avatar-circle" style={{ background: "#ea580c" }}>OP</div>
                <span className="avatar-more-pill">+ Aktif</span>
              </div>
            </div>
            {isMonitoringAdmin ? (
              <Link to="/users" className="btn-pill-light" style={{ padding: "8px 18px", fontSize: "12px" }}>
                <span>Kelola Karyawan</span>
                <IoArrowForwardOutline />
              </Link>
            ) : (
              <Link to="/absen" className="btn-pill-light" style={{ padding: "8px 18px", fontSize: "12px" }}>
                <span>Riwayat Lengkap</span>
                <IoArrowForwardOutline />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 className="section-subtitle-heading">
            {isMonitoringAdmin ? "Monitoring Log Presensi Karyawan" : "Riwayat Presensi Terbaru"}
          </h3>
          <Link
            to={isMonitoringAdmin ? "/users" : "/absen"}
            style={{ fontSize: "13px", fontWeight: "700", color: "#0369a1", textDecoration: "none" }}
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        {absensiList.length === 0 ? (
          <div className="hero-stat-card" style={{ padding: "40px", textAlign: "center", alignItems: "center" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "16px", fontSize: "14px" }}>
              {isMonitoringAdmin ? "Belum ada catatan presensi karyawan yang masuk." : "Belum ada data presensi tercatat di sistem."}
            </p>
            {!isMonitoringAdmin && (
              <Link to="/absen/add" className="btn-pill-dark">
                <IoFingerPrintOutline />
                <span>Mulai Check-In Hari Ini</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Karyawan</th>
                  <th>Tanggal</th>
                  <th>Masuk</th>
                  <th>Pulang</th>
                  <th>Kegiatan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {absensiList.slice(0, 8).map((absen, idx) => (
                  <tr key={absen.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{absen.user?.nama || "Karyawan"}</strong>
                    </td>
                    <td>{absen.tanggal_absen}</td>
                    <td>{absen.jam_check_in || "-"}</td>
                    <td>{absen.jam_check_out || "-"}</td>
                    <td>
                      {absen.kegiatan && absen.kegiatan.length > 0
                        ? absen.kegiatan[0].nama_kegiatan
                        : "-"}
                    </td>
                    <td>
                      <span className={`pill-badge ${absen.jam_check_out ? "green" : "amber"}`}>
                        {absen.jam_check_out ? "Selesai" : "Aktif"}
                      </span>
                    </td>
                    <td>
                      <Link to={`/absen/detail/${absen.id}`} className="btn-pill-light" style={{ padding: "4px 12px", fontSize: "11px" }}>
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
