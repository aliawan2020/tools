document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInfo = document.getElementById('fileInfo');
    const dropArea = document.getElementById('dropArea');
    const errorMessage = document.getElementById('errorMessage');
    const trimControls = document.getElementById('trimControls');
    const audioPlayer = document.getElementById('audioPlayer');
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    const trimStart = document.getElementById('trimStart');
    const trimEnd = document.getElementById('trimEnd');
    const trimBtn = document.getElementById('trimBtn');
    const resetBtn = document.getElementById('resetBtn');
    const processingMessage = document.getElementById('processingMessage');
    const outputSection = document.getElementById('outputSection');
    const trimmedAudioPlayer = document.getElementById('trimmedAudioPlayer');
    const downloadBtn = document.getElementById('downloadBtn');

    // Variables
    let audioBuffer = null;
    let audioContext = null;
    let audioDuration = 0;
    let audioSrc = null;
    let trimmedBlob = null;

    // Supported formats
    const supportedFormats = ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/flac', 'audio/mpeg'];

    // Initialize Audio Context
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Handle file selection
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Handle drag and drop
    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropArea.style.borderColor = '#4a6fa5';
    });

    dropArea.addEventListener('dragleave', function() {
        dropArea.style.borderColor = '#ccc';
    });

    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        dropArea.style.borderColor = '#ccc';
        
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Process the selected file
    function handleFile(file) {
        errorMessage.style.display = 'none';
        
        // Check file type
        if (!supportedFormats.includes(file.type) && !file.name.match(/\.(mp3|wav|aac|ogg|flac)$/i)) {
            showError('Unsupported file format. Please upload an MP3, WAV, AAC, OGG, or FLAC file.');
            return;
        }

        fileInfo.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
        
        // Create object URL for the audio player
        const objectUrl = URL.createObjectURL(file);
        audioPlayer.src = objectUrl;
        
        // Load audio for processing
        initAudioContext();
        loadAudioFile(file);
    }

    // Load audio file for processing
    function loadAudioFile(file) {
        const fileReader = new FileReader();
        
        fileReader.onload = function(e) {
            audioContext.decodeAudioData(e.target.result)
                .then(function(buffer) {
                    audioBuffer = buffer;
                    audioDuration = buffer.duration;
                    updateTimeInputs();
                    trimControls.style.display = 'block';
                })
                .catch(function(error) {
                    console.error('Error decoding audio data', error);
                    showError('Error processing audio file. Please try another file.');
                });
        };
        
        fileReader.onerror = function() {
            showError('Error reading file.');
        };
        
        fileReader.readAsArrayBuffer(file);
    }

    // Update time inputs based on audio duration
    function updateTimeInputs() {
        startTime.value = '00:00:00';
        endTime.value = secondsToHHMMSS(audioDuration);
        
        // Update slider max values
        trimStart.max = Math.floor(audioDuration);
        trimEnd.max = Math.floor(audioDuration);
        trimEnd.value = Math.floor(audioDuration);
    }

    // Convert seconds to HH:MM:SS format
    function secondsToHHMMSS(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    }

    // Convert HH:MM:SS to seconds
    function HHMMSSToSeconds(timeStr) {
        const parts = timeStr.split(':');
        if (parts.length !== 3) return 0;
        
        const hrs = parseInt(parts[0]) || 0;
        const mins = parseInt(parts[1]) || 0;
        const secs = parseInt(parts[2]) || 0;
        
        return hrs * 3600 + mins * 60 + secs;
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Time input change handlers
    startTime.addEventListener('change', function() {
        const seconds = HHMMSSToSeconds(startTime.value);
        if (!isNaN(seconds) && seconds >= 0 && seconds < audioDuration) {
            trimStart.value = seconds;
        } else {
            showError('Invalid start time');
            startTime.value = secondsToHHMMSS(trimStart.value);
        }
    });

    endTime.addEventListener('change', function() {
        const seconds = HHMMSSToSeconds(endTime.value);
        if (!isNaN(seconds) && seconds > 0 && seconds <= audioDuration) {
            trimEnd.value = seconds;
        } else {
            showError('Invalid end time');
            endTime.value = secondsToHHMMSS(trimEnd.value);
        }
    });

    // Slider change handlers
    trimStart.addEventListener('input', function() {
        startTime.value = secondsToHHMMSS(trimStart.value);
    });

    trimEnd.addEventListener('input', function() {
        endTime.value = secondsToHHMMSS(trimEnd.value);
    });

    // Trim audio
    trimBtn.addEventListener('click', function() {
        const start = parseFloat(trimStart.value);
        const end = parseFloat(trimEnd.value);
        
        if (start >= end) {
            showError('Start time must be before end time');
            return;
        }
        
        processingMessage.style.display = 'block';
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            trimAudio(start, end);
        }, 100);
    });

    // Actual audio trimming function
    function trimAudio(start, end) {
        if (!audioBuffer) return;
        
        const duration = end - start;
        const sampleRate = audioBuffer.sampleRate;
        const startOffset = Math.floor(start * sampleRate);
        const endOffset = Math.floor(end * sampleRate);
        const frameCount = endOffset - startOffset;
        
        // Create new buffer for the trimmed audio
        const newBuffer = audioContext.createBuffer(
            audioBuffer.numberOfChannels,
            frameCount,
            sampleRate
        );
        
        // Copy data to new buffer
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            const newChannelData = newBuffer.getChannelData(channel);
            
            for (let i = 0; i < frameCount; i++) {
                newChannelData[i] = channelData[i + startOffset];
            }
        }
        
        // Convert to playable format
        exportTrimmedAudio(newBuffer);
    }

    // Export trimmed audio to playable format
    function exportTrimmedAudio(buffer) {
        // For simplicity, we'll use the offline audio context to render to WAV
        const offlineCtx = new OfflineAudioContext(
            buffer.numberOfChannels,
            buffer.length,
            buffer.sampleRate
        );
        
        const source = offlineCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(offlineCtx.destination);
        source.start();
        
        offlineCtx.startRendering().then(function(renderedBuffer) {
            // Convert to WAV
            const wavBlob = bufferToWav(renderedBuffer);
            trimmedBlob = wavBlob;
            
            // Create object URL for playback
            const objectUrl = URL.createObjectURL(wavBlob);
            trimmedAudioPlayer.src = objectUrl;
            
            // Show output section
            processingMessage.style.display = 'none';
            outputSection.style.display = 'block';
        }).catch(function(err) {
            console.error('Error rendering audio:', err);
            showError('Error processing audio');
            processingMessage.style.display = 'none';
        });
    }

    // Convert AudioBuffer to WAV Blob
    function bufferToWav(buffer) {
        const numChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const length = buffer.length;
        
        // Interleave the channels
        const interleaved = new Float32Array(length * numChannels);
        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                interleaved[i * numChannels + channel] = channelData[i];
            }
        }
        
        // Convert to 16-bit PCM
        const pcm16 = new Int16Array(interleaved.length);
        for (let i = 0; i < interleaved.length; i++) {
            const s = Math.max(-1, Math.min(1, interleaved[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Create WAV header
        const blockAlign = numChannels * 2;
        const byteRate = sampleRate * blockAlign;
        const dataSize = length * blockAlign;
        
        const header = new ArrayBuffer(44);
        const view = new DataView(header);
        
        // RIFF identifier
        writeString(view, 0, 'RIFF');
        // RIFF chunk length
        view.setUint32(4, 36 + dataSize, true);
        // RIFF type
        writeString(view, 8, 'WAVE');
        // Format chunk identifier
        writeString(view, 12, 'fmt ');
        // Format chunk length
        view.setUint32(16, 16, true);
        // Sample format (raw)
        view.setUint16(20, 1, true);
        // Channel count
        view.setUint16(22, numChannels, true);
        // Sample rate
        view.setUint32(24, sampleRate, true);
        // Byte rate (sample rate * block align)
        view.setUint32(28, byteRate, true);
        // Block align (channel count * bytes per sample)
        view.setUint16(32, blockAlign, true);
        // Bits per sample
        view.setUint16(34, 16, true);
        // Data chunk identifier
        writeString(view, 36, 'data');
        // Data chunk length
        view.setUint32(40, dataSize, true);
        
        // Combine header and PCM data
        const wav = new Uint8Array(header.byteLength + pcm16.byteLength);
        wav.set(new Uint8Array(header), 0);
        wav.set(new Uint8Array(pcm16.buffer), header.byteLength);
        
        return new Blob([wav], { type: 'audio/wav' });
    }

    // Helper to write string to DataView
    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    // Download trimmed audio
    downloadBtn.addEventListener('click', function() {
        if (!trimmedBlob) return;
        
        const url = URL.createObjectURL(trimmedBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'trimmed_audio.wav';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    });

    // Reset button
    resetBtn.addEventListener('click', function() {
        fileInput.value = '';
        fileInfo.textContent = 'No file selected';
        audioPlayer.src = '';
        trimControls.style.display = 'none';
        outputSection.style.display = 'none';
        errorMessage.style.display = 'none';
        audioBuffer = null;
        trimmedBlob = null;
    });
});