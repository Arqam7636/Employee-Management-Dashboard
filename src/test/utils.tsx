import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import rootReducer from '../store/rootReducer.ts'
import type { RootState } from '../store/store.ts'
import theme from '../theme/theme.ts'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
  route?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState = {}, route = '/', ...renderOptions }: CustomRenderOptions = {},
) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState,
  })

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </ReduxProvider>
    )
  }

  return { store, queryClient, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
