import React, { useState, useRef } from "react";
import axios from "axios";

function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null); // For playback
  const [audioBlob, setAudioBlob] = useState(null); // To store recorded blob
  const [isVerified, setIsVerified] = useState(false); // For verification state

  const mediaRecorderRef = useRef(null); // To hold MediaRecorder instance
  const audioChunks = useRef([]); // To store audio chunks

  const handleRecord = () => {
    setIsVerified(false); // Reset verification state
    setIsRecording(true);
    audioChunks.current = []; // Clear previous chunks

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.start();
        console.log("Recording started...");

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunks.current, { type: "audio/wav" });
          setAudioBlob(blob);
          setAudioURL(URL.createObjectURL(blob)); // Generate playback URL
          console.log("Recording stopped.");
        };
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  const handleStop = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleUpload = async () => {
    if (!isVerified || !audioBlob) {
      alert("Please verify the audio before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Audio uploaded successfully!");
      resetRecorder();
    } catch (err) {
      console.error(err);
      alert("Error uploading audio.");
    }
  };

  const resetRecorder = () => {
    setAudioURL(null);
    setAudioBlob(null);
    setIsVerified(false);
  };

  const handleVerify = () => {
    if (!audioURL) {
      alert("No audio to verify.");
      return;
    }
    setIsVerified(true);
    alert("Audio verified. You can now upload it.");
  };

  return (
    <div>
      {!audioURL ? (
        <button onClick={isRecording ? handleStop : handleRecord}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      ) : (
        <>
          <audio controls src={audioURL}></audio>
          <button onClick={resetRecorder}>Record Again</button>
          <button onClick={handleVerify}>Verify Audio</button>
          <button onClick={handleUpload} disabled={!isVerified}>
            Upload Audio
          </button>
        </>
      )}
    </div>
  );
}

export default AudioRecorder;
