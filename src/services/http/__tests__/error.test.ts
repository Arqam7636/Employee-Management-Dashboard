import { AxiosError, type AxiosResponse } from 'axios'
import { describe, it, expect } from 'vitest'

import { toApiError } from '../error.ts'

describe('toApiError', () => {
  it('extracts message from axios error response data', () => {
    const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
      data: { message: 'Email already exists' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: {} },
    } as AxiosResponse)

    const result = toApiError(axiosError)
    expect(result.message).toBe('Email already exists')
    expect(result.status).toBe(400)
  })

  it('extracts error field from response data', () => {
    const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
      data: { error: 'Not found' },
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: { headers: {} },
    } as AxiosResponse)

    const result = toApiError(axiosError)
    expect(result.message).toBe('Not found')
    expect(result.status).toBe(404)
  })

  it('falls back to axios error message for network errors', () => {
    const axiosError = new AxiosError('Network Error', 'ERR_NETWORK')
    const result = toApiError(axiosError)
    expect(result.message).toBe('Network Error')
    expect(result.status).toBeUndefined()
  })

  it('handles generic Error instances', () => {
    const result = toApiError(new Error('Something broke'))
    expect(result.message).toBe('Something broke')
  })

  it('returns fallback for unknown error types', () => {
    const result = toApiError('random string')
    expect(result.message).toBe('Something went wrong')
  })

  it('returns fallback for null', () => {
    const result = toApiError(null)
    expect(result.message).toBe('Something went wrong')
  })
})
