import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onShowCode: () => void;
  onOpenSettings: () => void;
  onScan: () => void;
  isScanning: boolean;
}

const CameraView: React.FC<Props> = ({ onShowCode, onOpenSettings, onScan, isScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [cameraStarted, setCameraStarted] = useState(false);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStarted(true);
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  useEffect(() => {
    if (isScanning) {
      setPhase('scanning');

      scanTimer.current = setTimeout(() => setPhase('done'), 4000);
      doneTimer.current = setTimeout(() => setPhase('idle'), 7000);
    }

    return () => {
      if (scanTimer.current) clearTimeout(scanTimer.current);
      if (doneTimer.current) clearTimeout(doneTimer.current);
    };
  }, [isScanning]);

  const handleStartClick = () => {
    startCamera();
  };

  const handleScanClick = () => {
    onScan();
  };

  return (
    <div className="camera-view">
      <video ref={videoRef} autoPlay playsInline muted className="video-bg" />

      {!cameraStarted ? (
        <div className="start-overlay">
          <button className="start-button" onClick={handleStartClick}>
            Spustiť skenovanie
          </button>
        </div>
      ) : (
        <>
          {/* ⚙️ Nastavenia */}
          <button onClick={onOpenSettings} className="settings-btn"
            style={{ zIndex: 100, pointerEvents: 'auto', position: 'absolute' }}>
            ⚙️
          </button>

          {/* 🔐 Tajný kód */}
          <button onClick={onShowCode} className="code-toggle-btn" style={{ zIndex: 10 }}>
            🔐
          </button>

          {/* Skenovacie okno */}
          <div className="scan-frame">
            {phase !== 'done' && <div className="scan-line" />}
            {phase === 'scanning' && (
              <div className="scan-face-container">
                <img
                  src={`${import.meta.env.BASE_URL}face-white.png`}
                  alt="Scanning face"
                  className="scan-face"
                />
                <div className="face-scan-mask" />
              </div>
            )}
            {phase === 'done' && (
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14 27l7 7 17-17" />
              </svg>
            )}
          </div>

          {/* Skenovacie tlačidlo */}
          <button className="scan-btn" onClick={handleScanClick} style={{ zIndex: 10 }} />
        </>
      )}
    </div>
  );
};

export default CameraView;
