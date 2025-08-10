import { useState, useEffect, useRef } from 'react'
import { io } from "socket.io-client";
import * as faceapi from 'face-api.js';
import './App.css'

function App() {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [mood, setMood] = useState('')
  const videoRef = useRef()

  // Load models and start camera
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
      await faceapi.nets.faceExpressionNet.loadFromUri('/models')
      startVideo()
    }
    loadModels()
  }, [])

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
    } catch (err) {
      console.error("Camera access denied:", err)
    }
  }

  // Detect mood
  useEffect(() => {
    const detectMood = async () => {
      if (!videoRef.current) return
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()

      if (detections.length > 0) {
        const expressions = detections[0].expressions
        const detectedMood = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b)
        setMood(detectedMood)
      }
    }

    const interval = setInterval(detectMood, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (inputText.trim() === '') return

    const userMessage = {
      id: Date.now(),
      text: `${inputText} (Mood: ${mood})`,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user'
    }

    setMessages(prevMessages => [...prevMessages, userMessage])
    socket.emit('ai-message', `${inputText} (Mood: ${mood})`)
    setInputText('')
  }

  useEffect(() => {
    let socketInstance = io("http://localhost:3000"); 
    setSocket(socketInstance)

    socketInstance.on('ai-message-response', (response) => {
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'bot'
      }
      setMessages(prevMessages => [...prevMessages, botMessage])
    })
  }, [])

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Interface</h1>
        <p>Detected Mood: {mood || "Detecting..."}</p>
      </div>

      <video ref={videoRef} autoPlay muted width="300" style={{ borderRadius: "10px" }} />

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Start a conversation...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
              <div className="message-content">
                <span className="message-text">{message.text}</span>
                <span className="message-timestamp">{message.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="input-field"
        />
        <button 
          onClick={handleSendMessage}
          className="send-button"
          disabled={inputText.trim() === ''}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App
