import { configureStore } from '@reduxjs/toolkit'
import {
  selectAllEmployees,
  selectFilteredEmployees,
  selectEmployeeById,
  selectUniquePositions,
  selectActiveFilterCount,
} from 'store/selectors/employees.selectors.ts'
import { describe, it, expect } from 'vitest'

import rootReducer from '../../../store/rootReducer.ts'
import { employeesActions } from '../../../store/slices/employees.slice.ts'
import { uiActions } from '../../../store/slices/ui.slice.ts'
import type { Employee } from '../employees.types.ts'

function createStore() {
  return configureStore({ reducer: rootReducer })
}

const alice: Employee = {
  id: '1',
  name: 'Alice Johnson',
  email: 'alice@test.com',
  position: 'Engineer',
  salary: 90000,
  startDate: '2023-03-15',
  employmentType: 'Full-time',
}
const bob: Employee = {
  id: '2',
  name: 'Bob Smith',
  email: 'bob@test.com',
  position: 'Designer',
  salary: 80000,
  startDate: '2023-06-01',
  employmentType: 'Contract',
}
const carol: Employee = {
  id: '3',
  name: 'Carol Lee',
  email: 'carol@test.com',
  position: 'Engineer',
  salary: 95000,
  startDate: '2024-01-10',
  employmentType: 'Part-time',
}

describe('employees selectors', () => {
  it('selectAllEmployees returns all employees', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    const result = selectAllEmployees(store.getState())
    expect(result).toHaveLength(3)
  })

  it('selectFilteredEmployees returns all when searchQuery is empty', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(3)
  })

  it('selectFilteredEmployees filters by name', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setSearchQuery('alice'))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice Johnson')
  })

  it('selectFilteredEmployees filters by email', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setSearchQuery('bob@'))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Bob Smith')
  })

  it('selectFilteredEmployees filters by position', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setSearchQuery('engineer'))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(2)
  })

  it('selectFilteredEmployees is case-insensitive', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob]))
    store.dispatch(uiActions.setSearchQuery('ALICE'))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(1)
  })

  it('selectEmployeeById returns the correct employee', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob]))
    const selector = selectEmployeeById('2')
    expect(selector(store.getState())).toEqual(bob)
  })

  it('selectEmployeeById returns undefined for null id', () => {
    const store = createStore()
    const selector = selectEmployeeById(null)
    expect(selector(store.getState())).toBeUndefined()
  })
})

describe('filter selectors', () => {
  it('filters by single employment type', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setEmploymentTypeFilter(['Full-time']))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice Johnson')
  })

  it('filters by multiple employment types', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setEmploymentTypeFilter(['Full-time', 'Contract']))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(2)
  })

  it('returns all when employment type filter is empty', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setEmploymentTypeFilter([]))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(3)
  })

  it('filters by salary min', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setSalaryMinFilter(90000))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(2)
    expect(result.every((e) => e.salary >= 90000)).toBe(true)
  })

  it('filters by salary max', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setSalaryMaxFilter(85000))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Bob Smith')
  })

  it('filters by salary range (min + max)', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setSalaryMinFilter(85000))
    store.dispatch(uiActions.setSalaryMaxFilter(92000))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice Johnson')
  })

  it('filters by start date from', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setStartDateFromFilter('2023-06-01'))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(2)
  })

  it('filters by start date to', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setStartDateToFilter('2023-05-31'))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice Johnson')
  })

  it('filters by positions', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setPositionsFilter(['Engineer']))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(2)
  })

  it('applies search AND employment type filter together', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setSearchQuery('engineer'))
    store.dispatch(uiActions.setEmploymentTypeFilter(['Part-time']))
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Carol Lee')
  })

  it('clearAllFilters resets all filters', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    store.dispatch(uiActions.setEmploymentTypeFilter(['Full-time']))
    store.dispatch(uiActions.setSalaryMinFilter(100000))
    store.dispatch(uiActions.setStartDateFromFilter('2024-01-01'))
    store.dispatch(uiActions.setPositionsFilter(['Engineer']))
    store.dispatch(uiActions.clearAllFilters())
    const result = selectFilteredEmployees(store.getState())
    expect(result).toHaveLength(3)
  })

  it('selectUniquePositions returns sorted unique positions', () => {
    const store = createStore()
    store.dispatch(employeesActions.upsertMany([alice, bob, carol]))
    const result = selectUniquePositions(store.getState())
    expect(result).toEqual(['Designer', 'Engineer'])
  })

  it('selectActiveFilterCount returns 0 when no filters active', () => {
    const store = createStore()
    expect(selectActiveFilterCount(store.getState())).toBe(0)
  })

  it('selectActiveFilterCount counts each filter category as 1', () => {
    const store = createStore()
    store.dispatch(uiActions.setEmploymentTypeFilter(['Full-time', 'Part-time']))
    store.dispatch(uiActions.setSalaryMinFilter(50000))
    expect(selectActiveFilterCount(store.getState())).toBe(2)
  })

  it('selectActiveFilterCount returns 4 when all filters active', () => {
    const store = createStore()
    store.dispatch(uiActions.setEmploymentTypeFilter(['Full-time']))
    store.dispatch(uiActions.setSalaryMinFilter(50000))
    store.dispatch(uiActions.setStartDateFromFilter('2023-01-01'))
    store.dispatch(uiActions.setPositionsFilter(['Engineer']))
    expect(selectActiveFilterCount(store.getState())).toBe(4)
  })
})
