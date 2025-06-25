import React, { useState } from 'react';
import CameraView from './CameraView';
import CodeViewer from './CodeViewer';
import Settings from './Settings';

const App: React.FC = () => {
  const [showCode, setShowCode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [triggerScan, setTriggerScan] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);
  const [codeIndex, setCodeIndex] = useState(0); // ✅ track aktuálneho indexu

const handleScan = () => {
  setTriggerScan(true);
  setTimeout(() => setTriggerScan(false), 7000); // musí byť 7000!
};


  const handleCodeClose = () => {
    setShowCode(false);
    setCodeIndex(prev => prev + 1); // ➕ inkrementuj po zavretí
  };

  return (
    <div className="app">
      <CameraView
        onShowCode={() => setShowCode(true)}
        onOpenSettings={() => setShowSettings(true)}
        onScan={handleScan}
        isScanning={triggerScan}
      />
      {showCode && (
        <CodeViewer
          codes={codes}
          index={codeIndex}
          onClose={handleCodeClose}
        />
      )}
      {showSettings && (
        <Settings
          codes={codes}
          setCodes={setCodes}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
