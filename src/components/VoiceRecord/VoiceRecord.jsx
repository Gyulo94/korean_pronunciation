import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import RingLoader from "react-spinners/RingLoader";
import Mar from "../../assets/img/mar_main.jpg";
import { requestPronunce } from "../../service/index"; // requestPronunce 함수가 정의된 파일에서 가져오기
import PlayIcon from "../ui/icons/PlayIcon";
import PlayStopIcon from "../ui/icons/PlayStopIcon";
import Excellent from "../ui/lottie/Excellent";
import Good from "../ui/lottie/Good";
import Nice from "../ui/lottie/Nice";
import TryAgain from "../ui/lottie/TryAgain";
import VoiceWave from "../ui/lottie/VoiceWave";
import { Toast } from "../ui/toast-alert"; // toast 함수가 정의된 파일에서 가져오기
import "./style.css";

export default function VoiceRecord() {
  const [script, setScript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null); // 오디오 태그 참조 추가
  const audioChunksRef = useRef([]);
  const textareaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // 오디오 재생 상태 추가
  const [audioUrl, setAudioUrl] = useState(null); // audio URL 상태 추가
  const [modalOpen, setModalOpen] = useState(false);
  const [score, setScore] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const color = "#ffb1b4";

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob); // Blob을 URL로 변환
      setAudioUrl(audioUrl);
      await addAudioElement(audioBlob);
      // console.log("audioBlob", audioBlob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const addAudioElement = async (audioBlob) => {
    setModalOpen(true);
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result?.toString().split(",")[1];
      if (script === "") {
        Toast.fire({
          icon: "error",
          title: "Por favor, introduce tu texto.",
        });
        return;
      }
      if (base64data) {
        // console.log("script", script);

        const requestBody = {
          request_id: "reserved field",
          argument: {
            language_code: "korean",
            script: script,
            audio: base64data,
          },
        };

        try {
          console.log("Request body:", requestBody); // 요청 본문 로그 추가
          const response = await requestPronunce(requestBody);
          if (response.return_object.score === "-nan") {
            setScore(1);
          }
          if (response.result === 0) {
            setScore(Math.round(response.return_object.score));
          }
          if (response.status === 524) {
            Toast.fire({
              icon: "error",
              title: "No tiene contenido",
            });
          }
          console.log("response", response);
        } catch (error) {
          console.error("Error in requestPronunce:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("Failed to convert audio to Base64");
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading audio blob:", error);
    };
    reader.readAsDataURL(audioBlob);
  };

  const onChangeHandler = (e) => {
    setScript(e.target.value); // e.target.value를 올바르게 설정
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 높이를 자동으로 설정하여 초기화
      textarea.style.height = textarea.scrollHeight + "px"; // 스크롤 높이에 맞게 높이 설정
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [script]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const onClickCloseModal = () => {
    setModalOpen(false);
    setIsPlaying(false);
  };

  return (
    <div className="voice-record-container">
      <div className="voice-record-img-wrap">
        <img src={Mar} alt={Mar} />
      </div>
      <div className="voice-record-wave">{isRecording && <VoiceWave />}</div>
      <div className="voice-record-textarea">
        <textarea
          ref={textareaRef}
          placeholder={"Introduce tu texto."}
          value={script}
          onChange={onChangeHandler}
          rows={1}
        />
      </div>
      <div
        className="voice-record-btn"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? <PlayStopIcon /> : <PlayIcon />}
      </div>
      {modalOpen && (
        <div className="voice-record-modal">
          <div className="voice-record-modal-content">
            {isLoading ? (
              <div className="spinner-container">
                <div className="spinner">
                  <RingLoader
                    color={color}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
                <p>Cargando...</p>
              </div>
            ) : (
              <>
                <h2>My Score</h2>

                {score === "-nan" && (
                  <>
                    <div className="voice-record-score">
                      <TryAgain />
                    </div>
                    <h2>TryAgain</h2>
                  </>
                )}
                {score === 1 && (
                  <>
                    <div className="voice-record-score">
                      <TryAgain />
                    </div>
                    <h2>TryAgain</h2>
                  </>
                )}
                {score === 2 && (
                  <>
                    <div className="voice-record-score">
                      <Nice />
                    </div>
                    <h2>Nice</h2>
                  </>
                )}
                {score === 3 && (
                  <>
                    <div className="voice-record-score">
                      <Good />
                    </div>
                    <h2>Good</h2>
                  </>
                )}
                {score === 4 && (
                  <>
                    <div className="voice-record-score">
                      <Excellent />
                    </div>
                    <h2>Excellent</h2>
                  </>
                )}
                {score === 5 && (
                  <>
                    <div className="voice-record-score">
                      <Excellent />
                    </div>
                    <h2>Excellent</h2>
                  </>
                )}
                <div className="voice-record-modal-bottom">
                  <div className="audio-player" onClick={togglePlayPause}>
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={handleAudioEnded}
                    ></audio>
                    <div>
                      {isPlaying ? <FaPause /> : <FaPlay color="#fff" />}
                    </div>
                  </div>
                  <button
                    className="voice-record-close"
                    onClick={onClickCloseModal}
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
