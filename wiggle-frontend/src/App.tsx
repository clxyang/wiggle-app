import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import VideoPage from './pages/VideoPage'
import HomePage from './pages/HomePage'
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:rehearsalName/*" element={<VideoPage />} />
      </Routes>
    </Router>
  )
}

export default App
