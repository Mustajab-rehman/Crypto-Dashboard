const BASE = 'https://api.coingecko.com/api/v3'

export const fetchMarkets = () =>
  fetch(`${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`)
    .then(r => r.json())

export const fetchGlobal = () =>
  fetch(`${BASE}/global`).then(r => r.json())

export const fetchCoin = (id) =>
  fetch(`${BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`)
    .then(r => r.json())

export const fetchChart = (id) =>
  fetch(`${BASE}/coins/${id}/market_chart?vs_currency=usd&days=7`)
    .then(r => r.json())
