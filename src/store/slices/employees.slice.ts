import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { Employee } from 'features/employees/employees.types.ts'

const employeesAdapter = createEntityAdapter<Employee>()

const employeesSlice = createSlice({
  name: 'employees',
  initialState: employeesAdapter.getInitialState(),
  reducers: {
    setAll: employeesAdapter.setAll,
    upsertMany: employeesAdapter.upsertMany,
    upsertOne: employeesAdapter.upsertOne,
    removeOne: employeesAdapter.removeOne,
  },
})

export const employeesActions = employeesSlice.actions
export const employeesAdapterSelectors = employeesAdapter.getSelectors()
export default employeesSlice.reducer
