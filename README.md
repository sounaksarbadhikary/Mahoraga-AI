# MAHORAGA AI - Web Chat Application

A beautiful, responsive web-based AI chat application powered by Llama 3 via the Groq API. This project is designed with a sleek UI, light/dark mode support, and features a "Bring Your Own Key" (BYOK) architecture to keep users' API keys 100% secure and stored locally.

## Features
- **Modern UI/UX:** Clean, responsive design that works on desktop and mobile devices.
- **Light & Dark Mode:** Toggle between themes seamlessly.
- **Local Key Storage:** API keys are stored only in your browser's `localStorage`. No backend server is used, meaning your keys are never shared or compromised.
- **Fast Responses:** Powered by the Groq API, offering incredibly fast generation speeds.

## How to Set Up and Use

Because this application relies on the Groq API for the AI responses, every user needs to provide their own free API key to use the chat.

### Steps to get your Groq API Key:

1. **Visit Groq Cloud:** Go to the [Groq Console](https://console.groq.com/).
2. **Sign Up / Log In:** Create a free account or log in with your existing credentials.
3. **Navigate to API Keys:** On the left-hand sidebar, click on the **"API Keys"** section.
4. **Create a Key:** Click the **"Create API Key"** button. Give it a name (e.g., "Mahoraga Chat App") and click create.
5. **Copy the Key:** Copy the generated key. *Note: It should start with `gsk_`.*

### Using the App:

1. Open the published webpage for this project (or run `index.html` locally).
2. Click the **Settings (Gear Icon)** in the top right corner of the webpage.
3. Paste your Groq API key into the input field.
4. Click **"Save Configuration"**.
5. You're ready to chat! Type a message at the bottom to talk to MAHORAGA AI.

## Security & Privacy Note
If you upload this repository or publish the website, **do not hardcode your API key** into the code files (`script.js` or `index.html`). 

The application is built so that anyone who visits your site will be prompted to enter their *own* API key, meaning you will not be charged for their usage and your personal key stays safe.

---
*Created as a personal web development and AI integration project.*
