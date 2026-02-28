import { http, HttpResponse } from 'msw'

export interface MockEmployee {
  id: string
  name: string
  email: string
  position: string
  salary: number
  startDate: string
  employmentType: string
}

export const mockEmployees: MockEmployee[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@test.com',
    position: 'Engineer',
    salary: 95000,
    startDate: '2023-03-15',
    employmentType: 'Full-time',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@test.com',
    position: 'Designer',
    salary: 88000,
    startDate: '2023-06-01',
    employmentType: 'Contract',
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@test.com',
    position: 'Manager',
    salary: 105000,
    startDate: '2024-01-10',
    employmentType: 'Full-time',
  },
]

let nextId = 4

export const handlers = [
  http.get('http://localhost:3001/employees', () => {
    return HttpResponse.json(mockEmployees)
  }),

  http.post('http://localhost:3001/employees', async ({ request }) => {
    const body = (await request.json()) as Omit<MockEmployee, 'id'>
    const newEmployee: MockEmployee = { ...body, id: String(nextId++) }
    mockEmployees.push(newEmployee)
    return HttpResponse.json(newEmployee, { status: 201 })
  }),

  http.put('http://localhost:3001/employees/:id', async ({ request, params }) => {
    const body = (await request.json()) as Omit<MockEmployee, 'id'>
    const id = params.id as string
    const index = mockEmployees.findIndex((e) => e.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    const updated: MockEmployee = { ...body, id }
    mockEmployees[index] = updated
    return HttpResponse.json(updated)
  }),

  http.delete('http://localhost:3001/employees/:id', ({ params }) => {
    const id = params.id as string
    const index = mockEmployees.findIndex((e) => e.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    mockEmployees.splice(index, 1)
    return HttpResponse.json({})
  }),
]
