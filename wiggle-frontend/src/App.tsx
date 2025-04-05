import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import VideoPage from './pages/VideoPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoPage />} />
      </Routes>
    </Router>
  )
}

export default App
