import React, { useEffect, useState } from 'react';
import './styles.css';

interface Props {
  onDone: () => void;
}

const ScanOverlay: React.FC<Props> = ({ onDone }) => {
  const [phase, setPhase] = useState<'scanning' | 'done'>('scanning');

  useEffect(() => {
    const scanTime = 3000;  // 3s skenovanie
    const checkTime = 4000; // 4s zobrazená fajka

    const timer = setTimeout(() => {
      setPhase('done');
      setTimeout(() => onDone(), checkTime);
    }, scanTime);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="scan-overlay">
      {phase === 'scanning' ? (
        <div className="scan-face-container">
          <img src="/face_white.png" alt="Scanning face" className="scan-face" />
          <div className="face-scan-mask" />
        </div>
      ) : (
        <svg className="checkmark-svg" viewBox="0 0 52 52">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" fill="none" d="M14 27l7 7 17-17" />
        </svg>
      )}
    </div>
  );
};

export default ScanOverlay;
