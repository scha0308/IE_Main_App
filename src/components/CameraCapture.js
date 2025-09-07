import React, { useEffect, useRef, useState } from "react";

export default function CameraCapture({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [errorText, setErrorText] = useState("");

  (() => {
  try {
    if (typeof Element !== "undefined" && !Element.prototype.toJSON) {
      
      Object.defineProperty(Element.prototype, "toJSON", {
        value() { return `[${this.tagName || this.constructor?.name || "Element"}]`; },
        configurable: true
      });
    }
    if (typeof HTMLVideoElement !== "undefined" && !HTMLVideoElement.prototype.toJSON) {
      Object.defineProperty(HTMLVideoElement.prototype, "toJSON", {
        value() { return "[HTMLVideoElement]"; },
        configurable: true
      });
    }
    if (typeof MediaStream !== "undefined" && !MediaStream.prototype.toJSON) {
      Object.defineProperty(MediaStream.prototype, "toJSON", {
        value() { return "[MediaStream]"; },
        configurable: true
      });
    }
    if (typeof MediaStreamTrack !== "undefined" && !MediaStreamTrack.prototype.toJSON) {
      Object.defineProperty(MediaStreamTrack.prototype, "toJSON", {
        value() { return `[MediaStreamTrack:${this.kind||"unknown"}]`; },
        configurable: true
      });
    }
  } catch (_) { }
})();

  useEffect(() => {
    let stream;

    async function startCamera() {
      if (!isOpen) return;
      setErrorText("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorText("Camera not supported in this browser.");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        setErrorText(err?.message || String(err) || "Could not access camera.");
      }
    }

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [isOpen]);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob);
      },
      "image/jpeg",
      0.92
    );
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111",
          color: "#fff",
          borderRadius: 16,
          padding: 16,
          width: "min(95vw, 480px)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Camera</h3>

        {errorText ? (
          <p style={{ color: "#ffb3b3" }}>{errorText}</p>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              style={{ width: "100%", borderRadius: 12, background: "black" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 8,
              border: 0,
              background: "#444",
              color: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={takePhoto}
            disabled={!!errorText}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 8,
              border: 0,
              background: "#00b207",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}