import React, { useEffect, useState } from 'react';
import api from '../../api/api';

// تایپ کامپوننت
const Dashboard: React.FC = () => {
    // تعریف state با استفاده از تایپ DashboardData یا null
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/dashboard');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Projects</h2>
            <ul>
                {data?.projects.map((project) => (
                    <li key={project.id}>{project.name}</li>
                ))}
            </ul>
            <h2>Invoices</h2>
            <ul>
                {data?.invoices.map((invoice) => (
                    <li key={invoice.id}>Invoice #{invoice.id} - Total: {invoice.total}</li>
                ))}
            </ul>
            <h2>Domains</h2>
            <ul>
                {data?.domains.map((domain) => (
                    <li key={domain.id}>{domain.name}</li>
                ))}
            </ul>
            <h2>Supports</h2>
            <ul>
                {data?.supports.map((support) => (
                    <li key={support.id}>{support.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
