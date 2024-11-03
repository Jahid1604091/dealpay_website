import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isCapturing, setIsCapturing] = useState(true);

  const startCamera = () => {
    setIsCapturing(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
      });
  };

  useEffect(()=>{
    startCamera()
  }, [])

  const captureImage = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageUrl = canvasRef.current.toDataURL("image/png");
    onCapture(imageUrl);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setIsCapturing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white p-5 rounded-lg">
        {isCapturing && (
          <div className="flex flex-col items-center">
            <video ref={videoRef} width="100%" height="auto" className="rounded-lg mb-4" />
            <div className="flex gap-4">
              <button
                onClick={captureImage}
                className="bg-green-500 text-white rounded-full p-3"
              >
                <FontAwesomeIcon icon={faCamera} size="2x" />
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-500 text-white rounded-full p-3"
              >
                <FontAwesomeIcon icon={faTimesCircle} size="2x" />
              </button>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }}></canvas>
      </div>
    </div>
  );
};

export default CameraCapture;
