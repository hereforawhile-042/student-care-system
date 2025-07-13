// Example recommendations based on different moods
const recommendations = {
  Happy: [
    {
      title: "Stay Active!",
      description:
        "Engage in a fun activity or workout to keep the positive vibes going.",
    },
    {
      title: "Share the Love!",
      description:
        "Spread kindness! Reach out to a friend or loved one and check in on them.",
    },
  ],
  Anxious: [
    {
      title: "Breathe Deeply",
      description:
        "Try some deep breathing exercises to help calm your nerves.",
    },
    {
      title: "Take a Break",
      description:
        "Step away from any stressors for a few minutes and relax your mind.",
    },
  ],
  Sad: [
    {
      title: "Talk to Someone",
      description:
        "Talking to someone close to you can help lighten your mood.",
    },
    {
      title: "Watch Your Favorite Show",
      description: "Take some time to unwind with a feel-good show or movie.",
    },
  ],
  // Add more moods as needed
};

function PersonalizedRecommendations({ userMood }) {
  // Get the recommendations based on the user's current mood
  const filteredRecommendations = recommendations[userMood] || [
    {
      title: "Take Care of Yourself",
      description: "It's okay to have off days. Rest and recharge!",
    },
  ];

  return (
    <div className="bg-stone-800 p-4 pb-8 rounded-xl shadow-lg">
      <h2 className="text-white text-base font-semibold mb-4">
        Personalized Recommendations
      </h2>
      <div className="space-y-2">
        <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/inpok4MKVLM"
            title="10-Minute Meditation for Anxiety"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full rounded-md"
            allowFullScreen
          ></iframe>
        </div>

        <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/1vx8iUvfyCY"
            title="Relaxing Music for Stress Relief"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full rounded-md"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* text area */}
      <div className="bg-stone-900 rounded-lg p-4 mt-2 text-gray-200 h-64 flex flex-col">
        <h3 className="text-base text-white mb-2">Chat with AI Assistant</h3>

        <div className="flex-1 overflow-y-auto space-y-4 text-sm mb-2">
          <div className="bg-stone-800 p-2 rounded-lg self-start max-w-xs cursor-pointer">
            Hello! How can I help you today?
          </div>
          <div className="bg-blue-600 p-2 rounded-lg self-end max-w-xs text-white cursor-pointer">
            I need help with scheduling a session
          </div>
        </div>

        <div className="flex mt-auto">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 text-sm rounded-l-lg bg-stone-800 text-white outline-none"
          />
          <button className="bg-blue-600 px-4 rounded-r-lg text-sm text-white">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalizedRecommendations;
