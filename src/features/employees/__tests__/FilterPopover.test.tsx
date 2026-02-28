import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

import EmployeesPage from '../../../pages/EmployeesPage/EmployeesPage.tsx'
import { renderWithProviders } from '../../../test/utils.tsx'

describe('FilterPopover', () => {
  it('opens when Filters button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /filters/i }))

    const popover = screen.getByRole('presentation')
    expect(within(popover).getByText('Employment Type')).toBeInTheDocument()
    expect(within(popover).getByText('Salary Range')).toBeInTheDocument()
    expect(within(popover).getByText('Start Date')).toBeInTheDocument()
    expect(within(popover).getByText('Position')).toBeInTheDocument()
  })

  it('filters by employment type when checkbox is toggled', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /filters/i }))
    await user.click(screen.getByLabelText('Contract'))

    expect(store.getState().ui.filters.employmentTypes).toEqual(['Contract'])
  })

  it('Clear all resets filters', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /filters/i }))
    await user.click(screen.getByLabelText('Full-time'))

    expect(store.getState().ui.filters.employmentTypes).toEqual(['Full-time'])

    await user.click(screen.getByRole('button', { name: /clear all/i }))

    expect(store.getState().ui.filters.employmentTypes).toEqual([])
  })

  it('position search narrows the checkbox list', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Both positions should be visible initially
    expect(screen.getByLabelText('Engineer')).toBeInTheDocument()
    expect(screen.getByLabelText('Designer')).toBeInTheDocument()
    expect(screen.getByLabelText('Manager')).toBeInTheDocument()

    // Search to narrow
    await user.type(screen.getByPlaceholderText('Search positions...'), 'Eng')

    expect(screen.getByLabelText('Engineer')).toBeInTheDocument()
    expect(screen.queryByLabelText('Designer')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Manager')).not.toBeInTheDocument()
  })
})
