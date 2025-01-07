import React, { useState } from "react";
import AudioRecorder from "./components/AudioRecorder";
import PlaybackControls from "./components/PlaybackControls";
import "./App.css";

function App() {
  const [audioURL, setAudioURL] = useState(null);

  const handleAudioCaptured = (url) => {
    setAudioURL(url);
  };

  return (
    <div className="app-container">
      <h1>Say Something!!</h1>
      <AudioRecorder onAudioCaptured={handleAudioCaptured} />
      <h3>PlayBack</h3>
      {audioURL ? <PlaybackControls audioURL={audioURL} /> : <p>Happy Recording!</p>}
    </div>
  );
}

export default App;
