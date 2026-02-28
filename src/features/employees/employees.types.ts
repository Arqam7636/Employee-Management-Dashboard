export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern'

export interface Employee {
  id: string
  name: string
  email: string
  position: string
  salary: number
  startDate: string
  employmentType: EmploymentType
}

export type EmployeeFormValues = Omit<Employee, 'id'>
