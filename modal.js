document.addEventListener("DOMContentLoaded", function() {
    const feedbackMessage = document.getElementById('feedbackMessage');
    const submitAnswerButton = document.getElementById('submitAnswer');
    const userAnswer = document.getElementById('userAnswer');
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    let currentQuestionIndex = 0;

    // submitAnswerButton.addEventListener('click', function() {
    //     const currentQuestion = questions[currentQuestionIndex];
    //     let isCorrect;
    //     if (currentQuestion.type === 'free-text') {
    //         isCorrect = (userAnswer.value.toLowerCase() === currentQuestion.answer.toLowerCase());
    //     } else {
    //         isCorrect = (userAnswer.value.toLowerCase() === currentQuestion.correctOption);
    //     }
    //     userAnswer.value = '';
    // });

    // function showFeedback(isCorrect) {
    //     alert(isCorrect);
    //     const currentQuestion = questions[currentQuestionIndex];
    //     const modal = document.querySelector('.modal');
    //     const feedbackImage = document.getElementById('feedbackImage');
    //     const feedbackMessage = document.getElementById('feedbackMessage');

    //     if (isCorrect) {
    //         feedbackImage.src = 'images/right.gif'; // Set the path to the correct image
    //         feedbackMessage.textContent = "Правилно!";
    //         modal.style.display = 'block'; // Display the modal
    //     } else {
    //         feedbackImage.src = 'images/wrong.gif'; // Set the path to the incorrect image
    //         if(currentQuestion.type === 'free-text'){
    //             feedbackMessage.textContent = 'Грешно! Правилният отговор е: ' + currentQuestion.answer;
    //         }else{
    //             feedbackMessage.textContent = 'Грешно! Правилният отговор е: ' + currentQuestion.correctOption.toUpperCase();
    //         }
    //         modal.style.display = 'block'; // Display the modal
    //     }

    //     // Close the modal when the user clicks anywhere outside of it
    //     window.onclick = function(event) {
    //         if (event.target == modal) {
    //             modal.style.display = 'none';
    //         }
    //     }
    // }

    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionDisplay.innerHTML = '';
        if (currentQuestion.type === 'free-text') {
            questionDisplay.textContent = currentQuestion.question;
        } else {
            const questionText = document.createElement('div');
            questionText.textContent = currentQuestion.question;
            questionDisplay.appendChild(questionText);
            for (let key in currentQuestion.options) {
                const option = document.createElement('div');
                option.textContent = `${key.toUpperCase()}: ${currentQuestion.options[key]}`;
                questionDisplay.appendChild(option);
            }
        }
    }

    previousButton.addEventListener('click', function() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    });
});
