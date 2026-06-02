import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api/api';
import { FiSend, FiMessageSquare, FiX, FiCpu } from 'react-icons/fi';
// 1. Import the markdown library
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [chat, open]);

  const send = async () => {
    if (!msg.trim()) return;
    const userMsg = msg;
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setMsg("");
    setLoading(true);

    try {
      const res = await api("/chatbot", "POST", { message: userMsg });

      // Robust response handling: checks if backend returned {reply: ""} or just ""
      const botResponse = typeof res === 'object' ? res.reply : res;

      setChat(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (err) {
      setChat(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed-bottom p-4 d-flex flex-column align-items-end" style={{ zIndex: 2000 }}>
      {open && (
        <div className="gemini-card mb-3 p-0 flex-column overflow-hidden shadow-2xl border-primary border-opacity-25"
             style={{ width: '380px', height: '500px', display: 'flex', border: '1px solid rgba(75, 144, 255, 0.2)' }}>

          {/* Chat Header */}
          <div className="p-3 d-flex justify-content-between align-items-center"
               style={{ background: 'linear-gradient(90deg, rgba(75, 144, 255, 0.15), rgba(142, 89, 255, 0.15))', backdropFilter: 'blur(10px)' }}>
            <span className="fw-bold d-flex align-items-center gap-2">
              <FiCpu className="text-primary" /> Smart Assistant
            </span>
            <button className="btn btn-link text-white p-0" onClick={() => setOpen(false)}>
              <FiX size={20} />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3 bg-black bg-opacity-40 custom-scrollbar">
            {chat.length === 0 && (
              <div className="text-center my-auto px-4">
                <p className="text-secondary small">Hello! I'm your library AI. Ask me about books, rentals, or how to use the dashboard.</p>
              </div>
            )}
            {chat.map((c, i) => (
              <div key={i}
                   className={`p-3 rounded-4 shadow-sm ${c.role === 'user'
                     ? 'bg-primary bg-opacity-25 align-self-end text-white border border-primary border-opacity-10'
                     : 'bg-dark align-self-start text-light border border-white border-opacity-10'}`}
                   style={{ maxWidth: '85%', fontSize: '0.9rem', lineHeight: '1.4' }}>
                <small className="d-block text-uppercase fw-bold mb-1 opacity-50" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                  {c.role === 'user' ? 'You' : 'Assistant'}
                </small>

                {/* 2. Changed to ReactMarkdown for Bot messages */}
                {c.role === 'user' ? (
                  c.text
                ) : (
                  <div className="markdown-container">
                    <ReactMarkdown>{c.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="bg-dark p-3 rounded-4 align-self-start border border-white border-opacity-10">
                <div className="dot-flashing"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-top border-white border-opacity-10 bg-dark bg-opacity-50">
            <div className="input-group">
              <input
                className="form-control bg-black border-secondary text-white rounded-pill-start py-2"
                placeholder="Type a message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button onClick={send} className="btn btn-gemini rounded-pill-end px-3">
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-gemini rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center"
        style={{ width: '60px', height: '60px' }}
      >
        {open ? <FiX size={28} /> : <FiMessageSquare size={28} />}
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        /* 3. Markdown Specific Formatting */
        .markdown-container p { margin-bottom: 8px; }
        .markdown-container ul, .markdown-container ol { padding-left: 20px; margin-bottom: 8px; }
        .markdown-container li { margin-bottom: 4px; }
        .markdown-container strong { color: #4b90ff; font-weight: 700; }
        .markdown-container h1, .markdown-container h2, .markdown-container h3 {
           font-size: 1rem;
           margin-top: 10px;
           color: #fff;
           border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .dot-flashing {
          position: relative; width: 6px; height: 6px; border-radius: 5px;
          background-color: #4b90ff; color: #4b90ff;
          animation: dot-flashing 1s infinite linear alternate;
          animation-delay: 0.5s;
        }
        @keyframes dot-flashing {
          0% { background-color: #4b90ff; }
          50%, 100% { background-color: rgba(75, 144, 255, 0.2); }
        }
      `}</style>
    </div>
  );
}