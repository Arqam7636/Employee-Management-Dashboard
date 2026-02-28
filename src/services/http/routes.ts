export const API_ROUTES = {
  employees: '/employees',
  employee: (id: string) => `/employees/${id}`,
} as const
