import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

const FormAddAbsen = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showWebcam, setShowWebcam] = useState(true);

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setShowWebcam(false);
  };

  const reset = () => {
    setImageSrc(null);
    setShowWebcam(true);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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

  const checkIn = async (e) => {
    e.preventDefault();
    if (imageSrc === null) {
      alert("Silahkan capture foto terlebih dahulu");
      return;
    }

    try {
      const blobImage = dataURItoBlob(imageSrc);

      const formData = new FormData();
      formData.append("foto_checkin", blobImage, "checkin_image.jpg");

      await axios.post("http://localhost:5000/absensi", formData);

      navigate("/absen");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Check In</h1>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={checkIn}>
              <p className="has-text-centered"></p>

              <div className="field">
                <label className="label">Tanggal Absen</label>
                <div className="control">
                  <input type="text" className="input" placeholder={new Date().toLocaleDateString()} disabled />
                </div>
              </div>

              <div className="field">
                <label className="label">Jam Check In</label>
                <div className="control">
                  <input type="text" className="input" placeholder={currentTime} disabled />
                </div>
              </div>

              <div className="field">
                <label className="label">Foto Check in</label>
                {showWebcam ? <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-auto" /> : <img src={imageSrc} alt="Captured" className="w-full h-auto" />}
                {showWebcam ? (
                  <button type="button" onClick={() => capture()} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-1/2">
                    Capture
                  </button>
                ) : (
                  <button type="button" onClick={() => reset()} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full md:w-1/2">
                    Try again
                  </button>
                )}
                {imageSrc && <input type="file" onChange={() => {}} style={{ display: "none" }} accept="image/*" ref={(fileInput) => (fileInput = fileInput)} />}
              </div>

              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Save
                  </button>

                  <Link to="/absen/" className="button is-danger">
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddAbsen;
