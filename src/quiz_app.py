import tkinter as tk
from tkinter import ttk
import json
import random

# Load quiz data with error handling
try:
    with open("data.json") as f:
        quiz = json.load(f)
    if "tips" not in quiz or len(quiz["tips"]) != len(quiz["question"]):
        print("Error: 'tips' key missing or does not match question count in data.json!")
        exit(1)
    for tip in quiz["tips"]:
        if not isinstance(tip, str):
            print("Error: All tips must be strings in data.json!")
            exit(1)
except FileNotFoundError:
    print("Error: data.json not found!")
    exit(1)
except json.JSONDecodeError:
    print("Error: data.json is not a valid JSON file!")
    exit(1)

class QuizApp:
    def __init__(self, root):
        self.root = root
        self.root.title("DLM:CBSE IX AI Unit-5 Python MCQ")
        self.root.geometry("700x600")
        self.root.configure(bg="#f4f4f4")
        self.root.update_idletasks()

        self.current_q = 0
        self.score = 0
        self.selected_answer = None
        self.option_labels = ["A.", "B.", "C.", "D."]
        self.user_answers = {}
        self.answered_questions = set()

        # Shuffle question indices
        self.indices = list(range(len(quiz["question"])))
        random.shuffle(self.indices)

        # Frames for organization
        self.main_frame = tk.Frame(root, bg="white")
        self.main_frame.pack(expand=True, fill="both", padx=10, pady=10)

        # Progress Bar
        self.progress = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(self.main_frame, orient="horizontal", length=200, mode="determinate", variable=self.progress)
        self.progress_bar.grid(row=0, column=0, columnspan=2, pady=5, padx=10, sticky="w")
        self.update_progress()

        # Question Number Label
        self.q_number_label = tk.Label(self.main_frame, text=f"Q1/{len(quiz['question'])}", font=("Arial", 12, "bold"), bg="white", anchor="w")
        self.q_number_label.grid(row=0, column=1, sticky="e", padx=10, pady=5)

        # Question Label
        self.question_label = tk.Label(self.main_frame, text="", font=("Arial", 16, "bold"), bg="white", wraplength=500, justify="left")
        self.question_label.grid(row=1, column=0, columnspan=2, pady=10)

        # Option Buttons
        self.option_buttons = []
        for i in range(4):
            btn = tk.Button(self.main_frame, text="", font=("Arial", 12), bg="#0078D7", fg="white", width=40, height=2, anchor="w")
            btn.grid(row=i+2, column=0, columnspan=2, pady=5, padx=10, sticky="w")
            btn.bind(f"<KeyPress-{i+1}>", lambda event, ans=i: self.select_answer_key(ans))
            self.option_buttons.append(btn)

        # Tip Label (Initially hidden)
        self.tip_label = tk.Label(self.main_frame, text="", font=("Arial", 12, "italic"), bg="#28A745", fg="white", wraplength=600, padx=10, pady=5)
        self.tip_label.grid(row=6, column=0, columnspan=2, pady=5)
        self.tip_label.grid_remove()

        # Buttons Frame
        self.button_frame = tk.Frame(self.main_frame, bg="white")
        self.button_frame.grid(row=7, column=0, columnspan=2, pady=10)

        # Tips Button
        self.tips_button = tk.Button(self.button_frame, text="SHOW TIP", font=("Arial", 12), bg="#FFC107", fg="black", command=self.show_tip)
        self.tips_button.pack(side="left", padx=5)

        # Navigation Buttons
        self.next_button = tk.Button(self.button_frame, text="NEXT", font=("Arial", 12), bg="#0078D7", fg="white", command=self.next_question)
        self.next_button.pack(side="right", padx=5)

        self.back_button = tk.Button(self.button_frame, text="BACK", font=("Arial", 12), bg="#6c757d", fg="white", command=self.previous_question)
        self.back_button.pack(side="right", padx=5)

        self.score_button = tk.Button(self.main_frame, text="VIEW SCORE", font=("Arial", 12), bg="#28A745", fg="white", command=self.show_results)
        self.score_button.grid(row=8, column=0, columnspan=2, pady=10)

        self.show_question()

    def update_progress(self):
        progress_value = (self.current_q / len(quiz["question"])) * 100
        self.progress.set(progress_value)

    def show_question(self):
        index = self.indices[self.current_q]
        self.q_number_label.config(text=f"Q{self.current_q + 1}/{len(quiz['question'])}")
        self.question_label.config(text=quiz["question"][index])
        self.tip_label.grid_remove()
        self.tips_button.config(text="SHOW TIP")
        self.update_progress()

        options = quiz["options"][index].copy()
        random.shuffle(options)
        original_options = quiz["options"][index]
        correct_option_index = quiz["answer"][index]
        correct_answer = original_options[correct_option_index]

        for i, btn in enumerate(self.option_buttons):
            btn.config(
                text=f"{self.option_labels[i]} {options[i]}",
                bg="#0078D7",
                command=lambda ans=options[i], b=btn, correct=correct_answer: self.select_answer(ans, correct, b)
            )

        self.selected_answer = None
        if index in self.user_answers:
            selected_answer = self.user_answers[index][0]
            for i, btn in enumerate(self.option_buttons):
                if options[i] == selected_answer:
                    btn.config(bg="#FF5733" if selected_answer != correct_answer else "#28A745")
                    self.selected_answer = selected_answer
                    break

    def select_answer(self, selected, correct_answer, button):
        self.selected_answer = selected
        index = self.indices[self.current_q]

        for btn in self.option_buttons:
            btn.config(bg="#0078D7")

        button.config(bg="#28A745" if selected == correct_answer else "#FF5733")
        self.user_answers[index] = (selected, correct_answer)
        self.tip_label.grid_remove()
        self.tips_button.config(text="SHOW TIP")

    def select_answer_key(self, option_index):
        if option_index < len(self.option_buttons):
            btn = self.option_buttons[option_index]
            btn.invoke()

    def show_tip(self):
        index = self.indices[self.current_q]
        if self.tip_label.winfo_viewable():
            self.tip_label.grid_remove()
            self.tips_button.config(text="SHOW TIP")
        else:
            self.tip_label.config(text=quiz["tips"][index], bg="#28A745", fg="white")
            self.tip_label.grid()
            self.tips_button.config(text="HIDE TIP")

    def next_question(self):
        if self.selected_answer is None:
            self.tip_label.config(text="⚠️ Please select an answer before proceeding!", bg="#FF5733", fg="white")
            self.tip_label.grid()
            return

        index = self.indices[self.current_q]
        correct_answer = self.user_answers.get(index, [None, None])[1]

        if index not in self.answered_questions and self.selected_answer == correct_answer:
            self.score += 1
        self.answered_questions.add(index)

        if self.current_q < len(quiz["question"]) - 1:
            self.current_q += 1
            self.show_question()
        else:
            self.show_results()

    def previous_question(self):
        if self.current_q > 0:
            self.current_q -= 1
            self.show_question()

    def save_results(self):
        try:
            with open("quiz_results.txt", "w") as f:
                f.write(f"{'Python Quiz Results':^80}\n")
                f.write(f"{'-'*80}\n")
                f.write(f"Your Score: {self.score}/{len(quiz['question'])}\n\n")
                for i, index in enumerate(self.indices, 1):
                    if index in self.user_answers:
                        q = quiz["question"][index]
                        user_ans, correct_ans = self.user_answers[index]
                        status = "Correct" if user_ans == correct_ans else "Incorrect"
                        f.write(f"Q{i}: {q[:50]:<50}...\n")
                        f.write(f"  Your Answer: {user_ans:<40}\n")
                        f.write(f"  Correct Answer: {correct_ans:<40}\n")
                        f.write(f"  Status: {status:<40}\n")
                        f.write(f"{'-'*80}\n")
        except IOError as e:
            print(f"Error saving results: {e}")

    def show_results(self):
        result_window = tk.Toplevel(self.root)
        result_window.title("Quiz Results")
        result_window.geometry("700x400")
        result_window.configure(bg="white")

        score_percent = (self.score / len(quiz["question"])) * 100
        if score_percent >= 80:
            message = "Great job! You're mastering Python!"
        elif score_percent >= 50:
            message = "Good effort! Keep practicing to improve!"
        else:
            message = "Don't give up! Review and try again!"
        message_label = tk.Label(result_window, text=message, font=("Arial", 12, "bold"), bg="white")
        message_label.pack(pady=5)

        frame_canvas = tk.Frame(result_window)
        frame_canvas.pack(fill="both", expand=True)

        canvas = tk.Canvas(frame_canvas)
        scrollbar = tk.Scrollbar(frame_canvas, orient="vertical", command=canvas.yview)
        scrollbar.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)
        canvas.configure(yscrollcommand=scrollbar.set)

        frame_results = tk.Frame(canvas, bg="white")
        canvas.create_window((0, 0), window=frame_results, anchor="nw")

        headers = ["Q#", "Question", "Your Answer", "Correct Answer", "Status"]
        for col, header in enumerate(headers):
            tk.Label(frame_results, text=header, font=("Arial", 12, "bold"), bg="white").grid(row=0, column=col, padx=5, pady=5, sticky="w")

        for i, index in enumerate(self.indices, 1):
            if index in self.user_answers:
                q = quiz["question"][index][:30] + "..." if len(quiz["question"][index]) > 30 else quiz["question"][index]
                user_ans, correct_ans = self.user_answers[index]
                status = "Correct" if user_ans == correct_ans else "Incorrect"
                color = "#28A745" if status == "Correct" else "#FF5733"

                tk.Label(frame_results, text=f"Q{i}", font=("Arial", 12), bg="white").grid(row=i, column=0, padx=5, pady=2, sticky="w")
                tk.Label(frame_results, text=q, font=("Arial", 12), bg="white").grid(row=i, column=1, padx=5, pady=2, sticky="w")
                tk.Label(frame_results, text=user_ans, font=("Arial", 12), bg="white").grid(row=i, column=2, padx=5, pady=2, sticky="w")
                tk.Label(frame_results, text=correct_ans, font=("Arial", 12), bg="white").grid(row=i, column=3, padx=5, pady=2, sticky="w")
                tk.Label(frame_results, text=status, font=("Arial", 12), bg=color, fg="white").grid(row=i, column=4, padx=5, pady=2, sticky="w")

        frame_results.update_idletasks()
        canvas.config(scrollregion=canvas.bbox("all"))

        button_frame = tk.Frame(result_window, bg="white")
        button_frame.pack(pady=10)
        tk.Button(button_frame, text="Restart Quiz", font=("Arial", 12), bg="#0078D7", fg="white", command=lambda: self.restart_quiz(result_window)).pack(side="left", padx=5)
        tk.Button(button_frame, text="Close", font=("Arial", 12), bg="#DC3545", fg="white", command=result_window.destroy).pack(side="left", padx=5)

        self.save_results()

    def restart_quiz(self, result_window):
        result_window.destroy()
        self.current_q = 0
        self.score = 0
        self.user_answers = {}
        self.answered_questions = set()
        self.indices = list(range(len(quiz["question"])))
        random.shuffle(self.indices)
        self.show_question()

root = tk.Tk()
app = QuizApp(root)
root.mainloop()
