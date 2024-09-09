import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ ...other }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>فایل را رها کنید یا انتخاب کنید</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          فایل‌ها را اینجا رها کنید یا برای
          <Box
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            مرور
          </Box>
          از طریق دستگاه خود کلیک کنید.
        </Box>
      </Stack>
    </Box>
  );
}
