import React, { useState, useRef } from "react";

export default function AudioCapture() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Clear previous recordings
      audioChunksRef.current = [];
      setAudioURL(null);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url); // Set the audio URL for playback
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="text-center">
      <h2>Audio Capture</h2>
      <div className="d-flex flex-column gap-3">
        <button
          onClick={startRecording}
          className="btn btn-primary"
          disabled={isRecording}
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          className="btn btn-danger"
          disabled={!isRecording}
        >
          Stop Recording
        </button>
        {audioURL && (
          <div>
            <h3>Playback</h3>
            <audio src={audioURL} controls></audio>
          </div>
        )}
      </div>
    </div>
  );
}
