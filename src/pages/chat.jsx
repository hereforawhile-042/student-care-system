import Layout from "../components/layout";
import { useState, useEffect, useRef } from "react";
import {
  FiSend,
  FiPaperclip,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { supabase } from "../lib/supabaseClient";

const Chat = ({ collapse, setCollapse }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeCounsellor, setActiveCounsellor] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [counsellors, setCounsellors] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Get current user
  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setCurrentUser(user);
  };

  // Fetch counsellors associated with the student
  const fetchCounsellors = async () => {
    if (!currentUser) return;

    // Get all counsellors
    const { data, error } = await supabase
      .from("counsellor_profiles")
      .select("id, full_name, user_id")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error fetching counsellors:", error);
      return;
    }

    // Get last messages for each counsellor
    const counsellorsWithMessages = await Promise.all(
      data.map(async (counsellor) => {
        const { data: messages, error } = await supabase
          .from("messages")
          .select("content, created_at, read")
          .or(
            `and(sender_id.eq.${counsellor.user_id},receiver_id.eq.${currentUser.id}),and(sender_id.eq.${currentUser.id},receiver_id.eq.${counsellor.user_id})`
          )
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) console.error("Error fetching last message:", error);

        // Get online status
        const { data: userStatus } = await supabase
          .from("users")
          .select("last_seen_at")
          .eq("id", counsellor.user_id)
          .single();

        const online = userStatus?.last_seen_at
          ? new Date() - new Date(userStatus.last_seen_at) < 5 * 60 * 1000
          : false;

        return {
          ...counsellor,
          name: counsellor.full_name,
          last_message: messages?.[0]?.content || "No messages yet",
          last_message_time: messages?.[0]?.created_at
            ? new Date(messages[0].created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          unread:
            messages?.[0]?.read === false &&
            messages[0].sender_id !== currentUser.id
              ? 1
              : 0,
          online,
        };
      })
    );

    setCounsellors(counsellorsWithMessages);

    // Set the first counsellor as active by default
    if (counsellorsWithMessages.length > 0 && !activeCounsellor) {
      setActiveCounsellor(counsellorsWithMessages[0]);
    }
  };

  // Fetch messages for the active conversation
  const fetchMessages = async (counsellorUserId) => {
    if (!currentUser || !counsellorUserId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${counsellorUserId}),` +
          `and(sender_id.eq.${counsellorUserId},receiver_id.eq.${currentUser.id})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    // Format messages for UI
    const formattedMessages = data.map((msg) => ({
      id: msg.id,
      text: msg.content,
      from: msg.sender_id === currentUser.id ? "student" : "counsellor",
      time: new Date(msg.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    setMessages(formattedMessages);

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("receiver_id", currentUser.id)
      .eq("sender_id", counsellorUserId)
      .eq("read", false);
  };

  // Set up real-time message subscription
  useEffect(() => {
    if (!currentUser || !activeCounsellor) return;

    const channel = supabase
      .channel(`messages:${currentUser.id}_${activeCounsellor.user_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(receiver_id=eq.${currentUser.id}, sender_id=eq.${currentUser.id})`,
        },
        (payload) => {
          // Only add if it's part of the current conversation
          if (
            (payload.new.sender_id === currentUser.id &&
              payload.new.receiver_id === activeCounsellor.user_id) ||
            (payload.new.sender_id === activeCounsellor.user_id &&
              payload.new.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => [
              ...prev,
              {
                id: payload.new.id,
                text: payload.new.content,
                from:
                  payload.new.sender_id === currentUser.id
                    ? "student"
                    : "counsellor",
                time: new Date(payload.new.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);

            // If message is for current user, mark as read
            if (payload.new.receiver_id === currentUser.id) {
              supabase
                .from("messages")
                .update({ read: true })
                .eq("id", payload.new.id);
            }
          }

          // Refresh counsellor list to update last message
          fetchCounsellors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    fetchCounsellors();
  }, []);

  useEffect(() => {
    if (currentUser && activeCounsellor) {
      fetchMessages(activeCounsellor.user_id);
    }
  }, [currentUser, activeCounsellor]);

  const handleSend = async () => {
    if (newMessage.trim() === "" || !currentUser || !activeCounsellor) return;

    // Create temporary message for optimistic UI
    const tempId = Date.now();
    const newMsg = {
      id: tempId,
      from: "student",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    try {
      // Insert into Supabase
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: currentUser.id,
          receiver_id: activeCounsellor.user_id,
          content: newMessage,
          read: false,
        },
      ]);

      if (error) throw error;

      // Refresh counsellor list to update last message
      fetchCounsellors();
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove temporary message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      setShowScrollHint(scrollTop + clientHeight < scrollHeight - 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
    setShowScrollHint(false);
  }, [messages, activeCounsellor]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const filteredCounsellors = counsellors.filter(
    (counsellor) =>
      counsellor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (counsellor.last_message &&
        counsellor.last_message
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout collapse={collapse} setCollapse={setCollapse} noPadding={true}>
      <div className="flex h-screen overflow-hidden bg-stone-800">
        {/* Sidebar */}
        <div className="w-[350px] bg-stone-700 text-white flex flex-col">
          <div className="p-4 border-b border-stone-600">
            <h2 className="text-lg ml-6 font-semibold mb-4">Chats</h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-stone-600 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {filteredCounsellors.map((counsellor) => (
                <li
                  key={counsellor.id}
                  onClick={() => {
                    setActiveCounsellor(counsellor);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    activeCounsellor?.id === counsellor.id
                      ? "bg-stone-600"
                      : "hover:bg-stone-600"
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {counsellor.name.charAt(0)}
                      </span>
                    </div>
                    {counsellor.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-stone-700"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">{counsellor.name}</h3>
                      <span className="text-xs text-gray-400">
                        {counsellor.last_message_time || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-300 truncate">
                        {counsellor.last_message || "Start a conversation"}
                      </p>
                      {counsellor.unread > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {counsellor.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex flex-col flex-1 bg-white rounded-tl-xl overflow-hidden">
          {/* Header */}
          {activeCounsellor ? (
            <>
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold">
                        {activeCounsellor.name.charAt(0)}
                      </span>
                    </div>
                    <div
                      className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-white ${
                        activeCounsellor.online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {activeCounsellor.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeCounsellor.online ? "Online" : "Offline"} • Last
                      seen: Recently
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
                onScroll={handleScroll}
              >
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.from === "student" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-md text-sm transition-all ${
                          msg.from === "student"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div
                          className={`text-xs mt-1 ${
                            msg.from === "student"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6 max-w-md">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiSend className="w-8 h-8 text-teal-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Start a conversation with {activeCounsellor.name}
                      </h3>
                      <p className="text-gray-600">
                        Send your first message to begin your conversation
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll hint */}
              {showScrollHint && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-24 right-8 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
                >
                  <FiChevronDown className="text-lg" />
                </button>
              )}

              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-gray-700 p-2 mr-1">
                    <FiPaperclip className="text-xl" />
                  </button>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    type="text"
                    placeholder={`Message ${activeCounsellor.name}...`}
                    className="flex-1 p-3 text-sm border rounded-xl mr-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-xl flex items-center justify-center ${
                      newMessage.trim()
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-300 cursor-not-allowed"
                    } text-white transition-colors`}
                  >
                    <FiSend className="text-lg" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center p-6 max-w-md">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSend className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Select a counsellor to chat
                </h3>
                <p className="text-gray-600">
                  Choose a counsellor from the list to start a conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
