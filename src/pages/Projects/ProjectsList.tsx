import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';
import Pagination from '../../components/Pagination/Pagination'; // Import the Pagination component

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

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageCount, setPageCount] = useState<number>(0); // State to manage total pages
    const navigate = useNavigate();

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
            const response = await api.get(`/api/projects?page=${page}`);
            if (response.data && Array.isArray(response.data.data)) {
                setProjects(response.data.data);
                setPageCount(response.data.meta.last_page); // Set the correct number of pages
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
        fetchProjects(currentPage + 1); // Fetch projects based on the current page
    }, [fetchProjects, currentPage]);

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected); // Update the current page
    };

    const handleDelete = useCallback((projectId: number) => {
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
                    await api.delete(`/api/projects/${projectId}`);
                    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
                    showAlert('حذف شد!', 'پروژه با موفقیت حذف شد.', 'success');
                } catch (error) {
                    console.error('Error deleting project:', error);
                    showAlert('خطا!', 'حذف پروژه با مشکل مواجه شد.', 'error');
                }
            }
        });
    }, [showAlert]);

    const handleDetails = (projectId: number) => {
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

            <TableComponent<Project>
                headers={['ایدی', 'نام پروژه', 'نام کارفرما', 'شماره تماس', 'زمان اتمام پروژه', 'وضعیت پروژه', 'هزینه ی کل پروژه', 'هزینه ی پرداخت شده',]}
                data={projects.map(project => ({
                    id: project.id,
                    name: project.name,
                    employer: project.employer,
                    contact_number: project.contact_number,
                    end_date: project.end_date,
                    status: getStatusLabel(project.status),
                    price: `${new Intl.NumberFormat().format(project.price)} تومان`,
                    total_paid: `${new Intl.NumberFormat().format(project.total_paid)} تومان`,
                }))}
                renderActions={(project) => (
                    <DropdownMenu
                        actions={[
                            { label: 'حذف', onClick: () => handleDelete(project.id), className: 'text-red-500' },
                            { label: 'ویرایش', onClick: () => handleDetails(project.id), className: 'text-blue-500' }
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

export default React.memo(ProjectList);
