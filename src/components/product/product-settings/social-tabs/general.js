import React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import TextFieldWrapper from '../../../general/textfield-wrapper';
import { AgentsTable } from './agents-table';
import { DepartmentsTable } from './department-table';


export const SocialGeneralContent = ({ users, agents, departments, availableDepartments, availablePhoneNums, departmentsAllowed, agentsAllowed, formik, handleAgentsDelete, agentRows, departmentRows, handleDisconnect }) => {
    const availDeptSelectOpts = availableDepartments.length === 0
        ? [{ value: "", label: "No available departments" }]
        : availableDepartments.map((department) => ({ value: department.department_id, label: department.department_name }));

    const availPhonesSelectOpts = availablePhoneNums.length === 0
        ? [{ value: "", label: "No available phone numbers" }]
        : availablePhoneNums.map((phone) => ({ value: phone.phone_id, label: phone.phone_number }));

    return (
        <>
            <Card>
                <CardContent>
                    <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
variant="subtitle2"
data-testid='agents-config'>
                        Agents
                    </Typography>
                    <Typography color="textSecondary"
variant="body1"
sx={{ ml: 1, mb: 3 }}>
                        Assign company users as agents of a department.
                    </Typography>
                    <Box sx={{ maxHeight: '100px', overflow: 'auto' }}>
                        <Alert severity="info"
sx={{ width: '100%' }}>
                            Please note that the amount of agents allowed is limited by the Beet Social plan you have purchased.
                        </Alert>
                    </Box>
                    <Grid container
spacing={1}
alignItems="center"
justifyContent="space-between">
                        <Grid item
xs={5}>
                            <TextFieldWrapper
                                formik={formik}
                                label="Agent"
                                name="agent"
                                sx={{ width: '100%' }}
                                selectOptions={users.map((user) => ({ value: user.id, label: user.name }))}
                            />
                        </Grid>
                        <Grid item
xs={5}>
                            <TextFieldWrapper
                                formik={formik}
                                label="Department"
                                name="department"
                                sx={{ width: '100%' }}
                                selectOptions={departments.map((department) => ({ value: department.department_id, label: department.department_name }))}
                            />
                        </Grid>
                        <Grid item
xs={2}
sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={formik.handleSubmit}
                                autoFocus
                                variant="outlined"
                                sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                                disabled={!agentsAllowed}
                            >
                                Assign
                            </Button>
                        </Grid>
                    </Grid>
                    <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
variant="subtitle2"
data-testid='current-agents'>
                        Current Agents
                    </Typography>
                    <Typography color="textSecondary"
variant="body1"
sx={{ ml: 1, mb: 3 }}>
                        Check the current agents assigned to company departments.
                        Each agent can be unassigned at any time by clicking the delete button,
                        but their information won&apos;t be erased.
                        Once unassigned, an agent can be assigned to another department as needed.
                    </Typography>
                    {agents.length !== 0 ? (
                        <AgentsTable rows={agentRows}
onDeleteRow={handleAgentsDelete} />
                    ) : (
                        <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, textAlign: 'center', fontSize: '1.1rem' }}
variant="body1"
gutterBottom>
                            No agents assigned to departments.
                        </Typography>
                    )}
                </CardContent>
            </Card>
            <Card sx={{ mt: 3, maxHeight: '800px', overflow: 'auto' }}>
                <CardContent>
                    <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
variant="subtitle2"
data-testid='department-config'>
                        Department
                    </Typography>
                    <Typography color="textSecondary"
variant="body1"
sx={{ ml: 1, mb: 2 }}>
                        Connect a phone number to a department, create a new department or delete any department that is no longer needed.
                    </Typography>
                    <Box sx={{ maxHeight: '100px', overflow: 'auto' }}>
                        <Alert severity="info"
sx={{ ml: 1, mr: 2, mt: 2, width: '100%' }}>
                            Please note that in order to create a new department, you must have a phone number available.
                            To check your current phone numbers, click <Link href="">here</Link>.
                        </Alert>
                    </Box >
                    <Grid container
spacing={1}
justifyContent="center"
alignItems="center"
sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item
xs={5}>
                            <TextFieldWrapper
                                formik={formik}
                                label="Department"
                                name="availableDepartment"
                                sx={{ width: '100%' }}
                                selectOptions={availDeptSelectOpts}
                            />
                        </Grid>
                        <Grid item
xs={5}>
                            <TextFieldWrapper
                                formik={formik}
                                label="Phone Number"
                                name="departmentPhoneNumber"
                                sx={{ width: '100%' }}
                                selectOptions={availPhonesSelectOpts}
                            />
                        </Grid>
                        <Grid item
xs={2}
sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={formik.handleSubmit}
                                autoFocus
                                variant="outlined"
                                sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                                disabled={availDeptSelectOpts.length === 0 || availPhonesSelectOpts.length === 0}
                            >
                                Connect
                            </Button>
                        </Grid>
                    </Grid>
                    <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
variant="subtitle2"
data-testid='current-departments'>
                        Current Connected Departments
                    </Typography>
                    <Typography color="textSecondary"
variant="body1"
sx={{ ml: 1, mb: 3 }}>
                        Check the current departments connected to phone numbers.
                        Each department can be disconnected at any time by clicking the disconnect button,
                        but their information won&apos;t be erased.
                    </Typography>
                    <DepartmentsTable departmentRows={departmentRows}
handleDisconnect={handleDisconnect} />
                </CardContent>
            </Card>
            <Card sx={{ mt: 3, mb: 8, maxHeight: '400px', overflow: 'auto' }}>
                <CardContent>
                    <Grid container
spacing={1}
justifyContent="center"
alignItems="center"
sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item
xs={6}>
                            <TextFieldWrapper
                                formik={formik}
                                label="New Department"
                                name="newDepartment"
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                        <Grid item
xs={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mr: 0, ml: 'auto' }}>
                                <Button
                                    onClick={formik.handleSubmit}
                                    autoFocus
variant="outlined"
                                    sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)', width: '23%' }}
                                    disabled={!departmentsAllowed}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container
spacing={1}
justifyContent="center"
alignItems="center"
sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item
xs={6}>
                            <TextFieldWrapper
                                formik={formik}
                                label="Choose a Department"
                                name="departmentToDelete"
                                sx={{ width: '100%' }}
                                selectOptions={departments.map((department) => ({ value: department.department_id, label: department.department_name }))}
                            />
                        </Grid>
                        <Grid item
xs={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mr: 0, ml: 'auto' }}>
                                <Button onClick={formik.handleSubmit}
autoFocus
variant="outlined"
sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)', width: '23%' }}>
                                    Delete
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};

SocialGeneralContent.propTypes = {
    users: PropTypes.array.isRequired,
    agents: PropTypes.array.isRequired,
    departments: PropTypes.array.isRequired,
    departmentsAllowed: PropTypes.bool.isRequired,
    agentsAllowed: PropTypes.bool.isRequired,
    formik: PropTypes.object.isRequired,
    handleAgentsDelete: PropTypes.func.isRequired,
    agentRows: PropTypes.array.isRequired,
};
