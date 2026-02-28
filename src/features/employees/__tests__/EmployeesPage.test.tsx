import { screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import EmployeesPage from '../../../pages/EmployeesPage/EmployeesPage.tsx'
import { renderWithProviders } from '../../../test/utils.tsx'

describe('EmployeesPage', () => {
  it('renders the page header', async () => {
    renderWithProviders(<EmployeesPage />)
    expect(screen.getByText('Employees')).toBeInTheDocument()
  })

  it('renders DataGrid rows after fetch', async () => {
    renderWithProviders(<EmployeesPage />)
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
    expect(screen.getByText('Carol Williams')).toBeInTheDocument()
  })

  it('renders the Add employee button', () => {
    renderWithProviders(<EmployeesPage />)
    expect(screen.getByRole('button', { name: /add employee/i })).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderWithProviders(<EmployeesPage />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
