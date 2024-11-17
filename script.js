document.addEventListener("DOMContentLoaded", function() {
    const questionTypeSelect = document.getElementById('questionType');
    const freeTextSection = document.getElementById('freeTextSection');
    const multipleChoiceSection = document.getElementById('multipleChoiceSection');
    const addQuestionButton = document.getElementById('addQuestion');
    const playButton = document.getElementById('playButton');
    const homePage = document.getElementById('homePage');
    const questionSection = document.getElementById('questionSection');
    const playSection = document.getElementById('playSection');
    const questionDisplay = document.getElementById('questionDisplay');
    const userAnswer = document.getElementById('userAnswer');
    const submitAnswerButton = document.getElementById('submitAnswer');
    const feedbackQuestion = document.getElementById('feedbackQuestion');
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');
    const showQuestionsButton = document.getElementById('showQuestionsButton');
    const homePageButton = document.getElementById('homePageButton');

    let questions = JSON.parse(localStorage.getItem('questions')) || [];
    let currentQuestionIndex = 0;

    homePageButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    showQuestionsButton.addEventListener('click', function() {
        window.location.href = 'questions.html';
    });

    questionTypeSelect.addEventListener('change', function() {
        if (this.value === 'free-text') {
            freeTextSection.classList.remove('hidden');
            multipleChoiceSection.classList.add('hidden');
        } else {
            freeTextSection.classList.add('hidden');
            multipleChoiceSection.classList.remove('hidden');
        }
    });

    addQuestionButton.addEventListener('click', function() {
        let isAllowed = true;
        if (questionTypeSelect.value === 'free-text') {
            isAllowed = document.getElementById('questionText').value !== '' && document.getElementById('answerText').value !== '';
        } else {
            isAllowed = document.getElementById('optionA').value !== '' && 
                        document.getElementById('optionB').value !== '' && 
                        document.getElementById('optionC').value !== '' && 
                        document.getElementById('optionD').value !== '' &&
                        document.getElementById('optionE').value !== '';
        }
        if(isAllowed){
            let question;
            if (questionTypeSelect.value === 'free-text') {
                question = {
                    type: 'free-text',
                    question: document.getElementById('questionText').value,
                    answer: document.getElementById('answerText').value
                };
            } else {
                question = {
                    type: 'multiple-choice',
                    question: document.getElementById('questionMC').value,
                    options: {
                        a: document.getElementById('optionA').value,
                        b: document.getElementById('optionB').value,
                        c: document.getElementById('optionC').value,
                        d: document.getElementById('optionD').value,
                        e: document.getElementById('optionE').value
                    },
                    correctOption: document.getElementById('correctOption').value
                };
            }
            questions.push(question);
            localStorage.setItem('questions', JSON.stringify(questions));
            if(questionTypeSelect.value === 'free-text'){
                document.getElementById('questionText').value = '';
                document.getElementById('answerText').value = '';
            }else{
                document.getElementById('questionMC').value = '';
                document.getElementById('optionA').value = '';
                document.getElementById('optionB').value = '';
                document.getElementById('optionC').value = '';
                document.getElementById('optionD').value = '';
                document.getElementById('optionE').value = '';
            }
            feedbackQuestion.textContent = 'Добавено!';
            setTimeout(function() {
                feedbackQuestion.textContent = '';
            }, 2000);
        }else{
            feedbackQuestion.textContent = 'Всички полета са задължителни!';
        }
    });

    playButton.addEventListener('click', function() {
        homePage.classList.add('hidden');
        questionSection.classList.add('hidden');
        playSection.classList.remove('hidden');
        currentQuestionIndex = 0;
        displayQuestion();
    });

    submitAnswerButton.addEventListener('click', function() {
        const currentQuestion = questions[currentQuestionIndex];
        let isCorrect;
        if (currentQuestion.type === 'free-text') {
            isCorrect = (userAnswer.value.toLowerCase() === currentQuestion.answer.toLowerCase());
        } else {
            isCorrect = (userAnswer.value.toLowerCase() === currentQuestion.correctOption);
        }
        showFeedback(isCorrect);
        userAnswer.value = '';
    });

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

    document.getElementById('uploadButton').addEventListener('click', () => {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const xml = event.target.result;
                parseXMLFile(xml);
                alert('Готово е файлчето буб!');
            };
            reader.readAsText(file);
        } else {
            alert('Избери първо файлче буб.');
        }
    });

    function parseXMLFile(xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
    
        const exams = xmlDoc.getElementsByTagName('Exam');
        for (let i = 0; i < exams.length; i++) {
            const questionText = exams[i].getElementsByTagName('Question')[0].textContent;
            const answers = exams[i].getElementsByTagName('Answers')[0];
    
            if (answers.children.length === 1) {
                // Free-text question
                const answerText = answers.children[0].textContent;
                let question = {
                    type: 'free-text',
                    question: questionText,
                    answer: answerText.startsWith('*') ? answerText.substring(1) : answerText // Remove asterisk if present
                };
                questions.push(question);
            } else {
                // Multiple-choice question
                const options = {};
                let correctOption = '';
    
                for (let j = 0; j < answers.children.length; j++) {
                    let answerText = answers.children[j].textContent;
                    if (answerText.startsWith('*')) {
                        answerText = answerText.substring(1); // remove the asterisk
                        correctOption = String.fromCharCode(97 + j); // convert to a, b, c, or d
                    }
                    options[String.fromCharCode(97 + j)] = answerText; // a, b, c, d
                }
    
                let question = {
                    type: 'multiple-choice',
                    question: questionText,
                    options: options,
                    correctOption: correctOption
                };
    
                questions.push(question);
            }
        }
        localStorage.setItem('questions', JSON.stringify(questions));
    }
    

    // Modal related functions
    function showFeedback(isCorrect) {
        const currentQuestion = questions[currentQuestionIndex];
        const modal = document.querySelector('.modal');
        const feedbackImage = document.getElementById('feedbackImage');
        const feedbackMessage = document.getElementById('feedbackMessage');

        if (isCorrect) {
            feedbackImage.src = 'images/right.gif'; // Set the path to the correct image
            feedbackMessage.textContent = "Правилно буб!";
            modal.style.display = 'block'; // Display the modal
        } else {
            feedbackImage.src = 'images/wrong.gif'; // Set the path to the incorrect image
            if(currentQuestion.type === 'free-text'){
                feedbackMessage.textContent = 'Грешно буб! Правилният отговор е: ' + currentQuestion.answer;
            }else{
                feedbackMessage.textContent = 'Грешно буб! Правилният отговор е: ' + currentQuestion.correctOption.toUpperCase();
            }
            modal.style.display = 'block'; // Display the modal
        }

        // Close the modal when the user clicks anywhere outside of it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
});
