import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';
import Pagination from '../../components/Pagination/Pagination';

const MySwal = withReactContent(Swal);

interface Support {
  id: number;
  project_id: number | null;
  user_id: number | null;
  name: string;
  status: 'yes' | 'no';
  duration: '6months' | '12months';
  price: number | null;
  expiry_date: string | null;
  reminder: boolean;
  project_name: string | null;
  user_name: string | null;
  created_at: string;
  updated_at: string;
}

const UserSupportsList: React.FC = () => {
  const [supports, setSupports] = useState<Support[]>([]);
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

  const fetchSupports = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get(`/api/user/supports?page=${page}`);
        console.log(response.data); // بررسی داده‌های دریافتی

          setSupports(response.data.data.data);
          setPageCount(response.data.data.last_page); // تنظیم تعداد صفحات صحیح

      } catch (error) {
        console.error('Error fetching supports:', error);
        showAlert('خطا!', 'دریافت پشتیبانی‌ها با مشکل مواجه شد.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [showAlert]
  );

  useEffect(() => {
    fetchSupports(currentPage + 1); // بارگذاری پشتیبانی‌ها بر اساس صفحه جاری
  }, [fetchSupports, currentPage]);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // تنظیم شماره صفحه فعلی
  };


  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="support-list">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">لیست پشتیبانی‌ها</h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <NavLink to="/" className={`font-medium`}>
                داشبورد
              </NavLink>
            </li>

            <li>
              <NavLink to="#" className={`font-medium text-primary`}>
                لیست پشتیبانی‌ها
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>

      <TableComponent<Support>
        headers={['نام پشتیبانی', 'وضعیت', 'مدت زمان', 'قیمت', 'تاریخ انقضا', 'یاداوری']}
        data={supports.map((support) => ({

          
          support_name: support.name,
          status: support.status === 'yes' ? 'فعال' : 'غیرفعال',
          duration: support.duration === '6months' ? '6 ماه' : '12 ماه',
          price: support.price ? `${new Intl.NumberFormat().format(support.price)} تومان` : 'رایگان',
          expiry_date: support.expiry_date ? support.expiry_date : 'نامشخص',
          reminder: support.reminder ? 'فعال' : 'غیرفعال',
        }))}

      />

      {/* Pagination */}
      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default React.memo(UserSupportsList);
