import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import CoinDetail from './pages/CoinDetail'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface text-[#fafafa] font-sans">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/coin/:id" element={<CoinDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
