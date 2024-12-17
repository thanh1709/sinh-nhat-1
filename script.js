document.addEventListener('DOMContentLoaded', () => {
    const flame = document.querySelector('.flame');
    const blowSound = document.getElementById('blowSound');
    
    // Check if browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request microphone access
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const microphone = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                
                // Configure analyser
                analyser.fftSize = 512;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                // Connect microphone to analyser
                microphone.connect(analyser);
                
                // Blow detection function
                function detectBlow() {
                    analyser.getByteFrequencyData(dataArray);
                    
                    // Calculate average sound level
                    const averageLevel = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
                    
                    // Threshold for blow detection (adjust as needed)
                    if (averageLevel > 100) {
                        // Blow out the candle
                        flame.style.display = 'none';
                        
                        // Play blow sound
                        blowSound.play();
                        
                        // Stop further blow detection
                        return;
                    }
                    
                    // Continue listening
                    requestAnimationFrame(detectBlow);
                }
                
                // Start blow detection
                detectBlow();
            })
            .catch(error => {
                console.error('Microphone access denied:', error);
                alert('Vui lòng cấp quyền truy cập micro để thổi tắt nến');
            });
    } else {
        console.error('Trình duyệt không hỗ trợ truy cập micro');
        alert('Trình duyệt của bạn không hỗ trợ truy cập micro');
    }
});