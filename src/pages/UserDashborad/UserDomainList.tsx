import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
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

const UserDomainList: React.FC = () => {
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
                const response = await api.get(`/api/user/domains?page=${page}`);
                console.log(response.data)

                    setDomains(response.data.data.data);
                    setPageCount(response.data.data.last_page); // تنظیم تعداد صفحات صحیح

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
                            <NavLink to="#" className={`font-medium text-primary`}>
                                لیست دامنه‌ها
                            </NavLink>
                        </li>
                    </ol>
                </nav>
            </div>

            <TableComponent
                headers={['ایدی', 'نام دامنه', 'تاریخ انقضا', 'تاریخ یادآوری', 'نوع خرید', 'قیمت', 'یاداوری']}
                data={domains.map((domain) => ({
                    id: domain.id,
                    domain_name: domain.name,
                    expiry_date: domain.expiry_date,
                    reminder_date: domain.reminder_date,
                    purchase_type: domain.purchase_type === 'ours' ? 'خریداری شده توسط تهران سایت' : 'خریداری شده توسط مشتری',
                    price: domain.price ? `${new Intl.NumberFormat().format(domain.price)} تومان` : 'رایگان',
                    reminder: domain.reminder ? 'معتبر' : 'غیرمعتبر(نیاز به تمدید)',
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

export default React.memo(UserDomainList);
