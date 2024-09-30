import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';
import Pagination from '../../components/Pagination/Pagination';

const MySwal = withReactContent(Swal);

interface Host {
  id: number;
  username: string;
  password: string;
  link: string;
  expiry_date: string;
  reminder_date: string;
  space: string;
  company_name: string;
  price: number;
  purchase_type: 'ours' | 'customer';
  reminder: boolean;
}

const HostList: React.FC = () => {
  const [hosts, setHosts] = useState<Host[]>([]);
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

  const fetchHosts = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get(`/api/hosts?page=${page}`);
        console.log(response.data)
        if (response.data && Array.isArray(response.data.data)) {
          setHosts(response.data.data);
          setPageCount(response.data.meta.last_page); // تنظیم تعداد صفحات صحیح
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching hosts:', error);
        showAlert('خطا!', 'دریافت هاست‌ها با مشکل مواجه شد.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [showAlert]
  );

  useEffect(() => {
    fetchHosts(currentPage + 1); // بارگذاری هاست‌ها بر اساس صفحه جاری
  }, [fetchHosts, currentPage]);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // تنظیم شماره صفحه فعلی
  };

  const handleDelete = useCallback(
    (hostId: number) => {
      MySwal.fire({
        title: 'آیا از حذف این هاست مطمئن هستید؟',
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
            await api.delete(`/api/hosts/${hostId}`);
            setHosts((prevHosts) => prevHosts.filter((host) => host.id !== hostId));
            showAlert('حذف شد!', 'هاست با موفقیت حذف شد.', 'success');
          } catch (error) {
            console.error('Error deleting host:', error);
            showAlert('خطا!', 'حذف هاست با مشکل مواجه شد.', 'error');
          }
        }
      });
    },
    [showAlert]
  );

  const handleDetails = (hostId: number) => {
     navigate(`/admin/hosts/edit/${hostId}`);
  };

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="host-list">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">لیست هاست‌ها</h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <NavLink to="/" className={`font-medium`}>
                داشبورد
              </NavLink>
            </li>
            <li>
              <NavLink to="/hosts" className={`font-medium`}>
                هاست‌ها
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className={`font-medium text-primary`}>
                لیست هاست‌ها
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>

      <TableComponent
        headers={['ایدی', 'نام کاربری', 'لینک', 'تاریخ انقضا', 'تاریخ یادآوری', 'فضا', 'قیمت', 'نوع خرید', 'یاداوری']}
        data={hosts.map((host) => ({
          id: host.id,
          username: host.username,
          link: <a href={host.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">لینک</a>,
          expiry_date: host.expiry_date,
          reminder_date: host.reminder_date,
          space: host.space,
          price: host.price ? `${new Intl.NumberFormat().format(host.price)} تومان` : 'رایگان',
          purchase_type: host.purchase_type === 'ours' ? 'خریداری شده توسط ما' : 'خریداری شده توسط مشتری',
          reminder: host.reminder ? 'معتبر' : 'غیرمعتبر(نیاز به تمدید)',
        }))}
      
        renderActions={(host) => (
            <DropdownMenu
                actions={[
                    { label: 'حذف', onClick: () => handleDelete(host.id), className: 'text-red-500' },
                    { label: 'ویرایش', onClick: () => handleDetails(host.id), className: 'text-blue-500' }
                ]}
            />
        )}
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

export default React.memo(HostList);
