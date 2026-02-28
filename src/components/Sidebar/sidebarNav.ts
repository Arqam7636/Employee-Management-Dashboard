import type { SvgIconComponent } from '@mui/icons-material'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'

export interface NavItem {
  label: string
  icon: SvgIconComponent
  path: string
}

export const mainNavItems: NavItem[] = [
  { label: 'Employees', icon: PeopleOutlinedIcon, path: '/' },
  { label: 'Payslip', icon: ReceiptLongOutlinedIcon, path: '#' },
]

export const bottomNavItems: NavItem[] = [
  // { label: 'Setting', icon: SettingsOutlinedIcon, path: '#' },
]
