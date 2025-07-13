import { useEffect, useState } from "react";

const questions = [
  "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?",
  "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
  "Over the past 2 weeks, how often have you felt nervous, anxious or on edge?",
  "Over the past 2 weeks, how often have you had trouble relaxing?",
  "Over the past 2 weeks, how often have you felt that you were a failure or let yourself/family down?",
];

const options = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];

export default function AssessmentModal() {
  const [visible, setVisible] = useState(true);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  useEffect(() => {
    const completed = localStorage.getItem("assessmentCompleted");
    if (!completed) setVisible(true);
  }, []);

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    localStorage.setItem("assessmentAnswers", JSON.stringify(answers));
    localStorage.setItem("assessmentCompleted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white rounded-xl shadow-lg p-6 max-w-md w-full border border-gray-300">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Quick Mental Wellness Check-In
      </h2>

      <div className="max-h-64 overflow-y-auto space-y-4">
        {questions.map((q, i) => (
          <div key={i}>
            <p className="text-sm mb-2 text-gray-700">{q}</p>
            <select
              value={answers[i]}
              onChange={(e) => handleAnswer(i, e.target.value)}
              className="w-full border p-2 rounded-md text-sm"
            >
              <option value="">Select</option>
              {options.map((opt, idx) => (
                <option value={opt} key={idx}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setVisible(false)}
          className="text-sm text-gray-500 hover:underline"
        >
          Skip
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
