import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  roles: { name: string }[];
  is_admin: number;
}

interface FilterState {
  role: string;
  type: string;
}

const ITEMS_PER_PAGE = 10; // تعداد آیتم در هر صفحه

const UserList: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]); // همه کاربران
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filters, setFilters] = useState<FilterState>({
    role: '',
    type: ''
  });
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

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      if (response.data) {
        setAllUsers(response.data.data.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('خطا!', 'دریافت کاربران با مشکل مواجه شد.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // فیلتر کردن کاربران بر اساس فیلترهای انتخاب شده
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const roleMatch = filters.role === '' || 
        (filters.role === 'admin' && user.roles.some(r => r.name === 'admin')) ||
        (filters.role === 'editor' && user.roles.some(r => r.name === 'editor')) ||
        (filters.role === 'user' && user.roles.length === 0);

      const typeMatch = filters.type === '' || user.type === filters.type;

      return roleMatch && typeMatch;
    });
  }, [allUsers, filters]);

  // محاسبه کاربران صفحه فعلی
  const currentUsers = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // محاسبه تعداد کل صفحات
  const pageCount = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(0); // برگشت به صفحه اول
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
            await api.delete(`/users/${userId}`);
            setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
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

  const renderFilters = () => (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Role Filter */}
      <div className="flex flex-col gap-2">
        <label htmlFor="roleFilter" className="text-sm font-medium text-gray-700">
          فیلتر بر اساس نقش
        </label>
        <select
          id="roleFilter"
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
          className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary"
        >
          <option value="">همه نقش‌ها</option>
          <option value="admin">ادمین</option>
          <option value="editor">ادیتور</option>
          <option value="user">کاربر عادی</option>
        </select>
      </div>

      {/* Type Filter */}
      <div className="flex flex-col gap-2">
        <label htmlFor="typeFilter" className="text-sm font-medium text-gray-700">
          فیلتر بر اساس نوع کاربر
        </label>
        <select
          id="typeFilter"
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary"
        >
          <option value="">همه انواع</option>
          <option value="gold">طلایی</option>
          <option value="silver">نقره‌ای</option>
          <option value="bronze">برنزی</option>
        </select>
      </div>

      {/* Reset Filters Button */}
      <div className="flex items-end">
        <button
          onClick={() => setFilters({ role: '', type: '' })}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90"
        >
          پاک کردن فیلترها
        </button>
      </div>

     
    </div>
  );

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

      {/* Filters */}
      {renderFilters()}

      <TableComponent
        headers={['ایدی', 'نام', 'ایمیل', 'موبایل', 'نقش‌ها', 'نوع کاربر', 'تاریخ ایجاد']}
        data={currentUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.roles.map(role => role.name).join(', ') || 'کاربر عادی',
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