import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Sample mood data
const moodData = [
  { date: "2025-04-01", mood: "Happy" },
  { date: "2025-04-02", mood: "Sad" },
  { date: "2025-04-03", mood: "Neutral" },
  { date: "2025-04-04", mood: "Anxious" },
  { date: "2025-04-05", mood: "Happy" },
];

// Convert moods to numbers for graphing
const moodScale = {
  Sad: 1,
  Anxious: 2,
  Neutral: 3,
  Happy: 4,
};

const moodLabels = {
  1: "Sad",
  2: "Anxious",
  3: "Neutral",
  4: "Happy",
};

const processedData = moodData.map((entry) => ({
  date: entry.date,
  moodScore: moodScale[entry.mood],
}));

const MoodTracker = () => {
  return (
    <div className="w-full h-[250px] p-4 bg-stone-800 rounded-xl shadow-md text-white">
      <h2 className="mb-2 text-md">Mood Tracker</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="2 4" stroke="#ffffff" />
          <XAxis dataKey="date" tick={{ fontSize: "13px", fill: "#ffffff" }} />
          <YAxis
            domain={[1, 3]}
            ticks={[1, 2, 3, 4]}
            tick={{ fontSize: "13px", fill: "#ffffff" }}
            tickFormatter={(tick) => moodLabels[tick]}
          />
          <Tooltip
            formatter={(value) => moodLabels[value]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="moodScore"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTracker;
