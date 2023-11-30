import Head from 'next/head';
import { DashboardLayout } from '../components/general/dashboard-layout';
import { useState, useEffect, useContext } from 'react';
import { UsersTable } from '../components/users/users-table';
import { CompanyTable } from '../components/users/company-table';
import { RegistrationDialog } from '../components/users/registration-dialog';
import CompanyContext from '../contexts/company-context';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import api from '../lib/axios';


const fetchUsers = async (companyId, token) => {
    try {
        const response = await api.get(`/api/v1/${companyId}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.success) {
            return response.data.users;
        }
    } catch (err) {
        console.log(err);
    }
    return [];
};

const fetchPartners = async (token) => {
    try {
        const response = await api.get('/api/v1/companies', { headers: { Authorization: `Bearer ${token}` } });

        if (response.data.success) {
            console.log(response.data);
            return response.data.companies;
        }

    } catch (err) {
        console.log(err);
    }
    return [];
};

const fetchAdmins = async (companyId, token) => {
    try {
        const response = await api.get(`/api/v1/${companyId}/users/admins`, { headers: { Authorization: `Bearer ${token}` } });

        if (response.data.success) {
            return response.data.admins;
        }

    } catch (err) {
        console.log(err);
    }
    return [];
};

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [partners, setPartners] = useState([]);
    const [admins, setAdmins] = useState([]);

    const { companyId } = useContext(CompanyContext);
    const token = Cookies.get('jwt');

    useEffect(() => {
        const getUsers = async () => {
            const users = await fetchUsers(companyId, token);
            const partners = await fetchPartners(token);
            const admins = await Promise.all(partners.map(partner => fetchAdmins(partner.id, token)));
            setUsers(users);
            setPartners(partners);
            setAdmins(admins);
            setLoading(false);
        };
        getUsers();
    }, [companyId, token]);
    
    const deleteUsers = async (userIds) => {
        const token = Cookies.get('jwt');
        await Promise.all(userIds.map((userId) => api.delete(`/api/v1/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })));

        setUsers(users.filter((user) => !userIds.includes(user.id)));
    };

    const deleteCompanies = async (companyIds) => {};

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress
                    data-testid='loading'
                />
            </Box>
        );
    }

    return (
        <>
            <Head>
                <title>Beet | Users</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 15
                }}
            >
                <Container sx={{ paddingLeft: 36, paddingRight: 36 }}>
                    <Grid container
                        spacing={3}
                        justifyContent="center"
                    >
                        <Grid item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                        >
                            <Card sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <RegistrationDialog companyId={companyId} role={'user'} />
                            </Card>
                        </Grid>
                        <Grid item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                        >
                            <UsersTable users={users} deleteUsers={deleteUsers} />
                        </Grid>
                        <Grid item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                        >
                            <Card sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <RegistrationDialog companyId={companyId} role={'admin'} />
                            </Card>
                        </Grid>
                        <Grid item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                        >
                            <CompanyTable partners={partners} admins={admins} deleteCompanies={deleteCompanies} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;