import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const PrivateRoute: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext || !authContext.authToken) {
        return <Navigate to="/auth/signin" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
