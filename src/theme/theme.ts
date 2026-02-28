import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  palette: {
    primary: {
      main: '#7C3AED',
      light: '#A78BFA',
      dark: '#5B21B6',
    },
    background: { default: '#f5f7fa' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minWidth: 'auto',
          padding: '8px 16px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
          '&:hover': {
            backgroundColor: 'rgba(124, 58, 237, 0.06)',
          },
        },
      },
    },
  },
})

export default theme
