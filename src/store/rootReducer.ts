import { combineReducers } from '@reduxjs/toolkit'

import employeesReducer from './slices/employees.slice.ts'
import uiReducer from './slices/ui.slice.ts'

const rootReducer = combineReducers({
  employees: employeesReducer,
  ui: uiReducer,
})

export default rootReducer
