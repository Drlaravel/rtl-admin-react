import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';
import Pagination from '../../components/Pagination/Pagination';

const MySwal = withReactContent(Swal);

interface Domain {
    id: number;
    project_id: number;
    user_id: number;
    name: string;
    expiry_date: string;
    reminder_date: string;
    purchase_type: 'ours' | 'customer';
    reminder: boolean;
    price: number | null;
    user_name: string | null;
    project_name: string | null;
}

const DomainList: React.FC = () => {
    const [domains, setDomains] = useState<Domain[]>([]);
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

    const fetchDomains = useCallback(
        async (page = 1) => {
            try {
                const response = await api.get(`/api/domains?page=${page}`);
                console.log(response.data)
                if (response.data && Array.isArray(response.data.data)) {
                    setDomains(response.data.data);
                    setPageCount(response.data.meta.last_page); // تنظیم تعداد صفحات صحیح
                } else {
                    throw new Error('Invalid response structure');
                }
            } catch (error) {
                console.error('Error fetching domains:', error);
                showAlert('خطا!', 'دریافت دامنه‌ها با مشکل مواجه شد.', 'error');
            } finally {
                setLoading(false);
            }
        },
        [showAlert]
    );

    useEffect(() => {
        fetchDomains(currentPage + 1); // بارگذاری دامنه‌ها بر اساس صفحه جاری
    }, [fetchDomains, currentPage]);

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected); // تنظیم شماره صفحه فعلی
    };

    const handleDelete = useCallback(
        (domainId: number) => {
            MySwal.fire({
                title: 'آیا از حذف این دامنه مطمئن هستید؟',
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
                        await api.delete(`/api/domains/${domainId}`);
                        setDomains((prevDomains) => prevDomains.filter((domain) => domain.id !== domainId));
                        showAlert('حذف شد!', 'دامنه با موفقیت حذف شد.', 'success');
                    } catch (error) {
                        console.error('Error deleting domain:', error);
                        showAlert('خطا!', 'حذف دامنه با مشکل مواجه شد.', 'error');
                    }
                }
            });
        },
        [showAlert]
    );

    const handleDetails = (domainId: number) => {
         navigate(`/admin/domains/edit/${domainId}`);
    };

    if (loading) {
        return <p>در حال بارگذاری...</p>;
    }

    return (
        <div className="domain-list">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-bold text-black dark:text-white">لیست دامنه‌ها</h2>
                <nav>
                    <ol className="flex items-center gap-2">
                        <li>
                            <NavLink to="/" className={`font-medium`}>
                                داشبورد
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/domains" className={`font-medium`}>
                                دامنه ها
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="#" className={`font-medium text-primary`}>
                                لیست دامنه‌ها
                            </NavLink>
                        </li>
                    </ol>
                </nav>
            </div>

            <TableComponent
                headers={['ایدی', 'نام پروژه/کاربر', 'نام دامنه', 'تاریخ انقضا', 'تاریخ یادآوری', 'نوع خرید', 'قیمت', 'یاداوری']}
                data={domains.map((domain) => ({
                    id: domain.id,
                    name: domain.project_name || domain.user_name,
                    domain_name: domain.name,
                    expiry_date: domain.expiry_date,
                    reminder_date: domain.reminder_date,
                    purchase_type: domain.purchase_type === 'ours' ? 'خریداری شده توسط ما' : 'خریداری شده توسط مشتری',
                    price: domain.price ? `${new Intl.NumberFormat().format(domain.price)} تومان` : 'رایگان',
                    reminder: domain.reminder ? 'معتبر' : 'غیرمعتبر(نیاز به تمدید)',
                }))}
                renderActions={(domain) => (
                    <DropdownMenu
                        actions={[
                            { label: 'حذف', onClick: () => handleDelete(domain.id), className: 'text-red-500' },
                            { label: 'ویرایش', onClick: () => handleDetails(domain.id), className: 'text-blue-500' }
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

export default React.memo(DomainList);
