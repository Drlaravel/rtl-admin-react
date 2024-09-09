import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function InvoiceNewEditStatusDate() {
  const { watch } = useFormContext();

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <Field.Text
        disabled
        name="invoiceNumbser"
        label="Invoice number"
        value={values.invoiceNumber}
      />
      <Field.Select fullWidth name="status" label="وضعیت" InputLabelProps={{ shrink: true }}>
        {[
          { value: 'paid', label: 'پرداخت‌شده' },
          { value: 'pending', label: 'در انتظار' },
          { value: 'overdue', label: 'سررسید گذشته' },
          { value: 'draft', label: 'پیش‌نویس' },
        ].map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ textTransform: 'capitalize' }}>
            {option.label}
          </MenuItem>
        ))}
      </Field.Select>


      <Field.DatePicker name="createDate" label="تاریخ شروع" />
      <Field.DatePicker name="dueDate" label="سررسید" />
    </Stack>
  );
}
