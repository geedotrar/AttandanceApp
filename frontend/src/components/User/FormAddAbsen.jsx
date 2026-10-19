import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
import { 
  IoArrowBackOutline, 
  IoCameraOutline, 
  IoRefreshOutline, 
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoMedkitOutline,
  IoDocumentAttachOutline,
  IoSunnyOutline,
  IoSendOutline
} from "react-icons/io5";
import { API_URL } from "../../config";
import ConfirmModal from "../Common/ConfirmModal";

const FormAddAbsen = () => {
  const webcamRef = useRef(null);
  const [attendanceType, setAttendanceType] = useState("Hadir");
  const [imageSrc, setImageSrc] = useState(null);
  const [showWebcam, setShowWebcam] = useState(true);
  const [keterangan, setKeterangan] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("id-ID"));
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [geoStatus, setGeoStatus] = useState("detecting");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "superadmin")) {
      navigate("/users");
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("id-ID"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCoordinates = () => {
    if ("geolocation" in navigator) {
      setGeoStatus("detecting");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setGeoStatus("ready");
        },
        (err) => {
          console.warn("GPS Geolocation error:", err.message);
          setGeoStatus("error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGeoStatus("error");
    }
  };

  useEffect(() => {
    getCoordinates();
  }, []);

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      setImageSrc(screenshot);
      setShowWebcam(false);
    }
  };

  const retake = () => {
    setImageSrc(null);
    setShowWebcam(true);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleTriggerConfirm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMsg("");

    if (attendanceType === "Hadir" && !imageSrc) {
      setMsg("Silahkan ambil foto selfie presensi terlebih dahulu.");
      return;
    }

    if (attendanceType !== "Hadir" && !keterangan.trim()) {
      setMsg("Silahkan isi keterangan alasan izin terlebih dahulu.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmedSave = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("status_kehadiran", attendanceType);

      if (coords.latitude && coords.longitude) {
        formData.append("latitude", coords.latitude.toString());
        formData.append("longitude", coords.longitude.toString());
      }

      if (attendanceType === "Hadir" && imageSrc) {
        const blobImage = dataURItoBlob(imageSrc);
        formData.append("foto_checkin", blobImage, "checkin_image.jpg");
      } else {
        formData.append("keterangan_izin", keterangan);
        if (attachmentFile) {
          formData.append("foto_checkin", attachmentFile);
        }
      }

      await axios.post(`${API_URL}/absensi`, formData);
      navigate("/absen");
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Gagal melakukan presensi. Silakan periksa koneksi internet.");
      }
    }
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Karyawan &gt; Absensi &gt; Form</span>
          <div className="ribbon-title-wrap">
            <Link to="/absen" className="ribbon-back-btn" title="Kembali">
              <IoArrowBackOutline />
            </Link>
            <h1 className="ribbon-title">
              {attendanceType === "Hadir" ? "Presensi Masuk (Check-In)" : `Pengajuan ${attendanceType}`}
            </h1>
          </div>
        </div>
      </div>

      <div className="glass-form-card" style={{ maxWidth: "620px" }}>
        {msg && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px 18px", borderRadius: "14px", marginBottom: "18px", fontSize: "13px", fontWeight: "600" }}>
            {msg}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", background: "rgba(241, 245, 249, 0.7)", padding: "6px", borderRadius: "16px", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => setAttendanceType("Hadir")}
            className={attendanceType === "Hadir" ? "btn-pill-dark" : "btn-pill-light"}
            style={{ flex: 1, padding: "10px 14px", fontSize: "13px", borderRadius: "12px", border: "none" }}
          >
            <IoCameraOutline style={{ fontSize: "16px" }} />
            <span>Hadir (Selfie)</span>
          </button>
          <button
            type="button"
            onClick={() => setAttendanceType("Izin Sakit")}
            className={attendanceType === "Izin Sakit" ? "btn-pill-dark" : "btn-pill-light"}
            style={{ flex: 1, padding: "10px 14px", fontSize: "13px", borderRadius: "12px", border: "none" }}
          >
            <IoMedkitOutline style={{ fontSize: "16px" }} />
            <span>Izin Sakit</span>
          </button>
          <button
            type="button"
            onClick={() => setAttendanceType("Izin Cuti")}
            className={attendanceType === "Izin Cuti" ? "btn-pill-dark" : "btn-pill-light"}
            style={{ flex: 1, padding: "10px 14px", fontSize: "13px", borderRadius: "12px", border: "none" }}
          >
            <IoSunnyOutline style={{ fontSize: "16px" }} />
            <span>Izin Cuti</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.7)", border: "1px solid rgba(226, 232, 240, 0.8)", padding: "10px 16px", borderRadius: "14px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px" }}>
            <IoLocationOutline style={{ fontSize: "16px", color: geoStatus === "ready" ? "#0d9488" : "#94a3b8" }} />
            {geoStatus === "ready" ? (
              <span>
                <strong>GPS Terdeteksi: </strong>
                {coords.latitude?.toFixed(5)}, {coords.longitude?.toFixed(5)}
              </span>
            ) : geoStatus === "detecting" ? (
              <span style={{ color: "var(--text-muted)" }}>Mendeteksi koordinat lokasi GPS...</span>
            ) : (
              <span style={{ color: "#ef4444" }}>Akses GPS belum diizinkan</span>
            )}
          </div>
          <button
            type="button"
            onClick={getCoordinates}
            className="btn-pill-light"
            style={{ padding: "4px 10px", fontSize: "11px" }}
            title="Perbarui Koordinat"
          >
            <IoRefreshOutline />
            <span>GPS</span>
          </button>
        </div>

        {attendanceType === "Hadir" ? (
          <div>
            <div className="webcam-viewport-card">
              <div className="webcam-live-indicator">
                <span className="webcam-live-dot"></span>
                <span>KAMERA PRESENSI</span>
              </div>

              <div className="webcam-clock-badge">
                <IoTimeOutline style={{ verticalAlign: "-2px", marginRight: "4px" }} />
                {currentTime} WIB
              </div>

              {showWebcam ? (
                <Webcam
                  audio={false}
                  mirrored={true}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              ) : (
                <img src={imageSrc} alt="Preview Foto Selfie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "18px" }}>
              {showWebcam ? (
                <button type="button" onClick={capture} className="btn-pill-dark" style={{ padding: "12px 28px", fontSize: "14px" }}>
                  <IoCameraOutline style={{ fontSize: "20px" }} />
                  <span>Ambil Foto Sekarang</span>
                </button>
              ) : (
                <>
                  <button type="button" onClick={retake} className="btn-pill-light" style={{ padding: "12px 22px" }}>
                    <IoRefreshOutline style={{ fontSize: "18px" }} />
                    <span>Ulangi Foto</span>
                  </button>
                  <button type="button" onClick={handleTriggerConfirm} disabled={isLoading} className="btn-pill-dark" style={{ padding: "12px 28px" }}>
                    <IoCheckmarkCircleOutline style={{ fontSize: "20px" }} />
                    <span>{isLoading ? "Menyimpan..." : "Konfirmasi & Check In"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleTriggerConfirm}>
            <div className="form-group-field">
              <label className="form-label-custom">
                {attendanceType === "Izin Sakit" ? "Keterangan Diagnosa / Gejala Sakit" : "Keterangan Alasan Cuti"}
              </label>
              <textarea
                className="form-input-custom"
                rows="4"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder={
                  attendanceType === "Izin Sakit"
                    ? "Contoh: Demam tinggi dan flu, istirahat dokter 2 hari..."
                    : "Contoh: Cuti tahunan urusan keluarga..."
                }
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="form-group-field">
              <label className="form-label-custom">
                {attendanceType === "Izin Sakit" ? "Lampiran Surat Dokter (Opsional)" : "Lampiran Form Cuti (Opsional)"}
              </label>
              <div style={{ border: "2px dashed rgba(203, 213, 225, 0.9)", borderRadius: "16px", padding: "20px", textAlign: "center", background: "rgba(248, 250, 252, 0.6)" }}>
                <IoDocumentAttachOutline style={{ fontSize: "32px", color: "var(--text-muted)", marginBottom: "8px" }} />
                <input
                  type="file"
                  id="attachmentFileInput"
                  accept="image/*,.pdf"
                  onChange={(e) => setAttachmentFile(e.target.files[0] || null)}
                  style={{ display: "none" }}
                />
                <div>
                  <label htmlFor="attachmentFileInput" className="btn-pill-light" style={{ cursor: "pointer", display: "inline-flex" }}>
                    Pilih File Lampiran
                  </label>
                </div>
                {attachmentFile && (
                  <div style={{ marginTop: "10px", fontSize: "12.5px", color: "#0d9488", fontWeight: "600" }}>
                    Terpilih: {attachmentFile.name} ({(attachmentFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <Link to="/absen" className="btn-pill-light">
                Batal
              </Link>
              <button type="submit" disabled={isLoading} className="btn-pill-dark">
                <IoSendOutline style={{ fontSize: "18px" }} />
                <span>{isLoading ? "Mengirimkan..." : `Ajukan ${attendanceType}`}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmedSave}
        title={attendanceType === "Hadir" ? "Konfirmasi Presensi Masuk" : `Konfirmasi Pengajuan ${attendanceType}`}
        message={
          attendanceType === "Hadir"
            ? "Apakah Anda yakin ingin melakukan check-in presensi masuk sekarang?"
            : `Apakah Anda yakin ingin mengirimkan pengajuan ${attendanceType}?`
        }
        confirmText={attendanceType === "Hadir" ? "Ya, Check In" : "Ya, Kirim Pengajuan"}
        cancelText="Batal"
        type="primary"
        isLoading={isLoading}
      />
    </div>
  );
};

export default FormAddAbsen;
