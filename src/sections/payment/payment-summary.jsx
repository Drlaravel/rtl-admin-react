import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PaymentSummary({ sx, ...other }) {
  const renderPrice = (
    <Stack direction="row" justifyContent="flex-end">
      <Typography variant="h4">۹.۹۹</Typography>
      <Typography variant="h4"> دلار </Typography>
      <Typography
        component="span"
        sx={{
          ml: 1,
          alignSelf: 'center',
          typography: 'body2',
          color: 'text.disabled',
        }}
      >
        / ماه
      </Typography>
    </Stack>
  );

  return (
    <Box
      sx={{
        p: 5,
        borderRadius: 2,
        bgcolor: 'background.neutral',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" sx={{ mb: 5 }}>
        خلاصه
      </Typography>

      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            اشتراک
          </Typography>

          <Label color="error">پریمیوم</Label>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            صورتحساب ماهانه
          </Typography>
          <Switch defaultChecked />
        </Stack>

        {renderPrice}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">مجموع صورتحساب</Typography>

          <Typography variant="subtitle1">۹.۹۹ دلار *</Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>

      <Typography component="div" variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
        * به‌اضافه مالیات‌های مربوطه
      </Typography>

      <Button fullWidth size="large" variant="contained" sx={{ mt: 5, mb: 3 }}>
        ارتقاء پلن
      </Button>

      <Stack alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:shield-check-bold" sx={{ color: 'success.main' }} />
          <Typography variant="subtitle2">پرداخت امن با کارت اعتباری</Typography>
        </Stack>

        <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center' }}>
          این یک پرداخت رمزگذاری شده SSL 128 بیتی است
        </Typography>
      </Stack>
    </Box>
  );
}
