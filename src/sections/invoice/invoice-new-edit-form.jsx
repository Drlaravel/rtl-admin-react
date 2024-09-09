import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { today, fIsAfter } from 'src/utils/format-time';

import { _addressBooks } from 'src/_mock';

import { Form, schemaHelper } from 'src/components/hook-form';

import { InvoiceNewEditDetails } from './invoice-new-edit-details';
import { InvoiceNewEditAddress } from './invoice-new-edit-address';
import { InvoiceNewEditStatusDate } from './invoice-new-edit-status-date';

export const NewInvoiceSchema = zod
  .object({
    invoiceTo: zod.custom().refine((data) => data !== null, { message: 'گیرنده فاکتور ضروری است!' }),
    createDate: schemaHelper.date({ message: { required_error: 'تاریخ ایجاد ضروری است!' } }),
    dueDate: schemaHelper.date({ message: { required_error: 'تاریخ سررسید ضروری است!' } }),
    items: zod.array(
      zod.object({
        title: zod.string().min(1, { message: 'عنوان ضروری است!' }),
        service: zod.string().min(1, { message: 'خدمت ضروری است!' }),
        quantity: zod.number().min(1, { message: 'تعداد باید بیشتر از 0 باشد' }),
        // اجباری نیست
        price: zod.number(),
        total: zod.number(),
        description: zod.string(),
      })
    ),
    // اجباری نیست
    taxes: zod.number(),
    status: zod.string(),
    discount: zod.number(),
    shipping: zod.number(),
    totalAmount: zod.number(),
    invoiceNumber: zod.string(),
    invoiceFrom: zod.custom().nullable(),
  })
  .refine((data) => !fIsAfter(data.createDate, data.dueDate), {
    message: 'تاریخ سررسید نمی‌تواند زودتر از تاریخ ایجاد باشد!',
    path: ['dueDate'],
  });

// ----------------------------------------------------------------------

export function InvoiceNewEditForm({ currentInvoice }) {
  const router = useRouter();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const defaultValues = useMemo(
    () => ({
      invoiceNumber: currentInvoice?.invoiceNumber || 'INV-1990',
      createDate: currentInvoice?.createDate || today(),
      dueDate: currentInvoice?.dueDate || null,
      taxes: currentInvoice?.taxes || 0,
      shipping: currentInvoice?.shipping || 0,
      status: currentInvoice?.status || 'draft',
      discount: currentInvoice?.discount || 0,
      invoiceFrom: currentInvoice?.invoiceFrom || _addressBooks[0],
      invoiceTo: currentInvoice?.invoiceTo || null,
      totalAmount: currentInvoice?.totalAmount || 0,
      items: currentInvoice?.items || [
        {
          title: '',
          description: '',
          service: '',
          quantity: 1,
          price: 0,
          total: 0,
        },
      ],
    }),
    [currentInvoice]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('داده‌ها', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('داده‌ها', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <Form methods={methods}>
      <Card>
        <InvoiceNewEditAddress />

        <InvoiceNewEditStatusDate />

        <InvoiceNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          ذخیره به‌عنوان پیش‌نویس
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentInvoice ? 'بروزرسانی' : 'ایجاد'} و ارسال
        </LoadingButton>
      </Stack>
    </Form>
  );
}
