import axios from 'axios'

export const goodsData = params => {
  const url = `/api/goods`
  return axios.get(url, params)
}

export const sellerData = params => {
  const url = `/api/seller`
  return axios.get(url, params)
}
