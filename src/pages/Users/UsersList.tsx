import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';
import Pagination from '../../components/Pagination/Pagination';

const MySwal = withReactContent(Swal);

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  email_verified_at: string | null;
  type: 'gold' | 'silver' | 'bronze';
  created_at: string;
  updated_at: string;
  roles: { name: string }[]; // اضافه کردن آرایه‌ای از نقش‌ها
  is_admin: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const navigate = useNavigate();

  const showAlert = useCallback(
    (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
      return MySwal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        confirmButtonColor: '#3085d6',
      });
    },
    []
  );

  const fetchUsers = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get(`/api/users?page=${page}`);
        if (response.data) {
          setUsers(response.data.data.data);
          setPageCount(response.data.data.last_page); // استفاده از تعداد صفحات صحیح
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        showAlert('خطا!', 'دریافت کاربران با مشکل مواجه شد.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [showAlert]
  );

  useEffect(() => {
    fetchUsers(currentPage + 1); // بارگذاری کاربران بر اساس صفحه جاری
  }, [fetchUsers, currentPage]);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // تنظیم شماره صفحه فعلی
  };

  const handleDelete = useCallback(
    (userId: number) => {
      MySwal.fire({
        title: 'آیا از حذف این کاربر مطمئن هستید؟',
        text: 'این عملیات قابل بازگشت نیست!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'بله، حذف کن!',
        cancelButtonText: 'انصراف',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await api.delete(`/api/users/${userId}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            showAlert('حذف شد!', 'کاربر با موفقیت حذف شد.', 'success');
          } catch (error) {
            console.error('Error deleting user:', error);
            showAlert('خطا!', 'حذف کاربر با مشکل مواجه شد.', 'error');
          }
        }
      });
    },
    [showAlert]
  );

  const handleDetails = (userId: number) => {
     navigate(`/admin/users/edit/${userId}`);
  };

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="user-list">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">لیست کاربران</h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <NavLink to="/" className="font-medium">
                داشبورد
              </NavLink>
            </li>
            <li>
              <NavLink to="/users" className="font-medium text-primary">
                لیست کاربران
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>

      <TableComponent
        headers={['ایدی', 'نام', 'ایمیل', 'موبایل', 'نقش‌ها', 'نوع کاربر', 'تاریخ ایجاد']}
        data={users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.roles.map(role => role.name).join(', '), // نمایش نقش‌ها
          type: user.type === 'gold' ? 'طلایی' : user.type === 'silver' ? 'نقره‌ای' : 'برنزی',
          created_at: new Date(user.created_at).toLocaleDateString('fa-IR'),
        }))}
        renderActions={(user) => (
            <DropdownMenu
                actions={[
                    { label: 'حذف', onClick: () => handleDelete(user.id), className: 'text-red-500' },
                    { label: 'ویرایش', onClick: () => handleDetails(user.id), className: 'text-blue-500' }
                ]}
            />
        )}
       
      />

      {/* Pagination */}
      <Pagination pageCount={pageCount} currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
};

export default React.memo(UserList);
