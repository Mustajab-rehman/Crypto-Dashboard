import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchMarkets, fetchGlobal } from '../api'

const fmtUSD = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

const fmtB = (n) => `$${(n / 1e9).toFixed(2)}B`

export default function Dashboard() {
  const [coins, setCoins] = useState([])
  const [global, setGlobal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchMarkets(), fetchGlobal()])
      .then(([markets, g]) => {
        setCoins(markets)
        setGlobal(g.data)
      })
      .catch(() => setError('Failed to load data. Rate limit may have been hit — try again in a minute.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error) return <ErrorMsg msg={error} />

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">

      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Market Overview</h2>
        <p className="text-white/40 text-sm mt-0.5">Top 20 cryptocurrencies by market cap</p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Market Cap" value={fmtB(global.total_market_cap.usd)} />
        <StatCard label="24h Volume" value={fmtB(global.total_volume.usd)} />
        <StatCard
          label="BTC Dominance"
          value={`${global.market_cap_percentage.btc.toFixed(1)}%`}
          accent
        />
      </div>

      {/* Coins table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/30 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left w-10">#</th>
                <th className="px-5 py-3 text-left">Coin</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">24h Change</th>
                <th className="px-5 py-3 text-right hidden sm:table-cell">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, i) => {
                const up = coin.price_change_percentage_24h >= 0
                return (
                  <tr key={coin.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 text-white/30 text-xs">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <Link to={`/coin/${coin.id}`} className="flex items-center gap-3 group">
                        <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                        <div>
                          <span className="font-medium group-hover:text-primary transition-colors">{coin.name}</span>
                          <span className="ml-2 text-white/30 text-xs">{coin.symbol.toUpperCase()}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-[13px]">
                      {fmtUSD(coin.current_price)}
                    </td>
                    <td className={`px-5 py-3.5 text-right font-mono text-[13px] ${up ? 'text-success' : 'text-danger'}`}>
                      {up ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3.5 text-right text-white/40 text-[13px] hidden sm:table-cell">
                      {fmtB(coin.market_cap)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? 'border-primary/30 bg-primary/10' : 'border-white/10 bg-white/[0.03]'}`}>
      <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function Loader() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(n => <div key={n} className="h-24 rounded-xl bg-white/5" />)}
        </div>
        <div className="h-96 rounded-xl bg-white/5" />
      </div>
    </div>
  )
}

function ErrorMsg({ msg }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-center">
      <p className="text-danger text-sm">{msg}</p>
    </div>
  )
}
