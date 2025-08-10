# Chat Interface with Mood Detection

## Overview

This project implements a browser-based chat interface with integrated mood detection using a webcam. The application uses a React and Vite frontend, a Node.js and Express backend with Socket.IO for real-time communication, and the face-api.js library for facial expression recognition.

The project is designed to detect the user's mood in real-time while chatting and display the detected mood alongside the chat interface.

---

## Project Workflow

1. The frontend is served by Vite and loads the user interface for chat and mood detection.
2. The browser requests access to the user's webcam to capture video frames.
3. The face-api.js library loads pre-trained models for facial recognition and expression detection from a local folder.
4. The video stream is processed in real-time, and the detected mood is displayed in the interface.
5. Chat messages are sent and received using Socket.IO to maintain a real-time connection with the backend.
6. The backend handles message broadcasting, timestamps, and optionally integrates with external APIs for responses.

---

## Features

- Real-time chat using WebSockets.
- Mood detection using face-api.js.
- Automatic loading of multiple facial recognition models.
- Responsive layout for desktop and mobile use.

---

## Prerequisites

- Node.js (version 16 or later recommended)
- npm (Node Package Manager)
- A working webcam
- Internet browser with WebRTC and camera permission support

---
