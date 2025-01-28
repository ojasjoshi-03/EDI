let selectedOption = null;
        const options = document.querySelectorAll('.option');
        const nextButton = document.getElementById('next-button');

        // Function to handle option selection
        function selectOption(option) {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedOption = option.querySelector('input').value;
            nextButton.disabled = false;
        }

        // Function to move to the next question
        function nextQuestion() {
            if (selectedOption == 1) {
                alert('Correct Answer!');
            } else {
                alert('Incorrect Answer!');
            }
            nextButton.disabled = true;
            selectedOption = null;
            // Logic for loading next question can go here
        }