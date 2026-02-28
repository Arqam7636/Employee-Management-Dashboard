import type { Employee, EmployeeFormValues } from 'features/employees/employees.types.ts'

import http from '../http/axios.ts'
import { API_ROUTES } from '../http/routes.ts'

export function fetchEmployees(): Promise<Employee[]> {
  return http.get(API_ROUTES.employees) as Promise<Employee[]>
}

export function createEmployee(data: EmployeeFormValues): Promise<Employee> {
  return http.post(API_ROUTES.employees, data) as Promise<Employee>
}

export function updateEmployee(id: string, data: EmployeeFormValues): Promise<Employee> {
  return http.put(API_ROUTES.employee(id), data) as Promise<Employee>
}

export function deleteEmployee(id: string): Promise<void> {
  return http.delete(API_ROUTES.employee(id)) as Promise<void>
}
