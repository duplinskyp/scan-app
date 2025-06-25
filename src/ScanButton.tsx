import React, { useState } from 'react';

const ScanButton: React.FC = () => {
  const [showCheck, setShowCheck] = useState(false);

  const handleScan = () => {
    setShowCheck(false);
    setTimeout(() => {
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 2000);
    }, 2000);
  };

  return (
    <>
      <button className="scan-btn" onClick={handleScan}></button>
      {showCheck && <div className="checkmark-overlay">✅</div>}
    </>
  );
};

export default ScanButton;
