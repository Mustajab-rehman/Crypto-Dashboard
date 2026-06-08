const BASE = 'https://api.coingecko.com/api/v3'
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY

const headers = API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {}

const get = (url) => fetch(url, { headers }).then(r => r.json())

export const fetchMarkets = () =>
  get(`${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`)

export const fetchGlobal = () =>
  get(`${BASE}/global`)

export const fetchCoin = (id) =>
  get(`${BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`)

export const fetchChart = (id) =>
  get(`${BASE}/coins/${id}/market_chart?vs_currency=usd&days=7`)
