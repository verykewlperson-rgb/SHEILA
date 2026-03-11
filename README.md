# Hindi Language Learning App

An interactive Hindi language learning application with AI-powered speech recognition and comprehensive learning features.

## 🚀 Features

### 1. Hindi Live Speaker
- **Real-time conversation module** where users speak into the mic
- **AI listens, transcribes speech** and provides immediate feedback
- **Continuous back-to-back conversation** using AI
- **Instant feedback** on pronunciation, grammar, and fluency
- **Conversation history** tracking

### 2. Solving Mistakes
- **Reflection area** that logs mistakes made during speaking sessions
- **AI highlights common errors** (tense, word order, pronunciation)
- **Practice corrected versions** through short exercises
- **Repeat-after-me prompts** for improvement
- **Progress tracking** and difficulty levels

### 3. Dueling Friends
- **Competitive speaking feature** where users challenge friends or other learners
- **Turn-based battles** with the same Hindi prompt
- **AI scores accuracy and fluency** to determine winner
- **Ranking system**: Bronze → Silver → Gold → Diamond → Champion
- **Points system** with win/loss tracking
- **Confetti celebration** for rank-ups

### 4. Hear & Type
- **Listening practice tool** with randomly generated Hindi short phrases
- **Users type what they hear** in Hindi or Hinglish
- **Trains ear for authentic pronunciation**
- **Multiple difficulty levels** (Easy, Medium, Hard)
- **Accuracy scoring** and progress tracking

### 5. Pronouncer
- **Pronunciation-focused widget** for individual words
- **Users say words out loud** and receive targeted feedback
- **Comparison with ideal native pronunciation**
- **Detailed pronunciation tips** and phonetic guides
- **Grading system** (A+, A, B, C, D)

### 6. User Profile
- **Comprehensive progress tracking**
- **Achievement system** with badges and milestones
- **Rank progression** visualization
- **Learning statistics** and analytics
- **Recent activity feed**

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom animations
- **Speech Recognition**: Web Speech API
- **Speech Synthesis**: Web Speech Synthesis API
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Confetti**: React Confetti

## 🧩 Project Layout

- `backend/` – Flask API wired to Google Gemini (2.5 Flash-Lite), the optional proxy, PowerShell helpers, `.env`, and all Python tests that exercise `/api/*` routes.
- `src/`, `public/`, and the Tailwind/PostCSS configs – React UI built with `react-scripts`.
- `test_frontend.html` – lightweight client for manual POSTs to `/api/analyze-hindi` once the backend is active.

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hindi-language-learning-app
   ```

### Backend (Flask API)
2. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
   - Create or update `backend/.env` with `GEMINI_API_KEY=your-gemini-api-key` and store a real key there before starting the Python server; the Flask API loads this via `python-dotenv` so it works without manual exports.
   - The Flask API talks to Google Gemini 2.5 Flash-Lite (Generative AI API), so confirm the key has access to that product.
   - Use `backend/setup_api_key.ps1` or `backend/setup_env.ps1` on Windows to configure the environment variable before running the server.

3. **Start the backend**
   ```bash
   python ai_api.py
   ```
   - Or, run `backend/start_backend.ps1` to inject a temporary key and hit a sanity `curl` against `/api/check-answer`.
   - Optional: fire up `node gemini-proxy.js` if you need the Node-based proxy instead of calling the Flask endpoints directly.
   - Once the backend is running, execute any of the Python smoke tests such as `python test_api.py`, `python test_backend.py`, or `python test_endpoints.py` from the `backend/` directory.

### Frontend (React UI)
4. **Install frontend dependencies and launch**
   ```bash
   cd ../
   npm install
   npm start
   ```
   - The Create React App dev server lives at `http://localhost:3000` and proxies `/api` calls to `http://localhost:5001` so both the frontend and backend work in concert.
   - Once the browser opens, pick a feature (Live Speaker, Hear & Type, Pronouncer, etc.) and allow microphone permissions for the speech tools.
## 🎯 Usage

### Getting Started
1. **Navigate through features** using the top navigation bar
2. **Start with Hindi Live Speaker** for basic conversation practice
3. **Use Solving Mistakes** to review and improve common errors
4. **Challenge friends** in Dueling Friends for competitive practice
5. **Train your ear** with Hear & Type exercises
6. **Perfect pronunciation** with the Pronouncer tool
7. **Track progress** in your User Profile

### Speech Recognition Setup
- **Enable microphone permissions** when prompted
- **Use Chrome or Edge** for best speech recognition support
- **Speak clearly** in Hindi for better accuracy
- **Practice in a quiet environment** for optimal results

## 🏆 Ranking System

| Rank | Points Required | Icon | Description |
|------|----------------|------|-------------|
| Bronze | 0-1,499 | 🥉 | Beginner level |
| Silver | 1,500-1,999 | 🥈 | Intermediate level |
| Gold | 2,000-2,499 | 🥇 | Advanced level |
| Diamond | 2,500-2,999 | 💎 | Expert level |
| Champion | 3,000+ | 👑 | Master level |

## 🎨 UI/UX Features

- **Responsive design** that works on desktop and mobile
- **Beautiful gradient backgrounds** with modern card layouts
- **Smooth animations** and transitions using Framer Motion
- **Intuitive navigation** with clear visual hierarchy
- **Real-time feedback** with toast notifications
- **Progress indicators** and loading states
- **Accessible design** with proper contrast and focus states

## 🔧 Customization

### Adding New Words/Phrases
Edit the word lists in each component:
- `HearAndType.js` - Add new phrases for listening practice
- `Pronouncer.js` - Add new words with pronunciation details
- `SolvingMistakes.js` - Add common mistakes and corrections

### Modifying Difficulty Levels
Adjust difficulty thresholds in:
- `DuelingFriends.js` - Rank point requirements
- `HearAndType.js` - Phrase complexity
- `Pronouncer.js` - Word difficulty categories

### Styling Customization
- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Animations**: Adjust animation parameters in `src/index.css`
- **Layouts**: Customize card layouts and grid systems

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

## 🔮 Future Enhancements

- **Backend integration** for user accounts and data persistence
- **Advanced AI models** for more accurate speech recognition
- **Social features** for connecting with other learners
- **Gamification elements** like daily challenges and leaderboards
- **Offline support** for practice without internet
- **Voice chat** for real-time conversations with AI
- **Custom learning paths** based on user progress
- **Integration with external Hindi learning resources**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Web Speech API** for speech recognition and synthesis
- **Tailwind CSS** for the beautiful styling framework
- **Framer Motion** for smooth animations
- **Lucide React** for the icon library
- **Hindi language community** for inspiration and feedback

## 📞 Support

For support, email support@hindilearningapp.com or create an issue in the repository.

---

**Happy Learning! 🎉** 
