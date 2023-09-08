document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const playButton = document.getElementById('play');
    const audioElement = document.getElementById('audio');

    let mediaStream;
    let mediaRecorder;

    let audioChunks = [];

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
            playButton.disabled = true;
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
            playButton.disabled = false;
        }
    }

    function playRecording() {
        audioElement.play();
    }

    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    playButton.addEventListener('click', playRecording);
});
