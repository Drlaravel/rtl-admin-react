import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'نام !الزامی است' }),
  username: zod.string().min(1, { message: 'نام کاربری !الزامی است' }),
  password: zod.string().min(6, { message: 'رمز عبور حداقل باید 6 کاراکتر باشد!' }),
  company_name: zod.string().optional(), // اختیاری زیرا فقط برای "corporate" ضروری است
  client_type: zod.enum(['corporate', 'individual'], {
    message: 'نوع مشتری باید "corporate" یا "individual" باشد!',
  }),
  employer: zod.string().min(1, { message: 'نام کارفرما !الزامی است' }),
  mobile: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  email: zod
    .string()
    .min(1, { message: 'ایمیل !الزامی است' })
    .email({ message: 'ایمیل باید معتبر باشد!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'استان !الزامی است!' },
  }),
  address: zod.string().min(1, { message: 'آدرس !الزامی است!' }),
  state: zod.string().min(1, { message: 'خیابان !الزامی است!' }),
  city: zod.string().min(1, { message: 'شهر !الزامی است!' }),
  role: zod.string(),
  zipCode: zod.string().min(1, { message: 'کد پستی !الزامی است!' }),
  status: zod.string(),
  isVerified: zod.boolean(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || '',
      avatarUrl: currentUser?.avatarUrl || null,
      isVerified: currentUser?.isVerified || false,
      welecome: currentUser?.isVerified || false,
      name: currentUser?.name || '',
      username: currentUser?.username || '',
      password: currentUser?.password || '',
      company_name: currentUser?.company_name || '',
      client_type: currentUser?.client_type || 'individual',
      mobile: currentUser?.mobile || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      address: currentUser?.address || '',
      zipCode: currentUser?.zipCode || '',
      role: currentUser?.role || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // مشاهده مقدار client_type برای نمایش شرطی
  const clientType = watch('client_type');

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'در حال ارسال...',
        success: 'موفقیت‌آمیز بود!',
        error: 'موفقیت‌آمیز نبود دوباره تلاش کنید!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>آپدیت سریع</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            حساب در انتظار تایید است
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Select
              fullWidth
              name="status"
              label="وضعیت"
              InputLabelProps={{ shrink: true }}
            >
              {['active', 'banned', 'pending'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="name" label="نام و نام خانوادگی" />
            <Field.Text name="username" label="نام کاربری" />
            <Field.Text name="password" label="رمز عبور" type="password" />

            <Field.Select
              fullWidth
              name="client_type"
              label="نوع مشتری"
              InputLabelProps={{ shrink: true }}
            >
              {[
                { value: 'corporate', label: 'شرکتی' },
                { value: 'individual', label: 'شخصی' }
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            {/* نمایش فیلد "نام شرکت" به صورت شرطی */}
            {clientType === 'corporate' && (
              <Field.Text name="company_name" label="نام شرکت" />
            )}


            <Field.Phone name="mobile" label="شماره موبایل" />
            <Field.Text name="email" label="آدرس ایمیل" />
            <Field.Text name="city" label="شهر" />
            <Field.Text name="address" label="آدرس" />
            <Field.Text name="state" label="خیابان" />
            <Field.Text name="zipCode" label="کدپستی" />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            کنسل
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            آپدیت
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
