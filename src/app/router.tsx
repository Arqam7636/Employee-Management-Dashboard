import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoadingOverlay from 'src/components/LoadingOverlay.tsx'

import AppShell from './AppShell.tsx'

const EmployeesPage = lazy(() => import('pages/EmployeesPage/EmployeesPage.tsx'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <EmployeesPage />
          </Suspense>
        ),
      },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
