import { createSelector } from '@reduxjs/toolkit'

import { employeesAdapterSelectors } from '../slices/employees.slice.ts'
import type { RootState } from '../store.ts'

const selectEmployeesState = (state: RootState) => state.employees
const selectSearchQuery = (state: RootState) => state.ui.searchQuery
const selectFilters = (state: RootState) => state.ui.filters

export const selectAllEmployees = createSelector([selectEmployeesState], (employeesState) =>
  employeesAdapterSelectors.selectAll(employeesState),
)

export const selectFilteredEmployees = createSelector(
  [selectAllEmployees, selectSearchQuery, selectFilters],
  (employees, query, filters) => {
    let result = employees

    // 1. Text search filter
    if (query.trim()) {
      const lower = query.toLowerCase()
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.email.toLowerCase().includes(lower) ||
          e.position.toLowerCase().includes(lower),
      )
    }

    // 2. Employment type filter
    if (filters.employmentTypes.length > 0) {
      result = result.filter((e) => filters.employmentTypes.includes(e.employmentType))
    }

    // 3. Salary range filter
    if (filters.salaryMin !== null) {
      result = result.filter((e) => e.salary >= filters.salaryMin!)
    }
    if (filters.salaryMax !== null) {
      result = result.filter((e) => e.salary <= filters.salaryMax!)
    }

    // 4. Start date range filter
    if (filters.startDateFrom !== null) {
      result = result.filter((e) => e.startDate >= filters.startDateFrom!)
    }
    if (filters.startDateTo !== null) {
      result = result.filter((e) => e.startDate <= filters.startDateTo!)
    }

    // 5. Position filter
    if (filters.positions.length > 0) {
      result = result.filter((e) => filters.positions.includes(e.position))
    }

    return result
  },
)

export const selectEmployeeById = (id: string | null) =>
  createSelector([selectEmployeesState], (employeesState) =>
    id ? employeesAdapterSelectors.selectById(employeesState, id) : undefined,
  )

export const selectUniquePositions = createSelector([selectAllEmployees], (employees) => {
  const positionSet = new Set(employees.map((e) => e.position))
  return Array.from(positionSet).sort()
})

export const selectActiveFilterCount = createSelector([selectFilters], (filters) => {
  let count = 0
  if (filters.employmentTypes.length > 0) count++
  if (filters.salaryMin !== null || filters.salaryMax !== null) count++
  if (filters.startDateFrom !== null || filters.startDateTo !== null) count++
  if (filters.positions.length > 0) count++
  return count
})
