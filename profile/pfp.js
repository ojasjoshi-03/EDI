// Edit specific text content
function editText(id) {
    const currentText = document.getElementById(id).innerText;
    const newText = prompt("Edit the text:", currentText);
    if (newText !== null) {
        document.getElementById(id).innerText = newText;
    }
}

// Edit the About Me section
document.querySelector('.about-edit').addEventListener('click', function() {
    const aboutText = document.getElementById('about-text').innerText;
    const newText = prompt("Edit the About Me text:", aboutText);
    if (newText !== null) {
        document.getElementById('about-text').innerText = newText;
    }
});

// Upload profile photo
function uploadPhoto() {
    const photoUpload = document.getElementById('photoUpload');
    photoUpload.click(); // Trigger file input

    photoUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const profileImage = document.getElementById('profileImage');
                profileImage.src = e.target.result;
                profileImage.style.display = 'block'; // Show the uploaded image
            };
            reader.readAsDataURL(file);
        }
    });
}