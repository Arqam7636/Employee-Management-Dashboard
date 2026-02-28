import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { EmploymentType } from 'features/employees/employees.types.ts'

interface SnackbarState {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
}

export type ActiveTab = 'active' | 'onboarding' | 'off-boarding' | 'dismissed'

export interface FilterState {
  employmentTypes: EmploymentType[]
  salaryMin: number | null
  salaryMax: number | null
  startDateFrom: string | null
  startDateTo: string | null
  positions: string[]
}

export const initialFilters: FilterState = {
  employmentTypes: [],
  salaryMin: null,
  salaryMax: null,
  startDateFrom: null,
  startDateTo: null,
  positions: [],
}

interface UiState {
  searchQuery: string
  isFormOpen: boolean
  formMode: 'create' | 'edit'
  selectedEmployeeId: string | null
  confirmDeleteId: string | null
  flashRowId: string | null
  snackbar: SnackbarState
  sidebarCollapsed: boolean
  activeTab: ActiveTab
  filters: FilterState
}

const initialState: UiState = {
  searchQuery: '',
  isFormOpen: false,
  formMode: 'create',
  selectedEmployeeId: null,
  confirmDeleteId: null,
  flashRowId: null,
  snackbar: { open: false, message: '', severity: 'info' },
  sidebarCollapsed: false,
  activeTab: 'active',
  filters: initialFilters,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    openCreateForm(state) {
      state.isFormOpen = true
      state.formMode = 'create'
      state.selectedEmployeeId = null
    },
    openEditForm(state, action: PayloadAction<string>) {
      state.isFormOpen = true
      state.formMode = 'edit'
      state.selectedEmployeeId = action.payload
    },
    closeForm(state) {
      state.isFormOpen = false
      state.selectedEmployeeId = null
    },
    openDeleteConfirm(state, action: PayloadAction<string>) {
      state.confirmDeleteId = action.payload
    },
    closeDeleteConfirm(state) {
      state.confirmDeleteId = null
    },
    setFlashRowId(state, action: PayloadAction<string | null>) {
      state.flashRowId = action.payload
    },
    showSnackbar(
      state,
      action: PayloadAction<{
        message: string
        severity: SnackbarState['severity']
      }>,
    ) {
      state.snackbar = { open: true, ...action.payload }
    },
    hideSnackbar(state) {
      state.snackbar.open = false
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setActiveTab(state, action: PayloadAction<ActiveTab>) {
      state.activeTab = action.payload
    },
    setEmploymentTypeFilter(state, action: PayloadAction<EmploymentType[]>) {
      state.filters.employmentTypes = action.payload
    },
    setSalaryMinFilter(state, action: PayloadAction<number | null>) {
      state.filters.salaryMin = action.payload
    },
    setSalaryMaxFilter(state, action: PayloadAction<number | null>) {
      state.filters.salaryMax = action.payload
    },
    setStartDateFromFilter(state, action: PayloadAction<string | null>) {
      state.filters.startDateFrom = action.payload
    },
    setStartDateToFilter(state, action: PayloadAction<string | null>) {
      state.filters.startDateTo = action.payload
    },
    setPositionsFilter(state, action: PayloadAction<string[]>) {
      state.filters.positions = action.payload
    },
    clearAllFilters(state) {
      state.filters = initialFilters
    },
  },
})

export const uiActions = uiSlice.actions
export default uiSlice.reducer
