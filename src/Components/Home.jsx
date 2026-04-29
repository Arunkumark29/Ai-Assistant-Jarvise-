import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import helmetImg from '../assets/Logo.jpg';
import ListeningPanel from './ListeningPanel';

function Home() {
  const [listening, setListening] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Welcome, Commander.\nI'm online and ready for your command." }
  ]);
  const [error, setError] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);

  const recognitionRef = useRef(null);
  const eventSourceRef = useRef(null);
  const latestAssistantTextRef = useRef('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0]?.transcript;
      if (transcript) {
        setInputMessage(transcript);
        handleSendClick(transcript, { autoSend: true });
      }
    };

    recognition.onerror = (event) => {
      setError(`Voice recognition error: ${event.error || 'Unknown error'}`);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatMessages, listening]);

  const cleanGeminiText = (text) => {
    return text
      .replace(/[\[\]{},"]/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\b(\w)(\s+)(?=\w\b)/g, '$1')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/(\d+)\s*\.\s*(\d+)/g, '$1.$2')
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/(\d)([a-zA-Z])/g, '$1 $2')
      .replace(/(\d+)\.\s*/g, '\n$1. ')
      .replace(/-\s*/g, '\n- ')
      .replace(/[\\*`_]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  const closeEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.volume = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const appendAssistantText = (text) => {
    latestAssistantTextRef.current += text;
    setChatMessages((prev) => {
      if (!prev.length || prev[prev.length - 1].role !== 'assistant') {
        return [...prev, { role: 'assistant', text }];
      }

      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        text: updated[updated.length - 1].text + text
      };
      return updated;
    });
  };

  const handleSendClick = (messageOverride = null) => {
    const message = (messageOverride ?? inputMessage).trim();
    if (!message) return;

    setError('');
    setInputMessage('');
    closeEventSource();
    latestAssistantTextRef.current = '';

    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: message },
      { role: 'assistant', text: '' }
    ]);

    const eventSource = new EventSource(
      `http://localhost:5000/api/gemini/stream?text=${encodeURIComponent(message)}`
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        speakText(latestAssistantTextRef.current);
        closeEventSource();
        return;
      }

      try {
        const parsed = JSON.parse(event.data);
        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || event.data;
        const cleanText = cleanGeminiText(text);
        appendAssistantText(cleanText + ' ');
      } catch {
        const cleanText = cleanGeminiText(event.data);
        appendAssistantText(cleanText + ' ');
      }
    };

    eventSource.onerror = () => {
      setError('Unable to connect to the AI server. Please make sure the backend is running.');
      closeEventSource();
    };
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      setError('Voice recognition is not supported in this browser.');
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    setError('');
    setListening(true);

    try {
      recognitionRef.current.start();
    } catch (err) {
      setError(err.message || 'Unable to start voice recognition.');
      setListening(false);
    }
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
        <div className="chat-output">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-label">
                {msg.role === 'user' ? 'YOU' : 'JARVIS'}
              </div>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="controls-row">
          <button className={`speak-btn ${listening ? 'listening' : ''}`} onClick={handleMicClick}>
            {listening ? '⏹ Stop' : '🎤 Speak'}
          </button>
          {!voiceSupported && (
            <span className="voice-warning">Voice not supported in this browser.</span>
          )}
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type your message..."
            className="chat-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendClick()}
          />
          <button className="send-btn" onClick={() => handleSendClick()}>
            ➤
          </button>
        </div>
      </div>
    </main>
  );
}

export default Home;
