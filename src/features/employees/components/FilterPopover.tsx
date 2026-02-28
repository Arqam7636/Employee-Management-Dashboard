import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import InputAdornment from '@mui/material/InputAdornment'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks.ts'
import {
  selectUniquePositions,
  selectActiveFilterCount,
} from 'store/selectors/employees.selectors.ts'
import { uiActions } from 'store/slices/ui.slice.ts'

import type { EmploymentType } from '../employees.types.ts'

const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Intern']

interface FilterPopoverProps {
  anchorEl: HTMLElement | null
  onClose: () => void
}

export default function FilterPopover({ anchorEl, onClose }: FilterPopoverProps) {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.ui.filters)
  const uniquePositions = useAppSelector(selectUniquePositions)
  const activeFilterCount = useAppSelector(selectActiveFilterCount)

  const [positionSearch, setPositionSearch] = useState('')

  const filteredPositions = uniquePositions.filter((pos) =>
    pos.toLowerCase().includes(positionSearch.toLowerCase()),
  )

  const handleToggleEmploymentType = useCallback(
    (type: EmploymentType) => {
      const current = filters.employmentTypes
      const next = current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
      dispatch(uiActions.setEmploymentTypeFilter(next))
    },
    [dispatch, filters.employmentTypes],
  )

  const handleSalaryMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      dispatch(uiActions.setSalaryMinFilter(val === '' ? null : Number(val)))
    },
    [dispatch],
  )

  const handleSalaryMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      dispatch(uiActions.setSalaryMaxFilter(val === '' ? null : Number(val)))
    },
    [dispatch],
  )

  const handleStartDateFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(uiActions.setStartDateFromFilter(e.target.value || null))
    },
    [dispatch],
  )

  const handleStartDateToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(uiActions.setStartDateToFilter(e.target.value || null))
    },
    [dispatch],
  )

  const handleTogglePosition = useCallback(
    (pos: string) => {
      const current = filters.positions
      const next = current.includes(pos) ? current.filter((p) => p !== pos) : [...current, pos]
      dispatch(uiActions.setPositionsFilter(next))
    },
    [dispatch, filters.positions],
  )

  const handleClearAll = useCallback(() => {
    dispatch(uiActions.clearAllFilters())
    setPositionSearch('')
  }, [dispatch])

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { mt: 1 } } }}
    >
      <Box sx={{ width: 360, p: 2.5 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          <Button size="small" onClick={handleClearAll} disabled={activeFilterCount === 0}>
            Clear all
          </Button>
        </Box>

        <Divider />

        {/* Employment Type */}
        <Box sx={{ mt: 2, mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Employment Type
          </Typography>
          <FormGroup>
            {EMPLOYMENT_TYPES.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.employmentTypes.includes(type)}
                    onChange={() => handleToggleEmploymentType(type)}
                  />
                }
                label={type}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider />

        {/* Salary Range */}
        <Box sx={{ mt: 2, mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Salary Range
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <TextField
              size="small"
              type="number"
              label="Min"
              value={filters.salaryMin ?? ''}
              onChange={handleSalaryMinChange}
              sx={{ flex: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
            <TextField
              size="small"
              type="number"
              label="Max"
              value={filters.salaryMax ?? ''}
              onChange={handleSalaryMaxChange}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Start Date Range */}
        <Box sx={{ mt: 2, mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Start Date
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <TextField
              size="small"
              type="date"
              label="From"
              value={filters.startDateFrom ?? ''}
              onChange={handleStartDateFromChange}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ flex: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
            <TextField
              size="small"
              type="date"
              label="To"
              value={filters.startDateTo ?? ''}
              onChange={handleStartDateToChange}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Position */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Position
          </Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Search positions..."
            value={positionSearch}
            onChange={(e) => setPositionSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 1 }}
          />
          <FormGroup sx={{ maxHeight: 180, overflowY: 'auto' }}>
            {filteredPositions.map((pos) => (
              <FormControlLabel
                key={pos}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.positions.includes(pos)}
                    onChange={() => handleTogglePosition(pos)}
                  />
                }
                label={pos}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>
    </Popover>
  )
}
