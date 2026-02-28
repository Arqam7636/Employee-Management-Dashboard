import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

interface TabNavProps {
  value: string
  onChange: (value: string) => void
}

const TAB_OPTIONS = [
  { value: 'active', label: 'Active' },
  // { value: 'dismissed', label: 'Dismissed' },
] as const

export default function TabNav({ value, onChange }: Readonly<TabNavProps>) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={value}
        onChange={(_e, newVal: string) => onChange(newVal)}
        textColor="primary"
        indicatorColor="primary"
      >
        {TAB_OPTIONS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
    </Box>
  )
}
