import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grow from '@mui/material/Grow'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import type { Employee, EmployeeFormValues, EmploymentType } from '../employees.types.ts'

import {
  employeeSchema,
  type EmployeeSchemaValues,
  type EmployeeFormInput,
} from './EmployeeForm.schema.ts'

const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Intern']

interface EmployeeFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  employee?: Employee | null
  loading?: boolean
  onClose: () => void
  onSubmit: (values: EmployeeFormValues) => void
}

const SUBMIT_LABEL: Record<EmployeeFormDialogProps['mode'], { idle: string; loading: string }> = {
  create: { idle: 'Create', loading: 'Creating...' },
  edit: { idle: 'Save', loading: 'Saving...' },
}

export default function EmployeeFormDialog({
  open,
  mode,
  employee,
  loading = false,
  onClose,
  onSubmit,
}: Readonly<EmployeeFormDialogProps>) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormInput, unknown, EmployeeSchemaValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      position: '',
      salary: '',
      startDate: '',
      employmentType: 'Full-time',
    },
  })

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && employee) {
        reset({
          name: employee.name,
          email: employee.email,
          position: employee.position,
          salary: String(employee.salary),
          startDate: employee.startDate,
          employmentType: employee.employmentType,
        })
      } else {
        reset({
          name: '',
          email: '',
          position: '',
          salary: '',
          startDate: '',
          employmentType: 'Full-time',
        })
      }
    }
  }, [open, mode, employee, reset])

  const handleFormSubmit = (values: EmployeeSchemaValues) => {
    onSubmit(values)
  }

  const submitLabel = SUBMIT_LABEL[mode][loading ? 'loading' : 'idle']

  return (
    <Dialog open={open} onClose={onClose} slots={{ transition: Grow }} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogTitle>{mode === 'create' ? 'Add Employee' : 'Edit Employee'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Position"
                  fullWidth
                  error={!!errors.position}
                  helperText={errors.position?.message}
                />
              )}
            />
            <Controller
              name="salary"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={field.onChange}
                  label="Salary"
                  type="number"
                  fullWidth
                  error={!!errors.salary}
                  helperText={errors.salary?.message}
                />
              )}
            />
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Start Date"
                  type="date"
                  fullWidth
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
            <Controller
              name="employmentType"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Employment Type"
                  fullWidth
                  error={!!errors.employmentType}
                  helperText={errors.employmentType?.message}
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
