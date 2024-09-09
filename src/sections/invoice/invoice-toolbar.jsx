import { useCallback } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import NoSsr from '@mui/material/NoSsr';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { InvoicePDF } from './invoice-pdf';

// ----------------------------------------------------------------------
const STATUS_LABELS = {
  pending: 'در انتظار',
  paid: 'تکمیل شده',
  cancelled: 'لغو شده',
  overdue: 'بازپرداخت شده',
  draft: 'پیش نویس',
};

export function InvoiceToolbar({ invoice, currentStatus, statusOptions, onChangeStatus }) {
  const router = useRouter();

  const view = useBoolean();

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.invoice.edit(`${invoice?.id}`));
  }, [invoice?.id, router]);

  const renderDownload = (
    <NoSsr>
      <PDFDownloadLink
        document={
          invoice ? <InvoicePDF invoice={invoice} currentStatus={currentStatus} /> : <span />
        }
        fileName={invoice?.invoiceNumber}
        style={{ textDecoration: 'none' }}
      >
        {({ loading }) => (
          <Tooltip title="دانلود">
            <IconButton>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Iconify icon="eva:cloud-download-fill" />
              )}
            </IconButton>
          </Tooltip>
        )}
      </PDFDownloadLink>
    </NoSsr>
  );

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
          <Tooltip title="ویرایش">
            <IconButton onClick={handleEdit}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="مشاهده">
            <IconButton onClick={view.onTrue}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          {renderDownload}

          <Tooltip title="چاپ">
            <IconButton>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="ارسال">
            <IconButton>
              <Iconify icon="iconamoon:send-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="اشتراک‌گذاری">
            <IconButton>
              <Iconify icon="solar:share-bold" />
            </IconButton>
          </Tooltip>
        </Stack>

        <TextField
          fullWidth
          select
          label="وضعیت"
          value={currentStatus}
          onChange={onChangeStatus}
          inputProps={{ id: `status-select-label` }}
          InputLabelProps={{ htmlFor: `status-select-label` }}
          sx={{ maxWidth: 160 }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {STATUS_LABELS[option.value] || option.label}
            </MenuItem>
          ))}
        </TextField>

      </Stack>

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              بستن
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              {invoice && <InvoicePDF invoice={invoice} currentStatus={currentStatus} />}
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
