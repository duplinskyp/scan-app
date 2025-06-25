import React, { useState } from 'react';

interface Props {
  codes: string[];
  setCodes: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}

const Settings: React.FC<Props> = ({ codes, setCodes, onClose }) => {
  const [delay, setDelay] = useState(2000);
  const [newCode, setNewCode] = useState('');

  const addCode = () => {
    if (newCode.trim()) {
      setCodes(prev => [...prev, newCode.trim()]);
      setNewCode('');
    }
  };

  const removeCode = (index: number) => {
    setCodes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="settings-screen">
      <div className="settings-box">
        <h2>⚙️ Settings</h2>

        <label>
          Scan Delay (ms):
          <input
            type="number"
            value={delay}
            onChange={e => setDelay(Number(e.target.value))}
          />
        </label>

        <div className="codes-list">
          {codes.map((c, i) => (
            <div className="code-item" key={i}>
              {c}
              <button onClick={() => removeCode(i)}>❌</button>
            </div>
          ))}
        </div>

        <div className="code-input">
          <input
            value={newCode}
            onChange={e => setNewCode(e.target.value)}
            placeholder="Add code..."
          />
          <button onClick={addCode}>➕</button>
        </div>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Settings;
