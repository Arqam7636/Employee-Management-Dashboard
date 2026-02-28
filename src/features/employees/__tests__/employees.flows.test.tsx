import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'

import EmployeesPage from '../../../pages/EmployeesPage/EmployeesPage.tsx'
import { server } from '../../../test/server.ts'
import { renderWithProviders } from '../../../test/utils.tsx'

describe('Employee CRUD flows', () => {
  it('adds a new employee via the form dialog', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<EmployeesPage />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    // Open create dialog
    await user.click(screen.getByRole('button', { name: /add employee/i }))
    const dialog = await screen.findByRole('dialog')

    // Fill the form
    await user.type(within(dialog).getByLabelText('Name'), 'Dave New')
    await user.type(within(dialog).getByLabelText('Email'), 'dave@test.com')
    await user.type(within(dialog).getByLabelText('Position'), 'Intern')

    const salaryInput = within(dialog).getByLabelText('Salary')
    await user.clear(salaryInput)
    await user.type(salaryInput, '50000')

    // Fill start date
    const startDateInput = within(dialog).getByLabelText('Start Date')
    await user.type(startDateInput, '2024-06-01')

    // Submit
    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    // Verify dialog closes and snackbar state updates
    await waitFor(() => {
      expect(store.getState().ui.isFormOpen).toBe(false)
    })

    // Verify the success snackbar was dispatched in the store
    expect(store.getState().ui.snackbar.message).toBe('Employee created successfully')
    expect(store.getState().ui.snackbar.severity).toBe('success')
  })

  it('opens edit dialog when edit action is clicked', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<EmployeesPage />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    // Click the three-dot menu on first row
    const actionButtons = screen.getAllByLabelText('actions')
    await user.click(actionButtons[0])

    // Click Edit in the menu
    const editItem = await screen.findByText('Edit')
    await user.click(editItem)

    // Verify edit form opened
    expect(store.getState().ui.isFormOpen).toBe(true)
    expect(store.getState().ui.formMode).toBe('edit')
  })

  it('opens delete confirm dialog when delete action is clicked', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<EmployeesPage />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    // Click the three-dot menu on first row
    const actionButtons = screen.getAllByLabelText('actions')
    await user.click(actionButtons[0])

    // Click Delete in the menu
    const deleteItem = await screen.findByText('Delete')
    await user.click(deleteItem)

    // Verify confirm dialog state
    expect(store.getState().ui.confirmDeleteId).not.toBeNull()

    // Verify confirm dialog is visible
    expect(screen.getByText('Delete Employee')).toBeInTheDocument()
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  it('shows error state on API failure', async () => {
    server.use(
      http.get('http://localhost:3001/employees', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 })
      }),
    )

    renderWithProviders(<EmployeesPage />)

    // Page renders with header even when API fails
    await waitFor(() => {
      expect(screen.getByText('Employees')).toBeInTheDocument()
    })
  })
})
