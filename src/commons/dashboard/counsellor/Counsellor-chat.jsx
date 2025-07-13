import { useState, useEffect, useRef } from "react";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Clock,
  CheckCircle,
  User,
  Heart,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import Layout from "../../../components/layout";
import { supabase } from "../../../lib/supabaseClient";

const CounsellorChat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showStudentList, setShowStudentList] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessage = (msg) => ({
    id: msg.id,
    text: msg.content,
    sender: msg.sender_id === currentUser.id ? "counsellor" : "student",
    timestamp: new Date(msg.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "delivered",
  });

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setCurrentUser(user);
  };

  const fetchStudents = async () => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from("student_profiles")
      .select("id, full_name, matric_no")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error fetching students:", error);
      return;
    }

    setStudents(data);

    if (data.length > 0 && !activeStudent) {
      setActiveStudent({
        id: data[0].id,
        name: data[0].full_name,
        matric: data[0].matric_no,
        status: "online",
        lastSeen: "Active now",
      });
    }
  };

  const fetchMessages = async () => {
    if (!currentUser || !activeStudent) return;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${activeStudent.id}),` +
          `and(sender_id.eq.${activeStudent.id},receiver_id.eq.${currentUser.id})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    const formattedMessages = data.map(formatMessage);
    setMessages(formattedMessages);
  };

  useEffect(() => {
    if (!currentUser || !activeStudent) return;

    const channel = supabase
      .channel(`messages_${currentUser.id}_${activeStudent.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(sender_id=eq.${currentUser.id},receiver_id=eq.${currentUser.id})`,
        },
        (payload) => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === currentUser.id &&
              newMsg.receiver_id === activeStudent.id) ||
            (newMsg.sender_id === activeStudent.id &&
              newMsg.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => [...prev, formatMessage(newMsg)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, activeStudent]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) fetchStudents();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && activeStudent) fetchMessages();
  }, [currentUser, activeStudent]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser || !activeStudent) return;

    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      text: message,
      sender: "counsellor",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sending",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    try {
      const { data, error } = await supabase.from("messages").insert([
        {
          sender_id: currentUser.id,
          receiver_id: activeStudent.id,
          content: message,
        },
      ]);

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, id: data[0].id, status: "delivered" }
              : msg
          )
        );
      }

      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "error" } : msg
        )
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectStudent = (student) => {
    setActiveStudent({
      id: student.id,
      name: student.full_name,
      matric: student.matric_no,
      status: "online",
      lastSeen: "Active now",
    });
    setMessages([]);
    if (window.innerWidth < 768) setShowStudentList(false);
  };
  return (
    <Layout
      color="bg-blue-500"
      counsellor={true}
      currentUser={currentUser}
      noPadding
    >
      <div className="flex ml-8 h-full">
        {/* Student List Sidebar - Hidden on mobile when chat is active */}
        <div
          className={`bg-white border-r border-gray-200 w-full md:w-80 flex-shrink-0 flex-col ${
            showStudentList ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Students</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                  activeStudent?.id === student.id ? "bg-blue-100" : ""
                }`}
                onClick={() => selectStudent(student)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {student.full_name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Matric: {student.matric_no}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex w-full flex-col ${
            !showStudentList ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Chat Header with Back Button for Mobile */}
          <div className="bg-white shadow-sm border-b border-teal-100 px-4 py-4 flex items-center justify-between">
            {!showStudentList && (
              <button
                className="md:hidden mr-2 p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                onClick={() => setShowStudentList(true)}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center space-x-4 flex-1">
              {activeStudent ? (
                <>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {/* <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {activeStudent.name}
                    </h3>
                    <p className="text-sm text-teal-600 flex items-center">
                      {/* <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> */}
                      {activeStudent.lastSeen}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-500">
                    Select a student to chat
                  </span>
                </div>
              )}
            </div>

            {activeStudent && (
              <div className="flex items-center space-x-2">
                <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-white to-teal-50/30">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "counsellor"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.sender === "counsellor"
                        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div
                      className={`flex items-center justify-between mt-2 text-xs ${
                        msg.sender === "counsellor"
                          ? "text-teal-100"
                          : "text-gray-500"
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.sender === "counsellor" && (
                        <div className="flex items-center">
                          {msg.status === "sending" && (
                            <Clock className="w-3 h-3 ml-2 animate-pulse" />
                          )}
                          {msg.status === "delivered" && (
                            <CheckCircle className="w-3 h-3 ml-2" />
                          )}
                          {msg.status === "error" && (
                            <span className="text-xs text-red-300">Failed</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : activeStudent ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 max-w-md">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Start a conversation with {activeStudent.name}
                  </h3>
                  <p className="text-gray-600">
                    Send your first message to begin supporting this student
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 max-w-md">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Select a student to chat
                  </h3>
                  <p className="text-gray-600">
                    Choose a student from the list to start a conversation
                  </p>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      typing...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input - Only show if student is selected */}
          {activeStudent && (
            <div className="bg-white border-t border-teal-100 p-4 md:p-6">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Type your message to ${activeStudent.name}...`}
                    className="w-full self-center px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows="1"
                    style={{ minHeight: "48px", maxHeight: "120px" }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Response Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() =>
                    setMessage(
                      "That's understandable. How can I support you right now?"
                    )
                  }
                  className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm hover:bg-teal-100 transition-colors"
                >
                  <Heart className="w-3 h-3 inline mr-1" />
                  That's understandable
                </button>
                <button
                  onClick={() =>
                    setMessage(
                      "Would you like to schedule a session to discuss this further?"
                    )
                  }
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                >
                  <Clock className="w-3 h-3 inline mr-1" />
                  Schedule a session
                </button>
                <button
                  onClick={() =>
                    setMessage(
                      "Would you like me to share some resources that might help?"
                    )
                  }
                  className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                >
                  Share resources?
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CounsellorChat;
