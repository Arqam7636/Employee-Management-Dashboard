import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import { useCallback } from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from '../components/Sidebar/Sidebar.tsx'
import { useAppSelector, useAppDispatch } from '../store/hooks.ts'
import { uiActions } from '../store/slices/ui.slice.ts'

export default function AppShell() {
  const dispatch = useAppDispatch()
  const snackbar = useAppSelector((s) => s.ui.snackbar)
  const sidebarCollapsed = useAppSelector((s) => s.ui.sidebarCollapsed)

  const handleSnackbarClose = useCallback(() => {
    dispatch(uiActions.hideSnackbar())
  }, [dispatch])

  const handleSidebarToggle = useCallback(() => {
    dispatch(uiActions.toggleSidebar())
  }, [dispatch])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <Box sx={{ px: 4, py: 3, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
