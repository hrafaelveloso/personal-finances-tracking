import React from 'react';
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

const ConfirmDeleteDialog: React.FC<IConfirmDeleteDialogProps> = ({ open, handleClose, handleSubmit }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">Apagar entrada dos registos</DialogTitle>
      <DialogContent>
        <DialogContentText>Confirma que a entrada é para apagar?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="text">
          Fechar
        </Button>
        <Button onClick={handleSubmit}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};

interface IConfirmDeleteDialogProps {
  open: boolean;
  handleClose: any;
  handleSubmit: any;
}

export default React.memo(ConfirmDeleteDialog);
