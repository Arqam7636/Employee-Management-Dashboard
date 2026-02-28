import axios from 'axios'

export interface ApiError {
  message: string
  status?: number
  details?: unknown
}

export function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined
    const message =
      (typeof data?.message === 'string' && data.message) ||
      (typeof data?.error === 'string' && data.error) ||
      err.message ||
      'Something went wrong'
    return {
      message,
      status: err.response?.status,
      details: data,
    }
  }

  if (err instanceof Error) {
    return { message: err.message }
  }

  return { message: 'Something went wrong' }
}
