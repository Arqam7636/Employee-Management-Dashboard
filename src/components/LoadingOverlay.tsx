import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export default function LoadingOverlay() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
      }}
    >
      <CircularProgress />
    </Box>
  )
}
