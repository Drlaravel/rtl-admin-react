import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink } from 'react-router-dom';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu'
const MySwal = withReactContent(Swal);
import { useNavigate } from 'react-router-dom'; 



const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showAlert = useCallback((title, text, icon, confirmButtonText = 'باشه') => {
    return MySwal.fire({
      title,
      text,
      icon,
      confirmButtonText,
    });
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await api.get('/api/projects');
      console.log('API Response:', response.data);

      if (response.data && Array.isArray(response.data.data)) {
        const data = response.data.data;
        console.log('Projects:', projects);
        setProjects(data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      showAlert('خطا!', 'دریافت پروژه‌ها با مشکل مواجه شد.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = useCallback((projectId) => {
    MySwal.fire({
      title: 'آیا از حذف این پروژه مطمئن هستید؟',
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
          await api.delete(`/api/projects/${projectId}`); // استفاده از axios
          setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
          showAlert('حذف شد!', 'پروژه با موفقیت حذف شد.', 'success');
        } catch (error) {
          console.error('Error deleting project:', error);
          showAlert('خطا!', 'حذف پروژه با مشکل مواجه شد.', 'error');
        }
      }
    });
  }, [showAlert]);

  const handleDetails = (projectId) => {
    navigate(`/projects/edit/${projectId}`);
  };


  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="project-list">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">لیست پروژه‌ها</h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <NavLink to="/" className={`font-medium`}>داشبورد</NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={`font-medium`}>پروژه ها</NavLink>
            </li>
            <li>
              <NavLink to="#" className={`font-medium text-primary`}>لیست پروژه‌ها</NavLink>
            </li>
          </ol>
        </nav>
      </div>

      {/* Task Header */}
      <div className="flex flex-col gap-y-4 rounded-sm border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-title-lg font-bold text-black dark:text-white">پروژه‌ها</h3>
        </div>
        <NavLink to="/projects/add" className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80">
          اضافه کردن پروژه
        </NavLink>
      </div>

      {projects.length > 0 ? (
        <div className="mt-9 flex flex-col gap-9">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1170px] text-center">
              {/* Table Header */}
              <div className="grid grid-cols-8 justify-items-center rounded-t-[10px] bg-primary px-5 py-4 lg:px-7.5 2xl:px-11">
                {['نام پروژه', 'نام کارفرما', 'شماره تماس', 'زمان اتمام پروژه', 'وضعیت پروژه', 'هزینه ی کل پروژه', 'هزینه ی پرداخت شده', 'ویرایش'].map((header, idx) => (
                  <div key={idx} className="col">
                    <h5 className="font-medium text-white">{header}</h5>
                  </div>
                ))}
              </div>

              {/* Table Body */}
              <div className="bg-white dark:bg-boxdark rounded-b-[10px]">
                {projects.map((project) => (
                  <div key={project.id} className="grid grid-cols-8 justify-items-center border-t border-[#EEEEEE] px-5 py-4 dark:border-strokedark lg:px-7.5 2xl:px-11">
                    {['name', 'employer', 'contact_number', 'end_date'].map((field, idx) => (
                      <div key={idx} className="col">
                        <p className="text-[#637381] dark:text-bodydark">{project[field]}</p>
                      </div>
                    ))}
                    <div className="col">
                      <button className={`inline-flex rounded px-2 py-1 text-sm font-medium text-white hover:bg-opacity-90 ${getStatusButtonClass(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </button>
                    </div>
                    {['price'].map((field, idx) => (
                      <div key={idx} className="col">
                        <p className="text-[#637381] dark:text-bodydark">{new Intl.NumberFormat().format(project[field])} تومان</p>
                      </div>
                    ))}
                    <div className="col">
                      <p className="text-[#637381] dark:text-bodydark">{new Intl.NumberFormat().format(project.total_paid)} تومان</p>
                    </div>

                    {projects.map((project) => (
                      <div key={project.id} className="project-item">
                        {/* سایر داده‌های پروژه */}
                        <DropdownMenu
                         
                          handleDelete={() => handleDelete(project.id)}
                          handleDetails={() => handleDetails(project.id)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[#637381] dark:text-bodydark">هنوز پروژه‌ای وجود ندارد</p>
      )}
    </div>
  );
};



// توابع کمکی برای استایل و نمایش وضعیت‌ها
const getStatusButtonClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-primary';
    case 'demo':
      return 'bg-[#13C296]';
    case 'prepayment':
      return 'bg-[#EFEFEF] text-[#212B36]';
    case 'learn':
      return 'bg-[#3BA2B8]';
    case 'start':
      return 'bg-[#637381]';
    case 'design':
      return 'bg-[#F9C107] text-[#212B36]';
    default:
      return 'bg-[#637381]';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return 'پرداخت شده';
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
    default:
      return 'نامشخص';
  }
};

export default React.memo(ProjectList);
