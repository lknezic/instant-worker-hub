import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Square } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface AIVoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

const AIVoiceInput = ({ onTranscript, disabled, className = "" }: AIVoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopVisualizer = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setAmplitude(0);
  }, []);

  const startVisualizer = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAmplitude(Math.min(avg / 128, 1));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // mic not available — silent fail
    }
  }, []);

  useEffect(() => () => stopVisualizer(), [stopVisualizer]);

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    let transcript = "";

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          transcript += e.results[i][0].transcript + " ";
        }
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      stopVisualizer();
      if (transcript.trim()) {
        setIsProcessing(true);
        setTimeout(() => {
          onTranscript(transcript.trim());
          setIsProcessing(false);
        }, 300);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      stopVisualizer();
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    startVisualizer();
  }, [onTranscript, startVisualizer, stopVisualizer]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const handleClick = () => {
    if (disabled || isProcessing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={`relative flex items-center justify-center transition-all duration-200 ${className}`}
      title={isRecording ? "Stop recording" : "Voice input"}
      type="button"
    >
      {/* Pulse rings when recording */}
      {isRecording && (
        <>
          <span
            className="absolute inset-0 rounded-full bg-destructive/20 animate-ping"
            style={{ animationDuration: "1.5s" }}
          />
          <span
            className="absolute rounded-full bg-destructive/10 transition-transform duration-75"
            style={{
              inset: `-${Math.round(amplitude * 6)}px`,
            }}
          />
        </>
      )}

      {isProcessing ? (
        <span className="w-3.5 h-3.5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
      ) : isRecording ? (
        <Square className="w-3 h-3 text-destructive fill-destructive" />
      ) : (
        <Mic
          className={`w-3.5 h-3.5 transition-colors ${
            disabled ? "text-muted-foreground/40" : "text-muted-foreground hover:text-primary"
          }`}
        />
      )}
    </button>
  );
};

export default AIVoiceInput;
