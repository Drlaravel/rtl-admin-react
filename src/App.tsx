import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import ProjectAdd from './pages/Projects/ProjectAdd';
import ProjectsList from './pages/Projects/ProjectsList';
import ProjectEdit from './pages/Projects/ProjectEdit';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';


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


import UsersList from './pages/Users/UsersList';
import UserAdd from './pages/Users/UserAdd';
import UserEdit from './pages/Users/UserEdit';


// import SmsesList from './pages/Smses/SmsesList';
// import SmsAdd from './pages/Smses/SmsAdd';
// import LogViewer from './pages/LogViewer';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />

        <Route path="/projects/list" element={<ProjectsList />} />
        <Route path="/projects/add" element={<ProjectAdd />} />
        <Route path="/projects/edit/:projectId" element={<ProjectEdit />} />
       <Route path="/domains/list" element={<DomainsList />} />
        <Route path="/domains/add" element={<DomainAdd />} />
        <Route path="/domains/edit/:id" element={<DomainEdit />} />
        <Route path="/hosts/list" element={<HostsList />} />
        <Route path="/hosts/add" element={<HostAdd />} />
        <Route path="/hosts/edit/:id" element={<HostEdit />} />

        <Route path="/supports/list" element={<SupportsList />} />
        <Route path="/supports/add" element={<SupportAdd />} />
        <Route path="/supports/edit/:id" element={<SupportEdit />} />

         <Route path="/invoices/list" element={<InvoicesList />} />
        <Route path="/invoices/add" element={<InvoiceAdd />} />
        <Route path="/invoices/edit/:id" element={<InvoiceEdit />} />

         <Route path="/users/list" element={<UsersList />} />
        <Route path="/users/add" element={<UserAdd />} />
        <Route path="/users/edit/:id" element={<UserEdit />} />


       {/* <Route path="/smses/list" element={<SmsesList />} />
        <Route path="/smses/add" element={<SmsAdd />} />
        <Route path="/log-viewer" element={<LogViewer />} /> */}
      </Routes>
    </DefaultLayout>
  );
}

export default App;
