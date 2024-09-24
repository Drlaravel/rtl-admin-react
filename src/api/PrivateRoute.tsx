import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Loader from '../common/Loader';
import api from '../api/api';

const PrivateRoute: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (authContext?.authToken) {
                try {
                    const response = await api.get('/api/me', {
                        headers: {
                            Authorization: `Bearer ${authContext.authToken}`,
                        },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, [authContext]);

    if (loading) {
        return <Loader />;
    }

    return authContext?.authToken ? (
        <Outlet context={{ user }} />
    ) : (
        <Navigate to="/auth/signin" />
    );
};

export default PrivateRoute;
