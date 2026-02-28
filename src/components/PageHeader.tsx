import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function PageHeader({ title, subtitle, action }: Readonly<PageHeaderProps>) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  )
}
