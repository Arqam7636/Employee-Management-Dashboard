import { describe, it, expect } from 'vitest'

import employeesReducer, {
  employeesActions,
  employeesAdapterSelectors,
} from '../../../store/slices/employees.slice.ts'
import type { Employee } from '../employees.types.ts'

const alice: Employee = {
  id: '1',
  name: 'Alice',
  email: 'alice@test.com',
  position: 'Engineer',
  salary: 90000,
  startDate: '2023-03-15',
  employmentType: 'Full-time',
}
const bob: Employee = {
  id: '2',
  name: 'Bob',
  email: 'bob@test.com',
  position: 'Designer',
  salary: 80000,
  startDate: '2023-06-01',
  employmentType: 'Contract',
}

describe('employees slice', () => {
  it('has correct initial state', () => {
    const state = employeesReducer(undefined, { type: '@@INIT' })
    expect(employeesAdapterSelectors.selectAll(state)).toEqual([])
    expect(employeesAdapterSelectors.selectTotal(state)).toBe(0)
  })

  it('upsertMany adds multiple entities', () => {
    const state = employeesReducer(undefined, employeesActions.upsertMany([alice, bob]))
    expect(employeesAdapterSelectors.selectAll(state)).toEqual([alice, bob])
    expect(employeesAdapterSelectors.selectTotal(state)).toBe(2)
  })

  it('upsertOne adds a new entity', () => {
    const state = employeesReducer(undefined, employeesActions.upsertOne(alice))
    expect(employeesAdapterSelectors.selectById(state, '1')).toEqual(alice)
  })

  it('upsertOne updates an existing entity', () => {
    let state = employeesReducer(undefined, employeesActions.upsertMany([alice, bob]))
    const updatedAlice = { ...alice, salary: 120000 }
    state = employeesReducer(state, employeesActions.upsertOne(updatedAlice))
    expect(employeesAdapterSelectors.selectById(state, '1')?.salary).toBe(120000)
    expect(employeesAdapterSelectors.selectTotal(state)).toBe(2)
  })

  it('removeOne removes an entity', () => {
    let state = employeesReducer(undefined, employeesActions.upsertMany([alice, bob]))
    state = employeesReducer(state, employeesActions.removeOne('1'))
    expect(employeesAdapterSelectors.selectTotal(state)).toBe(1)
    expect(employeesAdapterSelectors.selectById(state, '1')).toBeUndefined()
    expect(employeesAdapterSelectors.selectById(state, '2')).toEqual(bob)
  })

  it('setAll replaces all entities', () => {
    let state = employeesReducer(undefined, employeesActions.upsertMany([alice]))
    state = employeesReducer(state, employeesActions.setAll([bob]))
    expect(employeesAdapterSelectors.selectAll(state)).toEqual([bob])
  })
})
