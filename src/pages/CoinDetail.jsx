import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchCoin, fetchChart } from '../api'

const fmtUSD = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6 }).format(n)

const fmtB = (n) => `$${(n / 1e9).toFixed(2)}B`

export default function CoinDetail() {
  const { id } = useParams()
  const [coin, setCoin] = useState(null)
  const [chart, setChart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchCoin(id), fetchChart(id)])
      .then(([coinData, chartData]) => {
        setCoin(coinData)
        setChart(
          chartData.prices.map(([ts, price]) => ({
            date: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price,
          }))
        )
      })
      .catch(() => setError('Failed to load coin data.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (error) return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center text-danger text-sm">{error}</div>
  )

  const md = coin.market_data
  const change24h = md.price_change_percentage_24h
  const change7d = md.price_change_percentage_7d
  const up = change24h >= 0

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">

      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors mb-6">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Markets
      </Link>

      {/* Coin header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <img src={coin.image.large} alt={coin.name} className="w-16 h-16 rounded-full" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-3xl font-semibold">{coin.name}</h1>
            <span className="text-white/40 text-sm font-mono uppercase tracking-wide">{coin.symbol}</span>
            <span className="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full">
              Rank #{coin.market_cap_rank}
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold font-mono tabular-nums">
              {fmtUSD(md.current_price.usd)}
            </span>
            <span className={`text-sm font-mono ${up ? 'text-success' : 'text-danger'}`}>
              {up ? '+' : ''}{change24h?.toFixed(2)}% (24h)
            </span>
            <span className={`text-sm font-mono ${change7d >= 0 ? 'text-success' : 'text-danger'}`}>
              {change7d >= 0 ? '+' : ''}{change7d?.toFixed(2)}% (7d)
            </span>
          </div>
        </div>
      </div>

      {/* Price chart */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 mb-6">
        <p className="text-white/30 text-xs uppercase tracking-wider mb-5">Price Chart — 7 Days</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chart} margin={{ top: 0, right: 8, bottom: 0, left: 8 }}>
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
              width={72}
            />
            <Tooltip
              contentStyle={{
                background: '#111113',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}
              formatter={(v) => [fmtUSD(v), 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0C5CAB"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#0C5CAB', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Market Cap" value={fmtB(md.market_cap.usd)} />
        <Stat label="24h Volume" value={fmtB(md.total_volume.usd)} />
        <Stat label="Circulating Supply" value={`${(md.circulating_supply / 1e6).toFixed(2)}M`} />
        <Stat label="All-Time High" value={fmtUSD(md.ath.usd)} />
      </div>

      {/* Description */}
      {coin.description?.en && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-3">About</p>
          <p
            className="text-sm text-white/60 leading-relaxed line-clamp-4"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </div>
      )}
    </main>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-white/30 text-xs uppercase tracking-wider mb-1.5">{label}</p>
      <p className="font-semibold text-sm tabular-nums">{value}</p>
    </div>
  )
}

function Loader() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-24 rounded bg-white/5" />
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5" />
          <div className="flex-1 space-y-2">
            <div className="h-8 w-48 rounded bg-white/5" />
            <div className="h-5 w-32 rounded bg-white/5" />
          </div>
        </div>
        <div className="h-72 rounded-xl bg-white/5" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-20 rounded-xl bg-white/5" />)}
        </div>
      </div>
    </div>
  )
}
