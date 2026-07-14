import { useEffect, useRef, useState, useCallback } from "react";
import { HiOutlineCamera, HiOutlineArrowPath, HiOutlineXMark } from "react-icons/hi2";

// A self-contained camera modal. Works on phones, laptops and desktops via
// the browser's getUserMedia API. On mobile it lets the user flip between
// the front and back camera.
const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startStream = useCallback(async () => {
    setError("");
    setReady(false);
    stopStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
    } catch (err) {
      setError(
        "Unable to access the camera. Please allow camera permissions and try again."
      );
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    startStream();
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    stopStream();
    onCapture(dataUrl);
  };

  const flipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleClose = () => {
    stopStream();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Capture Product Photo</h3>
          <button
            onClick={handleClose}
            className="btn-icon text-slate-300 hover:bg-white/10"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-[4/3] w-full bg-black">
          {error ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-red-300">
              {error}
            </div>
          ) : (
            <video
              ref={videoRef}
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex items-center justify-center gap-4 px-4 py-4">
          <button
            onClick={flipCamera}
            className="btn-icon bg-white/10 text-white hover:bg-white/20"
            title="Switch camera"
          >
            <HiOutlineArrowPath className="h-5 w-5" />
          </button>
          <button
            onClick={handleCapture}
            disabled={!ready}
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80 bg-white/20 text-white transition hover:bg-white/30 disabled:opacity-40"
            title="Capture photo"
          >
            <HiOutlineCamera className="h-7 w-7" />
          </button>
          <div className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
