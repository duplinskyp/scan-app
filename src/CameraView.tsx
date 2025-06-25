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

  useEffect(() => {
    let isMounted = true;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      .then(stream => {
        if (videoRef.current && isMounted) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Camera error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      setPhase('scanning');

      const scanTimeout = setTimeout(() => setPhase('done'), 4000); // 4s scanning
      const doneTimeout = setTimeout(() => setPhase('idle'), 7000); // 3s done

      return () => {
        clearTimeout(scanTimeout);
        clearTimeout(doneTimeout);
      };
    }
  }, [isScanning]);

  const handleScanClick = () => {
    onScan();
  };

  return (
    <div className="camera-view">
      <video ref={videoRef} autoPlay playsInline muted className="video-bg" />

      {/* ⚙️ Nastavenia */}
      <button onClick={onOpenSettings} className="settings-btn">⚙️</button>

      {/* 🔐 Zobrazenie tajného kódu */}
      <button onClick={onShowCode} className="code-toggle-btn">🔐</button>

      {/* Skenovacie okno */}
      <div className="scan-frame">
        {/* Animovaná čiara iba ak NIE je fáza done */}
        {phase !== 'done' && <div className="scan-line" />}

        {/* Zobrazenie face.png počas fázy skenovania */}
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

        {/* SVG fajka počas fázy done */}
        {phase === 'done' && (
          <svg className="checkmark-svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14 27l7 7 17-17" />
          </svg>
        )}
      </div>

      {/* Skenovacie tlačidlo */}
      <button className="scan-btn" onClick={handleScanClick} />
    </div>
  );
};

export default CameraView;
