import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showWebcam, setShowWebcam] = useState(true);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setShowWebcam(false);
  };

  const reset = () => {
    setImageSrc(null);
    setShowWebcam(true);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center items-center ">
        <div className="w-full md:w-full">
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
          {imageSrc && (
            <>
              <input type="text" value={imageSrc} readOnly className="mt-4 w-full md:w-1/2" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
