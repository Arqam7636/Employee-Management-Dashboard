import AddIcon from '@mui/icons-material/Add'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import EmployeeFormDialog from 'features/employees/components/EmployeeFormDialog.tsx'
import EmployeeRowActions from 'features/employees/components/EmployeeRowActions.tsx'
import type { EmployeeFormValues } from 'features/employees/employees.types.ts'
import { useMemo, useCallback } from 'react'
import ConfirmDialog from 'src/components/ConfirmDialog.tsx'
import PageHeader from 'src/components/PageHeader.tsx'
import TabNav from 'src/components/TabNav.tsx'
import {
  useSyncEmployees,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from 'src/features/employees/employees.hooks.ts'
import { useAppSelector, useAppDispatch } from 'store/hooks.ts'
import { selectFilteredEmployees, selectEmployeeById } from 'store/selectors/employees.selectors.ts'
import { uiActions, type ActiveTab } from 'store/slices/ui.slice.ts'
import { formatSalary, formatDate, getInitials } from 'utils/format.ts'

import EmployeesToolbar from './EmployeesPage.toolbar.tsx'

export default function EmployeesPage() {
  const dispatch = useAppDispatch()
  const { isFetching } = useSyncEmployees()

  const rows = useAppSelector(selectFilteredEmployees)
  const { isFormOpen, formMode, selectedEmployeeId, confirmDeleteId, flashRowId, activeTab } =
    useAppSelector((s) => s.ui)

  const selectedEmployee = useAppSelector(selectEmployeeById(selectedEmployeeId))

  const createMutation = useCreateEmployeeMutation()
  const updateMutation = useUpdateEmployeeMutation()
  const deleteMutation = useDeleteEmployeeMutation()

  const handleEdit = useCallback((id: string) => dispatch(uiActions.openEditForm(id)), [dispatch])

  const handleDelete = useCallback(
    (id: string) => dispatch(uiActions.openDeleteConfirm(id)),
    [dispatch],
  )

  const handleAddClick = useCallback(() => {
    dispatch(uiActions.openCreateForm())
  }, [dispatch])

  const handleTabChange = useCallback(
    (value: string) => {
      dispatch(uiActions.setActiveTab(value as ActiveTab))
    },
    [dispatch],
  )

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        align: 'center',
        headerAlign: 'center',
        width: 70,
        minWidth: 20,
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 1.5,
        minWidth: 250,
        renderCell: (params) => (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.light',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {getInitials(params.row.name)}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                {params.row.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {params.row.email}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'startDate',
        headerName: 'Date',
        width: 140,
        valueFormatter: (value: string) => formatDate(value),
      },
      {
        field: 'position',
        headerName: 'Position',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'employmentType',
        headerName: 'Employment Type',
        width: 160,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1, fontWeight: 500, fontSize: '0.75rem' }}
          />
        ),
      },
      {
        field: 'salary',
        headerName: 'Salary',
        width: 130,
        align: 'right',
        headerAlign: 'right',
        valueFormatter: (value: number) => formatSalary(value),
      },
      {
        field: 'actions',
        headerName: '',
        width: 60,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <EmployeeRowActions
            employeeId={String(params.row.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ),
      },
    ],
    [handleEdit, handleDelete],
  )

  const handleFormSubmit = useCallback(
    (values: EmployeeFormValues) => {
      if (formMode === 'create') {
        createMutation.mutate(values)
      } else if (selectedEmployeeId) {
        updateMutation.mutate({ id: selectedEmployeeId, data: values })
      }
    },
    [formMode, selectedEmployeeId, createMutation, updateMutation],
  )

  const handleFormClose = useCallback(() => {
    dispatch(uiActions.closeForm())
  }, [dispatch])

  const handleDeleteConfirm = useCallback(() => {
    if (confirmDeleteId) {
      deleteMutation.mutate(confirmDeleteId)
    }
  }, [confirmDeleteId, deleteMutation])

  const handleDeleteCancel = useCallback(() => {
    dispatch(uiActions.closeDeleteConfirm())
  }, [dispatch])

  const getRowClassName = useCallback(
    (params: { id: string | number }) => (String(params.id) === flashRowId ? 'row--flash' : ''),
    [flashRowId],
  )

  return (
    <Box>
      <PageHeader
        title="Employees"
        subtitle="Manage Employees within your organization"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add Employee
          </Button>
        }
      />

      <TabNav value={activeTab} onChange={handleTabChange} />

      {activeTab === 'active' ? (
        <Paper sx={{ p: 0, overflow: 'hidden' }} elevation={0}>
          <EmployeesToolbar />
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => String(row.id)}
            loading={isFetching}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            getRowClassName={getRowClassName}
            disableRowSelectionOnClick
            checkboxSelection
            rowHeight={64}
            slots={{
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    py: 4,
                  }}
                >
                  <Typography color="text.secondary">
                    No employees found. Click &quot;Add Employee&quot; to get started.
                  </Typography>
                </Box>
              ),
            }}
            sx={{
              border: 'none',
              minHeight: 400,
              '--DataGrid-rowBorderColor': 'rgba(0, 0, 0, 0.12)',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#FAFAFA',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
              '& .MuiDataGrid-row': {
                '&:hover': { bgcolor: '#FAFBFC' },
              },
            }}
          />
        </Paper>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center' }} elevation={0}>
          <Typography color="text.secondary">
            No employees in the &quot;{activeTab}&quot; category.
          </Typography>
        </Paper>
      )}

      <EmployeeFormDialog
        open={isFormOpen}
        mode={formMode}
        employee={selectedEmployee ?? null}
        loading={createMutation.isPending || updateMutation.isPending}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Delete Employee"
        description="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  )
}
