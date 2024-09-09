import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
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

export function UserNewEditForm({ currentUser }) {
  const router = useRouter();

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
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const clientType = watch('client_type');
  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentUser ? 'اپدیت موفیت امیز بود!' : 'یوزر جدید اضافه شد!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {
                  (values.status === 'active' && 'فعال') ||
                  (values.status === 'banned' && 'بن شده') ||
                  'در انتظار'
                }
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    فقط  *.jpeg, *.jpg, *.png, *.gif
                    <br /> با حجم مجاز است {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      بن شده
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      غیرفعال کردن حساب
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}

            <Field.Switch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    ایمیل تأییده
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>

                    غیرفعال کردن این مورد به طور خودکار یک ایمیل تأیید برای کاربر ارسال می کند
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
            <Field.Switch
              name="welecome"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    ارسال sms
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>

                    پیام خوش امد گویی برای کاربر ارسال میشود
                  </Typography>
                </>
              }
              sx={{ mt: 5, mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  حذف یوزر
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
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


            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'ایجاد کاربر' : 'ثبت تغییرات'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}

