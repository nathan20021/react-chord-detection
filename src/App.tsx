import { data } from "autoprefixer";
import { useEffect, useState, useRef } from "react";

function App() {
  const [audio, setAudio] = useState<HTMLAudioElement>(
    new Audio("/audio/C_chord.mp3")
  );
  const [isPaused, setPaused] = useState<boolean>(true);
  const [ctx, setCtx] = useState<AudioContext>();
  const [dataArray, setDataArray] = useState<Uint8Array>();
  const analyser = useRef<AnalyserNode>();
  const source = useRef<MediaElementAudioSourceNode>();

  useEffect(() => {
    const update = () => {
      requestAnimationFrame(update);
      if (analyser.current !== undefined && dataArray !== undefined) {
        console.log(dataArray);
        analyser.current.getByteFrequencyData(dataArray);
      }
    };
    update();
  }, [dataArray]);

  useEffect(() => {
    audio.load();
    //@ts-ignore
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }, [audio]);

  useEffect(() => {
    if (ctx !== undefined) {
      analyser.current = ctx.createAnalyser();
      source.current = ctx.createMediaElementSource(audio);
      source.current.connect(analyser.current);
      source.current.connect(ctx.destination);
      analyser.current.fftSize = 64;
      const bufferLength = analyser.current.frequencyBinCount;
      setDataArray(new Uint8Array(bufferLength));
    }
  }, [ctx, audio]);

  const toggleSound = () => {
    isPaused ? setPaused(false) : setPaused(true);
    audio.paused ? audio.play() : audio.pause();
  };

  const actiavteContext = () => {
    ctx === undefined ? setCtx(new window.AudioContext()) : void 0;
  };

  return (
    <main className="w-full h-full" onClick={actiavteContext}>
      <div className="w-[80%] h-full flex flex-col gap-4">
        <button onClick={toggleSound}>{isPaused ? `Play` : `Pause`}</button>
      </div>
    </main>
  );
}

export default App;
