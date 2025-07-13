import Layout from "../components/layout";
import { useState, useRef, useEffect } from "react";

const Agent = ({ collapse, setCollapse }) => {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Mock AI reply
    const aiReply = await mockAIResponse(input);
    setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
  };

  const mockAIResponse = async (text) => {
    return `You said: "${text}" – thank you for sharing. How else can I support you?`;
  };

  return (
    <Layout collapse={collapse} setCollapse={setCollapse} noPadding>
      <div className="h-[100%] flex flex-col bg-gray-100">
        {/* Header */}
        <div className="p-4 bg-white shadow text-center">
          <h1 className="text-sm font-semibold text-gray-800">
          🚦 AI Support Agent
          </h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-fit p-3 rounded-lg text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Field */}
        <div className="bg-white p-4 border-t shadow-md">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 p-2 border outline-none rounded text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Agent;
