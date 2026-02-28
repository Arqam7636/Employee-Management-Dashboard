import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import * as api from 'services/apis/employees.api.ts'
import { useAppDispatch } from 'store/hooks.ts'
import { employeesActions } from 'store/slices/employees.slice.ts'
import { uiActions } from 'store/slices/ui.slice.ts'

import type { Employee, EmployeeFormValues } from './employees.types.ts'

export const employeesKeys = {
  all: ['employees'] as const,
  list: () => [...employeesKeys.all, 'list'] as const,
}

function normalizeId(employee: Employee): Employee {
  return { ...employee, id: String(employee.id) }
}

export function useEmployeesQuery() {
  return useQuery({
    queryKey: employeesKeys.list(),
    queryFn: api.fetchEmployees,
    select: (data) => data.map(normalizeId),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  })
}

export function useSyncEmployees() {
  const dispatch = useAppDispatch()
  const query = useEmployeesQuery()
  const prevDataRef = useRef<Employee[] | undefined>(undefined)

  useEffect(() => {
    if (query.data && query.data !== prevDataRef.current) {
      prevDataRef.current = query.data
      dispatch(employeesActions.upsertMany(query.data))
    }
  }, [query.data, dispatch])

  return query
}

export function useCreateEmployeeMutation() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EmployeeFormValues) => api.createEmployee(data),
    onSuccess: (rawEmployee) => {
      const employee = normalizeId(rawEmployee)
      dispatch(employeesActions.upsertOne(employee))
      dispatch(uiActions.closeForm())
      dispatch(
        uiActions.showSnackbar({ message: 'Employee created successfully', severity: 'success' }),
      )
      dispatch(uiActions.setFlashRowId(employee.id))
      setTimeout(() => dispatch(uiActions.setFlashRowId(null)), 1500)
      void queryClient.invalidateQueries({ queryKey: employeesKeys.all })
    },
    onError: (error: { message: string }) => {
      dispatch(uiActions.showSnackbar({ message: error.message, severity: 'error' }))
    },
  })
}

export function useUpdateEmployeeMutation() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormValues }) =>
      api.updateEmployee(id, data),
    onSuccess: (rawEmployee) => {
      const employee = normalizeId(rawEmployee)
      dispatch(employeesActions.upsertOne(employee))
      dispatch(uiActions.closeForm())
      dispatch(
        uiActions.showSnackbar({ message: 'Employee updated successfully', severity: 'success' }),
      )
      dispatch(uiActions.setFlashRowId(employee.id))
      setTimeout(() => dispatch(uiActions.setFlashRowId(null)), 1500)
      void queryClient.invalidateQueries({ queryKey: employeesKeys.all })
    },
    onError: (error: { message: string }) => {
      dispatch(uiActions.showSnackbar({ message: error.message, severity: 'error' }))
    },
  })
}

export function useDeleteEmployeeMutation() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteEmployee(id),
    onSuccess: (_data, id) => {
      dispatch(employeesActions.removeOne(id))
      dispatch(uiActions.closeDeleteConfirm())
      dispatch(
        uiActions.showSnackbar({ message: 'Employee deleted successfully', severity: 'success' }),
      )
      void queryClient.invalidateQueries({ queryKey: employeesKeys.all })
    },
    onError: (error: { message: string }) => {
      dispatch(uiActions.showSnackbar({ message: error.message, severity: 'error' }))
    },
  })
}
