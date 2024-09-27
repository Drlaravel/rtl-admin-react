import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
import Pagination from '../../components/Pagination/Pagination';

const MySwal = withReactContent(Swal);

interface Project {
  id: number;
  name: string;
  employer: string;
  contact_number: string;
  end_date: string;
  status: string;
  price: number;
  total_paid: number;
}

const UserProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  const showAlert = useCallback((title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
    return MySwal.fire({
      title,
      text,
      icon,
      confirmButtonText,
      confirmButtonColor: '#3085d6',
    });
  }, []);

  const fetchProjects = useCallback(async (page = 1) => {
    try {
      const response = await api.get(`/api/user/projects?page=${page}`);
        console.log(response.data.data.data)
        setProjects(response.data.data.data);
        setPageCount(response.data.data.last_page); // تنظیم تعداد صفحات صحیح

    } catch (error) {
      console.error('Error fetching user projects:', error);
      showAlert('خطا!', 'دریافت پروژه‌ها با مشکل مواجه شد.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchProjects(currentPage + 1); // بارگذاری پروژه‌ها بر اساس صفحه جاری
  }, [fetchProjects, currentPage]);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // تنظیم شماره صفحه فعلی
  };

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="project-list">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">لیست پروژه‌های شما</h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <NavLink to="/" className={`font-medium`}>
                داشبورد
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className={`font-medium text-primary`}>
                پروژه‌ها
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>

      <TableComponent<Project>
        headers={[ 'نام پروژه', 'نام کارفرما', 'شماره تماس', 'زمان اتمام پروژه', 'وضعیت پروژه', 'هزینه کل پروژه']}
        data={projects.map((project) => ({

          name: project.name,
          employer: project.employer,
          contact_number: project.contact_number,
          end_date: project.end_date,
          status: getStatusLabel(project.status),
          price: `${new Intl.NumberFormat().format(project.price)} تومان`,

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

// Helper functions
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'تمام شده';
    case 'demo':
      return 'دمو';
    case 'prepayment':
      return 'پیش پرداخت';
    case 'learn':
      return 'آموزش';
    case 'start':
      return 'شروع';
    case 'design':
      return 'شروع طراحی';
      case 'ui':
      return ' طراحی';
    default:
      return 'نامشخص';
  }
};

export default React.memo(UserProjectList);
