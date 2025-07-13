import { useEffect, useState } from "react";
import Layout from "../components/layout";

const getScore = (answers) => {
  return answers.reduce((sum, val) => sum + parseInt(val || 0), 0);
};

const getFeedback = (score) => {
  if (score <= 4)
    return {
      level: "Minimal",
      message:
        "You're doing okay. Keep checking in with yourself and practicing self-care.",
    };
  if (score <= 9)
    return {
      level: "Mild",
      message:
        "You're showing mild distress. Consider relaxation techniques or light journaling.",
    };
  if (score <= 12)
    return {
      level: "Moderate",
      message:
        "Signs of moderate distress detected. Reflect on triggers and talk to someone you trust.",
    };
  return {
    level: "Severe",
    message:
      "High distress level. Please prioritize your mental health and consider seeking professional help.",
  };
};

const Feedback = ({ collapse, setCollapse }) => {
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("assessmentAnswers"));
    if (stored) {
      setAnswers(stored);
      const total = getScore(stored);
      setScore(total);
      setFeedback(getFeedback(total));
    }
  }, []);

  return (
    <Layout collapse={collapse} setCollapse={setCollapse}>
      <div className="p-6 text-xl max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-6 text-gray-800">
          Your Mental Health Check-In Result
        </h1>

        {answers.length === 0 ? (
          <p className="text-gray-600">
            No assessment results found. Please complete the check-in first.
          </p>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Total Score:</span> {score} / 15
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Emotional State:</span>{" "}
                {feedback.level} distress
              </p>
            </div>

            <div className="bg-blue-50 border text-sm border-blue-200 rounded-lg p-4 text-blue-800">
              {feedback.message}
            </div>

            <div className="pt-4 flex text-sm flex-wrap gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
                View Coping Resources
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition">
                Schedule a Session
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition">
                Retake Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Feedback;
