// questions.js
document.addEventListener("DOMContentLoaded", function() {
    const questionList = document.getElementById('questionList');
    const goBackButton = document.getElementById('goBackButton');

    let questions = JSON.parse(localStorage.getItem('questions')) || [];

    renderQuestionList();

    function renderQuestionList() {
        questionList.innerHTML = '';
        questions.forEach((q, index) => {
            const li = document.createElement('li');
            li.textContent = q.question;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                questions.splice(index, 1);
                localStorage.setItem('questions', JSON.stringify(questions));
                renderQuestionList();
            });
            li.appendChild(deleteButton);
            questionList.appendChild(li);
        });
    }

    goBackButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});
