import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { renderWithProviders } from '../../../test/utils.tsx'
import EmployeeFormDialog from '../components/EmployeeFormDialog.tsx'

describe('EmployeeFormDialog', () => {
  const defaultProps = {
    open: true,
    mode: 'create' as const,
    employee: null,
    loading: false,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  }

  it('renders create dialog title', () => {
    renderWithProviders(<EmployeeFormDialog {...defaultProps} />)
    expect(screen.getByText('Add Employee')).toBeInTheDocument()
  })

  it('renders edit dialog title', () => {
    renderWithProviders(
      <EmployeeFormDialog
        {...defaultProps}
        mode="edit"
        employee={{
          id: '1',
          name: 'Alice',
          email: 'alice@test.com',
          position: 'Engineer',
          salary: 90000,
          startDate: '2023-03-15',
          employmentType: 'Full-time',
        }}
      />,
    )
    expect(screen.getByText('Edit Employee')).toBeInTheDocument()
  })

  it('prefills form in edit mode', () => {
    renderWithProviders(
      <EmployeeFormDialog
        {...defaultProps}
        mode="edit"
        employee={{
          id: '1',
          name: 'Alice',
          email: 'alice@test.com',
          position: 'Engineer',
          salary: 90000,
          startDate: '2023-03-15',
          employmentType: 'Full-time',
        }}
      />,
    )
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument()
    expect(screen.getByDisplayValue('alice@test.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Engineer')).toBeInTheDocument()
    expect(screen.getByDisplayValue('90000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2023-03-15')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeeFormDialog {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText(/name must be at least/i)).toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<EmployeeFormDialog {...defaultProps} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('disables buttons when loading', () => {
    renderWithProviders(<EmployeeFormDialog {...defaultProps} loading={true} />)
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
  })
})
