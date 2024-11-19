let audioContext: AudioContext;
let audioBuffer: AudioBuffer | null;
let sourceNode: AudioBufferSourceNode | null;
let gainNode: AudioNode;

const initializeAudioContext = async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    const response = await fetch('/assets/sounds/BlackJack_soundtrack_updated.wav');
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  }
};

export const playAudio = async () => {
  if (!audioContext) {
    await initializeAudioContext();
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // Create a new source node and connect it through the gain node
  sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.loop = true;
  sourceNode.connect(gainNode);

  // Fade in smoothly
  const currentTime = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, currentTime);
  gainNode.gain.linearRampToValueAtTime(1, currentTime + 1); // 1 second fade-in

  sourceNode.start(0);
};

export const stopAudio = () => {
  if (gainNode && sourceNode) {
    const currentTime = audioContext.currentTime;
    const fadeOutDuration = 1.0; // 1 second fade-out

    // Fade out smoothly
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + fadeOutDuration);

    // Stop the source node after fade-out
    sourceNode.stop(currentTime + fadeOutDuration);
    sourceNode.disconnect();
    sourceNode = null;
  }
};

export const setVolume = (volume) => {
  if (gainNode) {
    const currentTime = audioContext.currentTime;
    const newVolume = Math.max(0, Math.min(1, volume * 0.6 / 100));

    // Smooth volume transition
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.linearRampToValueAtTime(newVolume, currentTime + 0.1); // Adjust duration as needed
  }
};
