import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { 
  IoArrowBackOutline, 
  IoCameraOutline, 
  IoRefreshOutline, 
  IoCheckmarkCircleOutline,
  IoFingerPrintOutline,
  IoTimeOutline
} from "react-icons/io5";
import { API_URL } from "../../config";

const FormAddAbsen = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showWebcam, setShowWebcam] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("id-ID"));
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const saveAbsen = async (e) => {
    e.preventDefault();
    if (!imageSrc) {
      alert("Silahkan ambil foto selfie terlebih dahulu");
      return;
    }

    setIsLoading(true);
    try {
      const blobImage = dataURItoBlob(imageSrc);
      const formData = new FormData();
      formData.append("foto_checkin", blobImage, "checkin_image.jpg");

      await axios.post(`${API_URL}/absensi`, formData);
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
          <span className="ribbon-breadcrumb">Portal Karyawan &gt; Absensi &gt; Check In</span>
          <div className="ribbon-title-wrap">
            <Link to="/absen" className="ribbon-back-btn" title="Kembali">
              <IoArrowBackOutline />
            </Link>
            <h1 className="ribbon-title">Presensi Masuk (Check-In)</h1>
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
              <button type="button" onClick={saveAbsen} disabled={isLoading} className="btn-pill-dark" style={{ padding: "12px 28px" }}>
                <IoCheckmarkCircleOutline style={{ fontSize: "20px" }} />
                <span>{isLoading ? "Menyimpan..." : "Konfirmasi & Check In"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormAddAbsen;
