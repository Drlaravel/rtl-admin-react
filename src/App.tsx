// App.tsx
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext'



import NotFoundPage from './pages/NotFoundPage';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import UserLayout from './layout/UserLayout';
import SignIn from './pages/Authentication/SignIn';

import ECommerce from './pages/Dashboard/ECommerce';

import Profile from './pages/Profile';
import ProjectAdd from './pages/Projects/ProjectAdd';
import ProjectsList from './pages/Projects/ProjectsList';
import ProjectEdit from './pages/Projects/ProjectEdit';

import DomainsList from './pages/Domains/DomainsList';
import DomainAdd from './pages/Domains/DomainAdd';
import DomainEdit from './pages/Domains/DomainEdit';

import HostsList from './pages/Hosts/HostsList';
import HostAdd from './pages/Hosts/HostAdd';
import HostEdit from './pages/Hosts/HostEdit';

import SupportsList from './pages/Supports/SupportsList';
import SupportAdd from './pages/Supports/SupportAdd';
import SupportEdit from './pages/Supports/SupportEdit';

import InvoicesList from './pages/Invoices/InvoicesList';
import InvoiceAdd from './pages/Invoices/InvoiceAdd';
import InvoiceEdit from './pages/Invoices/InvoiceEdit';
import InvoicePage from './pages/Invoices/InvoicePage';
import InvoiceLogs from './pages/Invoices/InvoiceLogs';
import AdminRoute from './auth/AdminRoute'

import NotificationList from './pages/Notification/NotificationList';

import UsersList from './pages/Users/UsersList';
import UserAdd from './pages/Users/UserAdd';
import UserEdit from './pages/Users/UserEdit';

import SmsesList from './pages/Smses/SmsesList';
import SmsAdd from './pages/Smses/SmsAdd';
import SmsSetting from './pages/Smses/SmsSetting';

import PrivateRoute from './api/PrivateRoute';
import LogPage from './pages/LogPage';





/////////////////

import Dashboard from './pages/UserDashborad';
import UserDomainList from './pages/UserDashborad/UserDomainList';
import UserHostsList from './pages/UserDashborad/UserHostsList';
import UserSupportsList from './pages/UserDashborad/UserSupportsList';
import UserInvoiceList from './pages/UserDashborad/UserInvoiceList';
import UserProjectsList from './pages/UserDashborad/UserProjectsList';




function App() {
    const [loading, setLoading] = useState<boolean>(true);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <AuthProvider>
             
            <Routes>
                {/* مسیرهای عمومی (بدون نیاز به احراز هویت) */}
                <Route
                    path="/auth/signin"
                    element={
                        <>
                            <PageTitle title="ورود به crm اختصاصی تهران سایت" />
                            <SignIn />
                        </>
                    }
                />

<Route
                    path="/"
                    element={
                        <>
                            <PageTitle title="ورود به crm اختصاصی تهران سایت" />
                            <SignIn />
                        </>
                    }
                />

                <Route element={<PrivateRoute />}>
                    <Route path="user" element={<UserLayout />}>
                        <Route
                            index
                            element={
                                <>
                                    <PageTitle title="پنل کاربران تهران سایت" />
                                    <Dashboard />
                                </>
                            }
                        />

                        <Route
                            path="domains/list"
                            element={<UserDomainList />
                            }
                        />

                        <Route
                            path="hosts/list"
                            element={<UserHostsList />
                            }
                        />


                        <Route
                            path="supports/list"
                            element={<UserSupportsList />
                            }
                        />

                        <Route
                            path="invoices/list"
                            element={<UserInvoiceList />
                            }
                        />
                        <Route path="projects/list" element={<UserProjectsList />} />

                    </Route>







                </Route>



                {/* مسیرهای محافظت‌شده */}
                <Route element={<AdminRoute />}>
                    <Route path="admin" element={<DefaultLayout />}>
                        {/* مسیرهای محافظت‌شده داخل DefaultLayout */}
                        <Route
                            index
                            element={
                                <>
                                    <PageTitle title="صفحه ی اصلی " />
                                    <ECommerce />
                                </>
                            }
                        />

                        <Route
                            path="profile"
                            element={
                                <>
                                    <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                                    <Profile />
                                </>
                            }
                        />


                        <Route path="projects/list" element={<ProjectsList />} />
                        <Route path="projects/add" element={<ProjectAdd />} />
                        <Route path="projects/edit/:projectId" element={<ProjectEdit />} />

                        <Route path="domains/list" element={<DomainsList />} />
                        <Route path="domains/add" element={<DomainAdd />} />
                        <Route path="domains/edit/:id" element={<DomainEdit />} />

                        <Route path="hosts/list" element={<HostsList />} />
                        <Route path="hosts/add" element={<HostAdd />} />
                        <Route path="hosts/edit/:id" element={<HostEdit />} />

                        <Route path="supports/list" element={<SupportsList />} />
                        <Route path="supports/add" element={<SupportAdd />} />
                        <Route path="supports/edit/:id" element={<SupportEdit />} />

                        <Route path="invoices/list" element={<InvoicesList />} />
                        <Route path="invoices/add" element={<InvoiceAdd />} />
                        <Route path="invoices/edit/:id" element={<InvoiceEdit />} />
                        <Route path="invoices/view/:id" element={<InvoicePage />} />
                        <Route path="invoices/logs" element={<InvoiceLogs />} />

                        <Route path="notification" element={<NotificationList />} />


                        <Route path="users/list" element={<UsersList />} />
                        <Route path="users/add" element={<UserAdd />} />
                        <Route path="users/edit/:id" element={<UserEdit />} />

                        <Route path="sms/logs" element={<SmsesList />} />
                        <Route path="sms/add" element={<SmsAdd />} />
                        <Route path="sms/setting" element={<SmsSetting />} />

                        <Route path="log-viewer" element={<LogPage />} />
                    </Route>
                </Route>
            </Routes>
        </AuthProvider >
    );
}

export default App;
