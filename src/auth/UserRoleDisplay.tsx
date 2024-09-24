import React from 'react';

const UserRoleDisplay = ({ user }) => {
  // بررسی نقش‌ها و تعیین کلمه مناسب
  const getRoleDisplay = () => {
    if (user?.role?.includes('admin')) {
      return 'ادمین';
    } else if (user?.role?.includes('editor')) {
      return 'ایدتور';
    } else if (user?.role?.includes('user')) {
      return 'کاربر';
    } else {
      return 'نقش تعریف نشده';
    }
    return user
  };

  return (
    <span className="block text-xs text-center">
      {getRoleDisplay()}
    </span>
  );
};

export default UserRoleDisplay;
