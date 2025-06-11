document.addEventListener("DOMContentLoaded", function() {
    console.log("Quiz App Loaded!");

    // Get DOM elements
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const currentQuestionEl = document.getElementById("current-question");
    const progressBar = document.getElementById("progress-bar");
    const questionContentEl = document.getElementById("question-content");
    const resultContainer = document.getElementById("result-container");
    const resultTableBody = document.getElementById("result-table-body");
    const restartBtn = document.getElementById("restart-btn");
    const downloadBtn = document.getElementById("download-btn");
    const quitBtn = document.getElementById("quit-btn");

    // Quiz questions
    const questions = [
        {
            question: "What is the purpose of the `print()` function in Python?",
            options: ["To take input from the user", "To display output to the screen", "To perform calculations", "To define variables"],
            correctAnswer: "To display output to the screen"
        },
        {
            question: "What will be the output of the following code?\n```python\nprint(\"Hello, World!\")\n```",
            options: ["Hello, World!", "\"Hello, World!\"", "(Hello, World!)", "SyntaxError"],
            correctAnswer: "Hello, World!"
        },
        {
            question: "Which function is used to take user input in Python?",
            options: ["scan()", "read()", "input()", "print()"],
            correctAnswer: "input()"
        },
        {
            question: "What is the default data type returned by the `input()` function?",
            options: ["`int`", "`float`", "`str`", "`bool`"],
            correctAnswer: "`str`"
        },
        {
            question: "What will be the output of the following conditional statement?\n```python\nx = 10\nif x > 5:\n    print(\"Greater than 5\")\nelse:\n    print(\"Less than or equal to 5\")\n```",
            options: ["Greater than 5", "Less than or equal to 5", "10", "SyntaxError"],
            correctAnswer: "Greater than 5"
        },
        {
            question: "What is the purpose of the `for` loop in Python?",
            options: ["To execute code only once", "To iterate over a sequence", "To define variables", "To create functions"],
            correctAnswer: "To iterate over a sequence"
        },
        {
            question: "How many times will the following loop execute?\n```python\nfor i in range(3):\n    print(i)\n```",
            options: ["1", "2", "3", "4"],
            correctAnswer: "3"
        },
        {
            question: "What will be the output of the following code?\n```python\nmy_list = [1, 2, 3, 4, 5]\nprint(my_list[2])\n```",
            options: ["1", "2", "3", "5"],
            correctAnswer: "3"
        },
        {
            question: "What is slicing in Python lists?",
            options: ["Extracting a portion of a list", "Deleting items from a list", "Adding elements to a list", "Sorting a list"],
            correctAnswer: "Extracting a portion of a list"
        },
        {
            question: "What will be the output of the following code?\n```python\nmy_list = [10, 20, 30, 40, 50]\nprint(my_list[1:4])\n```",
            options: ["[10, 20, 30]", "[20, 30, 40]", "[30, 40, 50]", "SyntaxError"],
            correctAnswer: "[20, 30, 40]"
        },
        {
            question: "Which statement is used to stop a loop prematurely in Python?",
            options: ["pass", "continue", "break", "return"],
            correctAnswer: "break"
        },
        {
            question: "What will be the output of the following code?\n```python\nfor i in range(5):\n    if i == 3:\n        break\n    print(i)\n```",
            options: ["0 1 2", "0 1 2 3 4", "3 4", "SyntaxError"],
            correctAnswer: "0 1 2"
        },
        {
            question: "What will be the output of the following code?\n```python\nprint([1, 2, 3] + [4, 5, 6])\n```",
            options: ["[1, 2, 3, 4, 5, 6]", "[1, 2, 3][4, 5, 6]", "SyntaxError", "6"],
            correctAnswer: "[1, 2, 3, 4, 5, 6]"
        },
        {
            question: "What will be the output of the following `while` loop?\n```python\nx = 5\nwhile x > 0:\n    print(x)\n    x -= 2\n```",
            options: ["5 3 1", "5 4 3 2 1", "Infinite loop", "SyntaxError"],
            correctAnswer: "5 3 1"
        },
        {
            question: "How do you add an element to a list in Python?",
            options: ["my_list.append(element)", "my_list.add(element)", "my_list.insert(element)", "my_list.push(element)"],
            correctAnswer: "my_list.append(element)"
        }
    ];

    let currentQuestion = 1;
    let userAnswers = [];
    let shuffledQuestions = [];

    // Fisher-Yates shuffle algorithm
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Shuffle questions and options
    function initializeQuiz() {
        shuffledQuestions = JSON.parse(JSON.stringify(questions));
        shuffledQuestions = shuffle(shuffledQuestions);
        shuffledQuestions.forEach(q => {
            const correctAnswer = q.correctAnswer;
            q.options = shuffle(q.options);
            q.correctAnswer = correctAnswer;
        });
    }

    // Update progress bar
    function updateProgress(current, total) {
        const progressPercentage = (current / total) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // Render current question
    function renderQuestion() {
        const q = shuffledQuestions[currentQuestion - 1];
        console.log("Raw question:", q.question);

        // Replace markdown code blocks with HTML pre/code tags
        let formattedQuestion = q.question.replace(/```python[\s\r\n]*([\s\S]*?)[\s\r\n]*```/g, (match, code) => {
            const escapedCode = code.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
            return `<pre style="background-color: #1f2937; color: white; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; display: block;" class="bg-gray-800 text-white p-3 rounded-lg font-mono text-sm overflow-x-auto"><code>${escapedCode}</code></pre>`;
        });
        console.log("Formatted question:", formattedQuestion);

        questionContentEl.innerHTML = `
            <p class="text-lg font-semibold">${formattedQuestion}</p>
            <div class="mt-2 space-y-2">
                ${q.options.map((option, index) => `
                    <label class="block p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">
                        <input type="radio" name="answer" value="${option}" class="mr-2" aria-label="Option ${index + 1}: ${option}">
                        ${option}
                    </label>
                `).join('')}
            </div>
        `;
        console.log("DOM updated with question content");

        const radioInputs = document.querySelectorAll('input[name="answer"]');
        console.log('Radio inputs found:', radioInputs.length);

        nextBtn.disabled = false;
        currentQuestionEl.textContent = currentQuestion;
        prevBtn.disabled = currentQuestion === 1;
    }

    // Display results
    function showResults() {
        questionContentEl.classList.add("hidden");
        prevBtn.classList.add("hidden");
        nextBtn.classList.add("hidden");
        resultContainer.classList.remove("hidden");

        resultTableBody.innerHTML = shuffledQuestions.map((q, index) => {
            const userAnswer = userAnswers[index] || "Not answered";
            const status = userAnswer === q.correctAnswer ? "Correct" : "Incorrect";
            return `
                <tr class="${status === 'Correct' ? 'bg-green-200' : 'bg-red-200'}">
                    <td class="p-2">${q.question.replace(/```python[\s\r\n]*([\s\S]*?)[\s\r\n]*```/g, '$1')}</td>
                    <td class="p-2">${userAnswer}</td>
                    <td class="p-2">${q.correctAnswer}</td>
                    <td class="p-2 ${status === 'Correct' ? 'text-green-600' : 'text-red-600'}">${status}</td>
                </tr>
            `;
        }).join('');

        const resultSheet = document.getElementById("result-sheet");
        resultSheet.style.maxHeight = '60vh';
        resultSheet.style.overflowY = 'auto';
        resultSheet.style.webkitOverflowScrolling = 'touch';
    }

    // Download PDF
    function downloadPDF() {
        if (!window.jspdf) {
            alert("PDF generation library not loaded. Please try again later.");
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("DLMentor Python Quiz Results", 10, 10);
        doc.setFontSize(10);
        const tableData = shuffledQuestions.map((q, index) => {
            const userAnswer = userAnswers[index] || "Not answered";
            const status = userAnswer === q.correctAnswer ? "Correct" : "Incorrect";
            const questionText = q.question.replace(/```python[\s\r\n]*([\s\S]*?)[\s\r\n]*```/g, '\n$1\n');
            return [
                questionText,
                userAnswer,
                q.correctAnswer,
                status
            ];
        });
        doc.autoTable({
            startY: 20,
            head: [['Question', 'Your Answer', 'Correct Answer', 'Status']],
            body: tableData,
            theme: 'striped',
            styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak', font: 'courier' },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 40 },
                2: { cellWidth: 40 },
                3: { cellWidth: 20 }
            },
            didParseCell: (data) => {
                if (data.column.index === 3) {
                    data.cell.styles.textColor = data.cell.text[0] === 'Correct' ? [22, 163, 74] : [220, 38, 38];
                }
            }
        });
        doc.save("quiz_results.pdf");
    }

    // Reset quiz
    function resetQuiz() {
        currentQuestion = 1;
        userAnswers = [];
        initializeQuiz();
        questionContentEl.classList.remove("hidden");
        prevBtn.classList.remove("hidden");
        nextBtn.classList.remove("hidden");
        resultContainer.classList.add("hidden");
        updateProgress(currentQuestion, shuffledQuestions.length);
        renderQuestion();
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const selectedAnswer = document.querySelector('input[name="answer"]:checked');
            if (!selectedAnswer) {
                alert("Please select an answer to proceed with the next question.");
                return;
            }
            userAnswers[currentQuestion - 1] = selectedAnswer.value;
            if (currentQuestion < shuffledQuestions.length) {
                currentQuestion++;
                updateProgress(currentQuestion, shuffledQuestions.length);
                renderQuestion();
            } else {
                showResults();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentQuestion > 1) {
                currentQuestion--;
                updateProgress(currentQuestion, shuffledQuestions.length);
                renderQuestion();
            }
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener("click", resetQuiz);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener("click", downloadPDF);
    }

    if (quitBtn) {
        quitBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to quit the quiz?")) {
                const quizContainer = document.getElementById("quiz-container");
                quizContainer.innerHTML = "<p class='text-center text-lg font-semibold text-gray-600'>Quiz terminated. Thank you for participating!</p>";
            }
        });
    }

    // Initialize quiz
    if (currentQuestionEl && progressBar && questionContentEl) {
        initializeQuiz();
        updateProgress(currentQuestion, shuffledQuestions.length);
        renderQuestion();
    } else {
        console.error("Required DOM elements are missing!");
    }
});