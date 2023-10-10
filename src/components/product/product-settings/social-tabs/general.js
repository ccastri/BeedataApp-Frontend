import React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import TextFieldWrapper from '../../../general/textfield-wrapper';
import { SimpleTable } from '../../../general/simple-table';


export const GeneralContent = ({ users, agents, departments, departmentsAllowed, agentsAllowed, formik, handleAgentsDelete, handleDepartmentDelete, agentRows }) => {
    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'role', headerName: 'Role', width: 50 },
        { field: 'department', headerName: 'Department', width: 100 },
        { field: 'delete', headerName: '', width: 5 },
    ];

    return (
        <>
            <Typography
                sx={{ ml: 1, mr: 2, mb: 2, mt: 2 }}
                variant="body1"
                gutterBottom
            >
                Assign company users as agents of a department.
            </Typography>
            <Box sx={{ maxHeight: '100px', overflow: 'auto' }}>
                <Alert severity="info" sx={{ width: '100%' }}>
                    Please note that the amount of agents allowed is limited by the Beet Social plan you have purchased.
                </Alert>
            </Box>
            <Grid container spacing={1} justifyContent="center" alignItems="center" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid item xs={6}>
                    <TextFieldWrapper
                        formik={formik}
                        label="Agent"
                        name="agent"
                        sx={{ width: '100%' }}
                        selectOptions={users.map((user) => ({ value: user.id, label: user.name }))}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextFieldWrapper
                        formik={formik}
                        label="Department"
                        name="department"
                        sx={{ width: '100%' }}
                        selectOptions={departments.map((department) => ({ value: department.department_id, label: department.department_name }))}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mr: 0, ml: 'auto' }}>
                <Button
                    onClick={formik.handleSubmit}
                    autoFocus variant="outlined"
                    sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                    disabled={!agentsAllowed}
                >
                    Assign
                </Button>
            </Box>
            <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }} variant="subtitle2">
                Department
            </Typography>
            <Typography color="textSecondary" variant="body1" sx={{ ml: 1, mb: 2 }}>
                Create a new department or delete any department that is no longer needed.
            </Typography>
            <Box sx={{ maxHeight: '100px', overflow: 'auto' }}>
                <Alert severity="info" sx={{ ml: 1, mr: 2, mt: 2, width: '100%' }}>
                    Please note that in order to create a new department, you must have a phone number available.
                    To check your current phone numbers, click <Link href="">here</Link>.
                </Alert>
            </Box >
            <Grid container spacing={1} justifyContent="center" alignItems="center" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid item xs={6}>
                    <TextFieldWrapper
                        formik={formik}
                        label="Department"
                        name="departmentConnect"
                        sx={{ width: '100%' }}
                        selectOptions={departments.map((department) => ({ value: department.department_id, label: department.department_name }))}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextFieldWrapper
                        formik={formik}
                        label="Phone Number"
                        name="departmentPhoneNumber"
                        sx={{ width: '100%' }}
                        selectOptions={departments.map((department) => ({ value: department.department_id, label: department.department_name }))}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mr: 0, ml: 'auto' }}>
                <Button
                    onClick={() => console.log('Button clicked!')}
                    autoFocus variant="outlined"
                    sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                    disabled={!departmentsAllowed}
                >
                    Connect
                </Button>
            </Box>
            <Grid container spacing={1} justifyContent="center" alignItems="center" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid item xs={6}>
                    <TextFieldWrapper
                        formik={formik}
                        label="New Department"
                        name="newDepartment"
                        sx={{ width: '100%' }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mr: 0, ml: 'auto' }}>
                        <Button
                            onClick={() => console.log('Button clicked!')}
                            autoFocus variant="outlined"
                            sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                            disabled={!departmentsAllowed}
                        >
                            Add
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={1} justifyContent="center" alignItems="center" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid item xs={6}>
                    <TextFieldWrapper
                        formik={formik}
                        label="Choose a Department"
                        name="departmentToDelete"
                        sx={{ width: '100%' }}
                        selectOptions={departments.map((department) => ({ value: department.department_id, label: department.department_name }))}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mr: 0, ml: 'auto' }}>
                        <Button onClick={handleDepartmentDelete} autoFocus variant="outlined" sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}>
                            Delete
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }} variant="subtitle2">
                Current Agents
            </Typography>
            <Typography color="textSecondary" variant="body1" sx={{ ml: 1, mb: 3 }}>
                Check the current agents assigned to company departments.
                Each agent can be unassigned at any time by clicking the delete button,
                but their information won&apos;t be erased.
                Once unassigned, an agent can be assigned to another department as needed.
            </Typography>
            {agents.length !== 0 ? (
                <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    <SimpleTable columns={columns} rows={agentRows} onDeleteRow={handleAgentsDelete} />
                </Box>
            ) : (
                <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, textAlign: 'center', fontSize: '1.1rem' }} variant="body1" gutterBottom>
                    No agents assigned to departments.
                </Typography>
            )}
        </>
    );
};

GeneralContent.propTypes = {
    users: PropTypes.array.isRequired,
    agents: PropTypes.array.isRequired,
    departments: PropTypes.array.isRequired,
    departmentsAllowed: PropTypes.bool.isRequired,
    agentsAllowed: PropTypes.bool.isRequired,
    formik: PropTypes.object.isRequired,
    handleAgentsDelete: PropTypes.func.isRequired,
    handleDepartmentDelete: PropTypes.func.isRequired,
    agentRows: PropTypes.array.isRequired,
};
