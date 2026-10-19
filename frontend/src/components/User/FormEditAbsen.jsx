import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
import { 
  IoArrowBackOutline, 
  IoCameraOutline, 
  IoRefreshOutline, 
  IoCheckmarkCircleOutline,
  IoTimeOutline
} from "react-icons/io5";
import { API_URL } from "../../config";
import ConfirmModal from "../Common/ConfirmModal";

const FormEditAbsen = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showWebcam, setShowWebcam] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("id-ID"));
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
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

  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImageSrc(screenshot);
    setShowWebcam(false);
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

  const handleTriggerConfirm = () => {
    setMsg("");
    if (!imageSrc) {
      setMsg("Silahkan ambil foto selfie terlebih dahulu.");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmedUpdate = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const blobImage = dataURItoBlob(imageSrc);
      const formData = new FormData();
      formData.append("foto_checkout", blobImage, "checkout_image.jpg");

      await axios.put(`${API_URL}/absensi/${id}`, formData);
      navigate("/absen");
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        setMsg(error.response.data.msg);
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
          <span className="ribbon-breadcrumb">Portal Karyawan &gt; Absensi &gt; Check Out</span>
          <div className="ribbon-title-wrap">
            <Link to="/absen" className="ribbon-back-btn" title="Kembali">
              <IoArrowBackOutline />
            </Link>
            <h1 className="ribbon-title">Presensi Pulang (Check-Out)</h1>
          </div>
        </div>
      </div>

      <div className="glass-form-card" style={{ maxWidth: "600px" }}>
        {msg && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px 18px", borderRadius: "14px", marginBottom: "18px", fontSize: "13px", fontWeight: "600" }}>
            {msg}
          </div>
        )}

        <div className="webcam-viewport-card">
          <div className="webcam-live-indicator">
            <span className="webcam-live-dot"></span>
            <span>KAMERA PULANG</span>
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
              <span>Ambil Foto Check Out</span>
            </button>
          ) : (
            <>
              <button type="button" onClick={retake} className="btn-pill-light" style={{ padding: "12px 22px" }}>
                <IoRefreshOutline style={{ fontSize: "18px" }} />
                <span>Ulangi Foto</span>
              </button>
              <button type="button" onClick={handleTriggerConfirm} disabled={isLoading} className="btn-pill-dark" style={{ padding: "12px 28px" }}>
                <IoCheckmarkCircleOutline style={{ fontSize: "20px" }} />
                <span>{isLoading ? "Menyimpan..." : "Konfirmasi & Selesai Kerja"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmedUpdate}
        title="Konfirmasi Check Out Presensi"
        message="Apakah Anda yakin ingin menyelesaikan jam kerja dan melakukan presensi pulang (Check-Out) sekarang?"
        confirmText="Ya, Selesai Kerja"
        cancelText="Batal"
        type="primary"
        isLoading={isLoading}
      />
    </div>
  );
};

export default FormEditAbsen;
