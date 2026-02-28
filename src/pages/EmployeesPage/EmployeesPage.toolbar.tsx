import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import FilterPopover from 'features/employees/components/FilterPopover.tsx'
import { useState, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks.ts'
import { selectActiveFilterCount } from 'store/selectors/employees.selectors.ts'
import { uiActions } from 'store/slices/ui.slice.ts'
import { debounce } from 'utils/debounce.ts'

export default function EmployeesToolbar() {
  const dispatch = useAppDispatch()
  const [localSearch, setLocalSearch] = useState('')
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null)
  const activeFilterCount = useAppSelector(selectActiveFilterCount)

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => dispatch(uiActions.setSearchQuery(value)), 300),
    [dispatch],
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalSearch(value)
      debouncedSetSearch(value)
    },
    [debouncedSetSearch],
  )

  const handleFilterClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(e.currentTarget)
  }, [])

  const handleFilterClose = useCallback(() => {
    setFilterAnchorEl(null)
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
      }}
    >
      <TextField
        size="small"
        placeholder="Search"
        value={localSearch}
        onChange={handleSearchChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: 240 }}
      />
      <Badge badgeContent={activeFilterCount} color="primary" invisible={activeFilterCount === 0}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          sx={{
            color: 'text.secondary',
            borderColor: 'divider',
            textTransform: 'none',
            fontWeight: 400,
            '&:hover': { borderColor: 'text.secondary' },
          }}
        >
          Filters
        </Button>
      </Badge>
      <FilterPopover anchorEl={filterAnchorEl} onClose={handleFilterClose} />
    </Box>
  )
}
