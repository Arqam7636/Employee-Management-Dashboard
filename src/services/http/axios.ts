import axiosLib, { type AxiosResponse } from 'axios'

import { toApiError } from './error.ts'

const http = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.response.use(
  (response: AxiosResponse) => response.data as AxiosResponse,
  (error: unknown) => Promise.reject(toApiError(error)),
)

export default http
