import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PeopleIcon from '@mui/icons-material/People'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from 'store/hooks.ts'
import { uiActions } from 'store/slices/ui.slice.ts'

import { mainNavItems, bottomNavItems } from './sidebarNav.ts'

export const SIDEBAR_WIDTH = 260
export const SIDEBAR_COLLAPSED_WIDTH = 72

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: Readonly<SidebarProps>) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  const handleNavClick = useCallback(
    (path: string) => {
      if (path === '#') {
        dispatch(uiActions.showSnackbar({ message: 'Coming soon!', severity: 'info' }))
        return
      }
      navigate(path)
    },
    [navigate, dispatch],
  )

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo and name area */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: collapsed ? 1.5 : 2.5,
          py: 2.5,
          minHeight: 64,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <PeopleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, whiteSpace: 'nowrap', color: 'text.primary' }}
          >
            EMD
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Main/middle navigation */}
      <List sx={{ px: 1.5, py: 1, flex: 1 }}>
        {mainNavItems.map((item) => {
          const isActive = item.path !== '#' && location.pathname === item.path
          return (
            <ListItemButton
              key={item.label}
              onClick={() => handleNavClick(item.path)}
              sx={{
                minHeight: 44,
                px: 1.5,
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderLeft: isActive ? '3px solid' : '3px solid transparent',
                borderLeftColor: isActive ? 'primary.main' : 'transparent',
                bgcolor: isActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                color: isActive ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  bgcolor: isActive ? 'rgba(124, 58, 237, 0.12)' : 'rgba(124, 58, 237, 0.06)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  justifyContent: 'center',
                  color: isActive ? 'primary.main' : 'text.secondary',
                }}
              >
                <item.icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              )}
            </ListItemButton>
          )
        })}
      </List>

      <Divider />

      {/* Bottom navigation */}
      <List sx={{ px: 1.5, py: 1 }}>
        {bottomNavItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => handleNavClick(item.path)}
            sx={{
              minHeight: 44,
              px: 1.5,
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'text.secondary',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 40,
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <item.icon fontSize="small" />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 1, display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
        <IconButton size="small" onClick={onToggle}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Drawer>
  )
}
