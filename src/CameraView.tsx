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
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
  }, []);

  useEffect(() => {
    if (isScanning) {
      setPhase('scanning');
      
      // Fáza skenovania 4 sekundy
      const scanTimeout = setTimeout(() => setPhase('done'), 4000);

      // Fáza fajky 3 sekundy po skenovaní
      const doneTimeout = setTimeout(() => setPhase('idle'), 7000); // 4s + 3s

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

      {/* ⚙️ settings */}
      <button onClick={onOpenSettings} className="settings-btn">⚙️</button>

      {/* hlavné skenovacie okno */}
      <div className="scan-frame">
        {/* skenovacia čiara len ak nie je fáza "done" */}
        {phase !== 'done' && <div className="scan-line" />}

        {phase === 'scanning' && (
          <div className="scan-face-container">
            <img src="/face-white.png" alt="Scanning face" className="scan-face" />
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

      {/* scan button */}
      <button className="scan-btn" onClick={handleScanClick}></button>

      {/* 🔐 zobrazenie kódu */}
      <button onClick={onShowCode} className="code-toggle-btn">🔐</button>
    </div>
  );
};

export default CameraView;
