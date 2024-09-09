import { useState, useCallback } from 'react';
import { paths } from 'src/routes/paths';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useRouter, usePathname } from 'src/routes/hooks';

import { varAlpha } from 'src/theme/styles';
import Box from '@mui/material/Box';
import { Iconify } from 'src/components/iconify';
import { AnimateAvatar } from 'src/components/animate';

import { useMockedUser } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';
// ----------------------------------------------------------------------

export function AccountDrawer({ data = [], sx, ...other }) {
  const theme = useTheme();

  const router = useRouter();

  const pathname = usePathname();

  const { user } = useMockedUser();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClickItem = useCallback(
    (path) => {
      handleCloseMenu();
      router.push(path);
    },
    [handleCloseMenu, router]
  );

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: { src: user?.photoURL, alt: user?.displayName },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {user?.displayName?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  return (
    <>
      <AccountButton
        onClick={handleOpenMenu}
        photoURL={user?.photoURL}
        displayName={user?.displayName}
        sx={sx}
        {...other}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 250,
            padding: 2,
            fontSize: 18,
            borderRadius: 2,
            textAlign: 'center',
            boxShadow: theme.shadows[3],
            '& .MuiMenuItem-root': {
              typography: 'body2',
              padding: '8px 16px',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: varAlpha(theme.vars.palette.primary.main, 0.08),
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2.5, py: 1 }}>
          <Button
            fullWidth
            variant="soft"
            size="large"

            onClick={() => handleClickItem(paths.dashboard.user.root)}
          >
            پروفایل
          </Button>
        </Box>
        <Box sx={{ px: 2.5, py: 1 }}>
          <SignOutButton />
        </Box>
      </Menu>
    </>
  );
}
