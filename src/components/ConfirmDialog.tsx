import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Grow from '@mui/material/Grow'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmText?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  loading = false,
  onConfirm,
  onCancel,
}: Readonly<ConfirmDialogProps>) {
  return (
    <Dialog open={open} onClose={onCancel} TransitionComponent={Grow} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? 'Deleting...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
