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
      className={`absolute right-0 top-0 z-[9999] flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <header className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
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

      <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
        <ul>
          <li>
            <NavLink
              to="/"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mb-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}
            >
              صفحه ی اصلی
            </NavLink>
          </li>

          <SidebarLinkGroup activeCondition={pathname.startsWith('/projects')}>
            {(handleClick, open) => (
              <>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mt-3 ${pathname.startsWith('/project') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSidebarToggle(handleClick);
                  }}
                >
                  پروژه ها
                  <ArrowDownIcon className={`absolute left-4 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                </NavLink>
                <div className={`translate transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                  <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                    <li>
                      <NavLink
                        to="/projects/list"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        لیست پروژه ها
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/projects/add"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        پروژه ی جدید
                      </NavLink>
                    </li>


                    
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.startsWith('/domains')}>
            {(handleClick, open) => (
              <>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mt-3 ${pathname.startsWith('/domains') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSidebarToggle(handleClick);
                  }}
                >
                  دامنه ها
                  <ArrowDownIcon className={`absolute left-4 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                </NavLink>
                <div className={`translate transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                  <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                    <li>
                      <NavLink
                        to="/domains/list"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        لیست دامنه ها
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/domains/add"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        دامنه ی جدید
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.startsWith('/hosts')}>
            {(handleClick, open) => (
              <>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mt-3 ${pathname.startsWith('/hosts') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSidebarToggle(handleClick);
                  }}
                >
                  هاست ها
                  <ArrowDownIcon className={`absolute left-4 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                </NavLink>
                <div className={`translate transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                  <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                    <li>
                      <NavLink
                        to="/hosts/list"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        لیست هاست ها
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/hosts/add"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        هاست جدید
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.startsWith('/supports')}>
            {(handleClick, open) => (
              <>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mt-3 ${pathname.startsWith('/supports') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSidebarToggle(handleClick);
                  }}
                >
                  پشتیبانی ها
                  <ArrowDownIcon className={`absolute left-4 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                </NavLink>
                <div className={`translate transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                  <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                    <li>
                      <NavLink
                        to="/supports/list"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        لیست پشتیبانی ها
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/supports/add"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        پشتیبانی جدید
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.startsWith('/invoices')}>
            {(handleClick, open) => (
              <>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mt-3 ${pathname.startsWith('/invoices') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSidebarToggle(handleClick);
                  }}
                >
                  فاکتورها
                  <ArrowDownIcon className={`absolute left-4 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                </NavLink>
                <div className={`translate transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                  <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                    <li>
                      <NavLink
                        to="/invoices/list"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        لیست فاکتورها
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/invoices/add"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        فاکتور جدید
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.startsWith('/users')}>
            {(handleClick, open) => (
              <>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mt-3 ${pathname.startsWith('/users') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSidebarToggle(handleClick);
                  }}
                >
                  کاربرها
                  <ArrowDownIcon className={`absolute left-4 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                </NavLink>
                <div className={`translate transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                  <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                    <li>
                      <NavLink
                        to="/users/list"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        لیست کاربرها
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/users/add"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        کاربر جدید
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup activeCondition={pathname.startsWith('/smses')}>
            {(handleClick, open) => (
              <>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mt-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSidebarToggle(handleClick);
                  }}
                >
                  پیام ها
                  <ArrowDownIcon className={`absolute left-4 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                </NavLink>
                <div className={`translate transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                  <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                    <li>
                      <NavLink
                        to="/sms/logs"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        لیست پیام ها
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/sms/add"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        پیام  جدید
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/sms/setting"
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive ? '!text-white' : ''}`
                        }
                      >
                        تنظیمات پیام ها 
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>
          <li>
            <NavLink
              to="/log-viewer"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mt-3 ${pathname.startsWith('/smses') ? 'bg-graydark dark:bg-meta-4' : ''}`}
            >
              لاگ ها
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
