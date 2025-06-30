import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onShowCode: () => void;
  onOpenSettings: () => void;
  onScan: () => void;
  isScanning: boolean;
}

const CameraView: React.FC<Props> = ({
  onShowCode,
  onOpenSettings,
  onScan,
  isScanning,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [cameraStarted, setCameraStarted] = useState(false);
  const [showErrorIcon, setShowErrorIcon] = useState(false);
  const [resultKey, setResultKey] = useState(0);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
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

  useEffect(() => {
    if (phase === 'idle') {
      setResultKey((prev) => prev + 1); // ← kľúč pre re-render ikonky
    }
  }, [phase, showErrorIcon]);

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
          {/* ✅ Horný panel s ikonami */}
          <div className="top-bar">
            <div className="top-bar-inner">
              <button
                type="button"
                className="top-bar-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowCode();
                }}
              >
                🔐
              </button>
              <button
                type="button"
                className="top-bar-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSettings();
                }}
              >
                ⚙️
              </button>
            </div>
          </div>

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
              <>
                {showErrorIcon ? (
                  <svg
                    key={`x-${resultKey}`}
                    className="checkmark-svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark-circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      d="M16 16 L36 36 M36 16 L16 36"
                      stroke="#ff4444"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    key={`check-${resultKey}`}
                    className="checkmark-svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark-circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark-check"
                      fill="none"
                      d="M14 27l7 7 17-17"
                    />
                  </svg>
                )}
              </>
            )}
          </div>

          {/* Prepínač medzi ✅ / ❌ */}
          <button
            className={`toggle-x-btn ${showErrorIcon ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowErrorIcon((prev) => !prev);
            }}
            title="Prepni medzi ✅ / ❌"
          >
            ⬤
          </button>

          {/* Skenovacie tlačidlo */}
          <button className="scan-btn" onClick={handleScanClick} />
        </>
      )}
    </div>
  );
};

export default CameraView;
