import React, { useEffect, useState, useRef } from 'react';

interface Props {
  codes: string[];
  index: number;
  onClose: () => void;
}

const CodeViewer: React.FC<Props> = ({ codes, index, onClose }) => {
  const [code, setCode] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (codes.length > 0) {
      const currentCode = codes[index % codes.length];
      setCode(currentCode);
    } else {
      setCode('NO CODES');
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && e.target instanceof Node && overlayRef.current === e.target) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [codes, index, onClose]);

  return (
    <div ref={overlayRef} className="code-overlay">
      <div className="code-content">{code}</div>
    </div>
  );
};

export default CodeViewer;
