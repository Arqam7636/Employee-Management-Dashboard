import { z } from 'zod/v4'

export const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  position: z.string().min(1, 'Position is required'),
  salary: z.coerce.number({ error: 'Salary must be a number' }).min(0, 'Salary must be 0 or more'),
  startDate: z.string().min(1, 'Start date is required'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Intern'], {
    error: 'Employment type is required',
  }),
})

export type EmployeeSchemaValues = z.output<typeof employeeSchema>
export type EmployeeFormInput = z.input<typeof employeeSchema>
