import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography } from '@mui/material';

interface BulkActionModal {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  text: string;
  actionText: string;
  products: string[];
}

export default function BulkActionModal({
  open,
  onClose,
  onConfirm,
  title,
  text,
  actionText,
  products,
}: BulkActionModal) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
          {products.length > 0 && (
            <Box sx={{ mt: 2 }}>
              Produtos selecionados:
              <ul>
                {products.map((product, index) => (
                  <li key={index}>
                    <Typography>{product}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          {actionText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
