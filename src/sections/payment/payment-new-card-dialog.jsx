import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PaymentNewCardDialog({ onClose, ...other }) {
  return (
    <Dialog maxWidth="sm" onClose={onClose} {...other}>
      <DialogTitle> کارت جدید </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <Stack spacing={2.5}>
          <TextField
            autoFocus
            label="شماره کارت"
            placeholder="XXXX XXXX XXXX XXXX"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="صاحب کارت"
            placeholder="علی رضا"
            InputLabelProps={{ shrink: true }}
          />

          <Stack spacing={2} direction="row">
            <TextField
              label="تاریخ انقضا"
              placeholder="MM/YY"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="CVV/CVC"
              placeholder="***"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      arrow
                      placement="top"
                      title="عدد سه رقمی که در پشت کارت شما قرار دارد"
                      slotProps={{ tooltip: { sx: { maxWidth: 160, textAlign: 'center' } } }}
                    >
                      <Iconify width={18} icon="eva:info-outline" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            sx={{ typography: 'caption', color: 'text.disabled' }}
          >
            <Iconify icon="carbon:locked" sx={{ mr: 0.5 }} />
            تراکنش شما با رمزنگاری SSL ایمن است
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onClose}>
          کنسل
        </Button>

        <Button variant="contained" onClick={onClose}>
          اضافه کردن
        </Button>
      </DialogActions>
    </Dialog>
  );
}
