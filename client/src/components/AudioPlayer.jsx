import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Create a component for audio players
const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      const audio = audioRef.current;
      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      
      audio.addEventListener('timeupdate', updateProgress);
      return () => audio.removeEventListener('timeupdate', updateProgress);
    }, []);
  
    return (
      <div className="bg-gray-100 p-2 rounded flex items-center gap-3">
        <button 
          onClick={() => audioRef.current?.play()} 
          className="p-2 bg-blue-500 text-white rounded-full"
        >
          <Play size={16} />
        </button>
        <button 
          onClick={() => audioRef.current?.pause()} 
          className="p-2 bg-gray-500 text-white rounded-full"
        >
          <Pause size={16} />
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          className="flex-grow"
          onChange={(e) => {
            if (audioRef.current) {
              audioRef.current.currentTime = (e.target.value / 100) * audioRef.current.duration;
            }
          }}
        />
        <audio 
          ref={audioRef} 
          src={src} 
          className="hidden"
        />
      </div>
    );
  };

  export default AudioPlayer;