import React, { useRef } from "react";

function PlaybackControls({ audioURL }) {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div>
      {audioURL && (
        <audio ref={audioRef} src={audioURL} hidden />
      )}
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
}

export default PlaybackControls;
