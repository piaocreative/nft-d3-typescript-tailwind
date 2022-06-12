import axios from 'axios'

const axiosInstance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJndWVzdCIsImtleV9uYW1lIjoiaXZhbiIsImV4cCI6MTY0NTY4NzYzMy4zNDcwNzN9.k1lfcAyTUBuKp-WdjZoWQuxJpmX7Bdr3QBsTH6cCJMY',
  },
  baseURL: process.env.REACT_APP_ESG_API_URL,
})

export function httpRequest() {
  return axiosInstance
}
