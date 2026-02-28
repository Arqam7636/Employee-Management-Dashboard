import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { store } from '../store/store.ts'
import theme from '../theme/theme.ts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}
