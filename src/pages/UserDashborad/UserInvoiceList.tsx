// src/pages/UserInvoiceList.tsx

import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
import Pagination from '../../components/Pagination/Pagination';

const MySwal = withReactContent(Swal);

interface Invoice {
    id: number;
    title: string;
    amount: string;
    status: 'paid' | 'pending' | 'rejected';
    payment_type: 'cash' | 'check' | 'installment';
    due_date: string | null;
    created_at: string;
    project_name: string | null;
    domain_name: string | null;
    support_name: string | null;
}

const UserInvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
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

    const fetchInvoices = useCallback(
        async (page = 1) => {
            try {
                const response = await api.get(`/api/user/invoices?page=${page}`);
                console.log(response)
                setInvoices(response.data.invoices);
                // setPageCount(response.data.data.last_page);

            } catch (error) {
                console.error('Error fetching invoices:', error);
                showAlert('خطا!', 'دریافت فاکتورها با مشکل مواجه شد.', 'error');
            } finally {
                setLoading(false);
            }
        },
        [showAlert]
    );

    useEffect(() => {
        fetchInvoices(currentPage + 1);
    }, [fetchInvoices, currentPage]);

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected);
    };

    if (loading) {
        return <p>در حال بارگذاری...</p>;
    }

    return (
        <div className="invoice-list">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-bold text-black dark:text-white">لیست فاکتورها</h2>
                <nav>
                    <ol className="flex items-center gap-2">
                        <li>
                            <NavLink to="/" className={`font-medium`}>
                                داشبورد
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="#" className={`font-medium text-primary`}>
                                فاکتورها
                            </NavLink>
                        </li>
                    </ol>
                </nav>
            </div>

            <TableComponent
                headers={['عنوان', 'مبلغ', 'وضعیت', 'نوع پرداخت', 'تاریخ سررسید', 'نام پروژه/دامنه/پشتیبانی']}
                data={invoices.map((invoice) => ({

                    title: invoice.title,
                    amount: `${new Intl.NumberFormat().format(Number(invoice.amount))} تومان`,
                    status: invoice.status === 'paid' ? 'پرداخت شده' : invoice.status === 'pending' ? 'در انتظار' : 'رد شده',
                    payment_type: invoice.payment_type === 'cash' ? 'نقدی' : invoice.payment_type === 'check' ? 'چک' : 'قسطی',
                    due_date: invoice.due_date || 'نامشخص',
                    project_domain_support: invoice.project_name || invoice.domain_name || invoice.support_name || 'بدون نام',
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

export default React.memo(UserInvoiceList);
