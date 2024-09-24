import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/api';
import TableComponent from '../../components/TableComponent/TableComponent';
import Pagination from '../../components/Pagination/Pagination';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Notification {
    id: number;
    message: string;
    created_at: string;
    is_read: boolean;
    project?: { name: string } | null;
    domain?: { name: string } | null;
    host?: { name: string } | null;
    support?: { name: string } | null;
    payment?: { amount: string } | null;
}

const NotificationTable: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageCount, setPageCount] = useState<number>(0);

    const fetchNotifications = useCallback(async (page = 1) => {
        try {
            const response = await api.get(`/api/notifications?page=${page}`);
            console.log(response.data.data)
            setNotifications(response.data.data);
            setPageCount(response.data.last_page);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            MySwal.fire('خطا!', 'دریافت نوتیفیکیشن‌ها با مشکل مواجه شد.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications(currentPage + 1);
    }, [fetchNotifications, currentPage]);

    const markAsRead = async (notificationId: number) => {
        try {
            await api.post(`/api/notifications/${notificationId}/read`);
            MySwal.fire('موفق!', 'وضعیت نوتیفیکیشن تغییر کرد شد.', 'success');
            fetchNotifications(currentPage + 1); // به‌روز رسانی پس از موفقیت
        } catch (error) {
            console.error('Error marking notification as seen:', error);
            MySwal.fire('خطا!', 'ثبت نوتیفیکیشن به عنوان دیده شده با مشکل مواجه شد.', 'error');
        }
    };

    if (loading) {
        return <p>در حال بارگذاری...</p>;
    }

    return (
        <div className="notification-list">
            <h2 className="text-title-md2 font-bold mb-6">لیست نوتیفیکیشن‌ها</h2>

            <TableComponent<Notification>
                headers={['ایدی', 'پیام', 'زمان', 'مربوط به', 'وضعیت']}
                data={notifications.map((notification) => ({
                    id: notification.id,
                    message: notification.message,
                    created_at: new Date(notification.created_at).toLocaleDateString('fa-IR'),
                    related: notification.project?.name ||
                        notification.domain?.name ||
                        notification.host?.name ||
                        notification.support?.name ||
                        notification.payment?.amount || 'نامشخص',
                    is_read: notification.is_read ? <span className='inline-flex rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90'>دیده شده</span> : <span className='inline-flex rounded bg-[#DC3545] py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90'>دیده نشده</span>,
                }))}

                renderActions={(notification) => (

                    <button
                        onClick={() => markAsRead(notification.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      تغییر وضعیت
                    </button>



                )}
            />

            <Pagination
                pageCount={pageCount}
                currentPage={currentPage}
                onPageChange={(selectedPage: { selected: number }) => setCurrentPage(selectedPage.selected)}
            />
        </div>
    );
};

export default NotificationTable;
