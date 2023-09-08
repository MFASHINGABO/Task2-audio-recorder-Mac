document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const audioElement = document.getElementById('audio');

    let mediaStream;
    let mediaRecorder;

    async function startRecording() {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(mediaStream);

            mediaRecorder.ondataavailable = function(e) {
                if (e.data.size > 0) {
                    audioChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = function() {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioElement.src = URL.createObjectURL(audioBlob);
            };

            mediaRecorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
        } catch (err) {
            console.error('Error accessing the microphone:', err);
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            mediaStream.getTracks().forEach(track => track.stop());
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    }

    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
});
