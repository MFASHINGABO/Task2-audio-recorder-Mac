document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const audioElement = document.getElementById('audio');

    let mediaRecorder;
    let audioChunks = [];

    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = function(e) {
                    audioChunks.push(e.data);
                };
                mediaRecorder.onstop = function() {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioElement.src = URL.createObjectURL(audioBlob);
                };
                mediaRecorder.start();
            })
            .catch(function(err) {
                console.error('Error accessing the microphone:', err);
            });
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    }
});