import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.svg';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import MenuIcon from '../icons/MenuIcon';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const { pathname } = useLocation();
    const trigger = useRef<HTMLButtonElement | null>(null);
    const sidebar = useRef<HTMLElement | null>(null);

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(storedSidebarExpanded === 'true');

    useEffect(() => {
        const clickHandler = (event: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (!sidebarOpen || sidebar.current.contains(event.target as Node) || trigger.current.contains(event.target as Node)) return;
            setSidebarOpen(false);
        };

        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [sidebarOpen, setSidebarOpen]);

    useEffect(() => {
        const keyHandler = (event: KeyboardEvent) => {
            if (sidebarOpen && event.key === 'Escape') setSidebarOpen(false);
        };

        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    }, [sidebarOpen, setSidebarOpen]);

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
        document.body.classList.toggle('sidebar-expanded', sidebarExpanded);
    }, [sidebarExpanded]);

    const handleSidebarToggle = (handleClick: () => void) => {
        if (sidebarExpanded) {
            handleClick();
        } else {
            setSidebarExpanded(true);
        }
    };

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <header className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <NavLink to="/user/">
                    <img src={Logo} alt="Logo" />
                </NavLink>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(prev => !prev)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <MenuIcon className="fill-current" />
                </button>
            </header>

            <nav className="overflow-x-auto  mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                <ul>
                    <li>
                        <NavLink
                            to="/user/"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mb-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                        >
                            صفحه ی اصلی
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/user/projects/list"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mb-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}

                        >
                            پروژه ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/user/domains/list"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mb-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}

                        >
                            لیست دامنه ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/user/hosts/list"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mb-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}

                        >
                            لیست هاست ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/user/supports/list"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mb-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}

                        >
                            لیست پشتیبانی ها
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/user/invoices/list"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mb-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}

                        >
                            لیست فاکتورها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/user/notification"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mt-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                        >
                            اعلان ها
                        </NavLink>
                    </li>


                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
