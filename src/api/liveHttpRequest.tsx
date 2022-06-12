import axios from 'axios'

const axiosInstance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJndWVzdCIsImtleV9uYW1lIjoidGVzdCIsImV4cCI6MTY0OTU5MDE3Ni4zNDQxMDd9.lODjOPMZNdvH3QLHzriflLi0hQt39s4KjHd9LwIeuvg',
  },
  baseURL: process.env.REACT_APP_LIVE_ESG_API_URL,
})

export function liveHttpRequest() {
  return axiosInstance
}
