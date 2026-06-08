import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-surface/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-sm font-bold select-none">₿</div>
        <span className="text-lg font-semibold tracking-tight">CryptoDash</span>
      </Link>
      <span className="text-xs text-white/30">Powered by CoinGecko</span>
    </header>
  )
}
