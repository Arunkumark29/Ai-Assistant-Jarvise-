import React, { useState, useRef } from 'react';
import './Home.css';
import helmetImg from "../assets/Logo.jpg";
import ListeningPanel from './ListeningPanel';

function Home() {
  const [listening, setListening] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatOutput, setChatOutput] = useState('');
  const chatOutputRef = useRef(null);

  const handleMicClick = () => {
    setListening(true);
    setTimeout(() => setListening(false), 10000);
  };

 const handleSendClick = () => {
    if (!inputMessage.trim()) return;

    setChatOutput(''); // Clear previous output

    // ✅ helper function to clean Gemini text
    const cleanGeminiText = (text) => {
  return text
    // Remove unwanted brackets, quotes
    .replace(/[\[\]{},"]/g, "")
    // Convert \n to real newlines
    .replace(/\\n/g, "\n")
    // Fix words split with spaces inside (b o i l e d -> boiled)
    .replace(/\b(\w)(\s+)(?=\w\b)/g, "$1") 
    // Add space between lowercase->Uppercase (ChickenDum -> Chicken Dum)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // Add spacing around numbers and units (1 . 5 -> 1.5, 2kg -> 2 kg)
    .replace(/(\d+)\s*\.\s*(\d+)/g, "$1.$2")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    // Numbered lists formatting
    .replace(/(\d+)\.\s*/g, "\n$1. ")
    // Bullet points formatting
    .replace(/-\s*/g, "\n- ")
    // Remove stray markdown symbols
    .replace(/[\\*`_]/g, "")
    // Collapse multiple spaces
    .replace(/\s{2,}/g, " ")
    .trim();
};

    // Open SSE connection using query param
    const eventSource = new EventSource(
      `http://localhost:5000/api/gemini/stream?text=${encodeURIComponent(inputMessage)}`
    );

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        eventSource.close();
        return;
      }

      try {
        const parsed = JSON.parse(event.data);
        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          const cleanText = cleanGeminiText(text); // ✅ use cleaner
          setChatOutput((prev) => prev + cleanText + " ");
        }
      } catch {
        const cleanText = cleanGeminiText(event.data); // ✅ use cleaner
        setChatOutput((prev) => prev + cleanText + " ");
      }

      if (chatOutputRef.current) {
        chatOutputRef.current.scrollTop = chatOutputRef.current.scrollHeight;
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      eventSource.close();
    };

    setInputMessage(''); // Clear input box
  };
  return (
    <main className="jarvis-layout">
      <div className="left-panel">
        <div className="helmet-holo">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <img src={helmetImg} alt="Iron Man Helmet" />
        </div>
      </div>

      <div className="right-panel">
        {/* Chat output panel */}
        <div className="chat-output" ref={chatOutputRef}>
              {chatOutput
                ? chatOutput.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                : (
                  <div className="command-box">
                    <h2>Welcome, Commander</h2>
                    <p>I'm online and ready for your command.</p>
                  </div>
                )}
        </div>

        <button className="speak-btn" onClick={handleMicClick}>🎤 Speak</button>

        {/* Listening Panel Component */}
        <ListeningPanel isVisible={listening} />

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type your message..."
            className="chat-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendClick()}
          />
          <button className="send-btn" onClick={handleSendClick}>➤</button>
        </div>
      </div>
    </main>
  );
}

export default Home;
