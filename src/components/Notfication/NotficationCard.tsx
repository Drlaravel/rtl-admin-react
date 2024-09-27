import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ClickOutside from '../ClickOutside';
import api from '../../api/api';



const NotficationCard = () => {


    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifying, setNotifying] = useState(true);
    const [notifications, setNotifications] = useState([]);


    useEffect(() => {

            const fetchNotifications = async () => {
                try {
                    const response = await api.get('/api/notifications');
                    setNotifications(response.data.data);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            fetchNotifications();

    }, []);


    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">

            <div
                className="relative"
            >
                <div className="px-4.5 py-1">
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                        اعلان ها
                    </h4>
                </div>

                <ul className="flex h-auto flex-col overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <li key={notification.id}>
                                <Link
                                    className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                                    to={notification.link || '#'}
                                >
                                    <p className="text-sm">
                                        <span className="text-black dark:text-white">
                                            {notification.message}
                                        </span>
                                    </p>
                                    <p className="text-xs">
                                        {new Date(notification.created_at).toLocaleDateString('fa-IR')}
                                    </p>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li>
                            <p className="text-sm text-center py-4">هیچ نوتیفیکیشنی یافت نشد.</p>
                        </li>
                    )}
                </ul>
            </div>

        </div>
    );
};

export default NotficationCard;
