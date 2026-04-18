import math
import wave
import struct
import os

def generate_wave(filename, duration, frequency_func, volume=0.5):
    sample_rate = 44100.0
    num_samples = int(duration * sample_rate)
    
    path = os.path.join("public", "sounds", filename)
    
    with wave.open(path, "w") as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(int(sample_rate))
        
        for i in range(num_samples):
            t = i / sample_rate
            freq = frequency_func(t)
            
            # Simple envelope to prevent clicking
            envelope = 1.0
            if t < 0.01: envelope = t / 0.01
            if t > duration - 0.01: envelope = (duration - t) / 0.01
            
            value = int(volume * envelope * math.sin(2.0 * math.pi * freq * t) * 32767.0)
            data = struct.pack("<h", value)
            wav_file.writeframesraw(data)

# 1. Pop (short high pitch to low)
def pop_freq(t):
    return 800 * math.exp(-20 * t)

# 2. Whoosh (noise-like sweep)
def whoosh_freq(t):
    return 200 + 1000 * t

# 3. Confetti (tinkle)
def confetti_freq(t):
    return 1000 + 500 * math.sin(100 * t)

print("Generating sound assets...")
generate_wave("pop.wav", 0.1, pop_freq, volume=0.3)
generate_wave("whoosh.wav", 0.3, whoosh_freq, volume=0.2)
generate_wave("confetti.wav", 1.0, confetti_freq, volume=0.2)
print("Done!")
