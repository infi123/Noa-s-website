document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('memory-form');
    const imageInput = document.getElementById('image-input');
    const noteInput = document.getElementById('note-input');
    const memoriesContainer = document.getElementById('memories-container');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const newMemory = document.createElement('div');
        const image = document.createElement('img');
        const note = document.createElement('p');

        const reader = new FileReader();
        reader.onloadend = function() {
            image.src = reader.result;
        }
        if (imageInput.files[0]) {
            reader.readAsDataURL(imageInput.files[0]);
        }

        note.textContent = noteInput.value;

        newMemory.appendChild(image);
        newMemory.appendChild(note);

        memoriesContainer.appendChild(newMemory);

        // Clear the inputs
        imageInput.value = '';
        noteInput.value = '';
    });
});
