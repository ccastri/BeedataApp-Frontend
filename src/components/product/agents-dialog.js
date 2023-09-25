import React, { useEffect } from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import { SimpleTable } from '../general/simple-table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import TextFieldWrapper from '../general/textfield-wrapper';
import SuccessSnackbar from '../settings/settings-success-msg';
import ErrorSnackbar from '../settings/settings-error-msg';
import api from '../../lib/axios';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ ml: 2, mr: 2, p: 2 }}
      {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 4,
            top: 12,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

/**
 * SocialAgentSelection component that displays a dialog to handle
 * company Beet social agents.
 * 
 * Dependencies: useState, useEffect, styled, useFormik, SimpleTable, Alert,
 *               Button, Box, Dialog, DialogTitle, DialogContent, Grid, Link,
 *              IconButton, CloseIcon, Typography, PropTypes, TextFieldWrapper,
 *             SuccessSnackbar, ErrorSnackbar, api.
 * Usage: Used to display a dialog to handle company social agents.
 */
export const SocialAgentSelection = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentsAllowed, setDepartmentsAllowed] = useState(false);
  const [agentsAllowed, setAgentsAllowed] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const token = localStorage.getItem('jwt');

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'role', headerName: 'Role', width: 50 },
    { field: 'department', headerName: 'Department', width: 100 },
    { field: 'delete', headerName: '', width: 5 },
  ];

  const agentRows = agents.map((agent, index) => ({
    id: index,
    agent_id: agent.agent_id,
    name: agent.name,
    role: agent.role,
    department: agent.department_name,
    department_id: agent.department_id,
  }));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/v1/users/users-group-by', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response && response.data) {
          setUsers(response.data.users);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/api/v1/social/agents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response && response.data) {
          setAgents(response.data.agents);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchAgents();
  }, [token]);

  useEffect(() => {
    const fetchAgentsQty = async () => {
      try {
        const response = await api.get('/api/v1/purchases/active', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response && response.data) {
          const activePurchases = response.data.active.filter((purchase) => purchase.agents_qty > 0);
          const agentsQty = activePurchases.length > 0 ? activePurchases.reduce((acc, curr) => acc + curr.agents_qty, 0) : 0;
          setAgentsAllowed(agentsQty > agents.length);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchAgentsQty();
  }, [token, agents]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/api/v1/social/departments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response && response.data) {
          setDepartments(response.data.departments)
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchDepartments();
  }, [token]);

  useEffect(() => {
    const fetchPhoneIds = async () => {
      try {
        const response = await api.get('/api/v1/whatsapp/business-account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response && response.data) {
          setDepartmentsAllowed(response.data.phoneNumberIds > departments.length)
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPhoneIds();
  }, [token, departments.length]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setResponseMessage('');
    formik.resetForm();
  };

  const handleAgentsDelete = async (row) => { 
    try {
      const response = await api.delete('/api/v1/social/agents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          agent: row,
        },
      });
      setResponseMessage(response.data.message);
      setAgents(agents.filter((agent) => !(agent.agent_id === row.agent_id && agent.department_id === row.department_id)));

    } catch (err) {
      console.log(err);
    }
  };

  const handleDepartmentDelete = async () => {
    try {
      const response = await api.delete('/api/v1/social/departments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          departmentId: formik.values.departmentToDelete,
        },
      });
      setResponseMessage(response.data.message);
      setDepartments(departments.filter((department) => (department.department_id !== formik.values.departmentToDelete)));
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (values) => {
    if (values.agent !== '' && values.department !== '') {
      try {
        const response = await api.post('/api/v1/social/agents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            userId: values.agent,
            departmentId: values.department,
          },
        });
        if (response.data.success) {
          setResponseMessage(response.data.message);
          setAgents([...agents, {
            agent_id: response.data.user.agent_id,
            name: response.data.user.name,
            role: response.data.user.role,
            department_name: response.data.department.department_name,
            department_id: response.data.department.department_id
          }]);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setErrorMessage(response.data.message);
        }
      } catch (err) {
        console.log(err);
        setErrorMessage('An error occurred while processing the request');
      }
    }
    if (values.newDepartment !== '') {
      try {
        const response = await api.post('/api/v1/social/departments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            departmentName: values.newDepartment,
          },
        });
        if (response.data.success) {
          setResponseMessage(response.data.message);
          setDepartments([...departments, {
            department_id: response.data.addedDepartment._id,
            department_name: values.newDepartment
          }]);
        } else {
          setErrorMessage(response.data.message);
        }
      } catch (err) {
        console.log(err);
        setErrorMessage('An error occurred while processing the request');
      }
    }
    // Reset formik values to initial state
    formik.resetForm();
  };

  // Formik initial values and validation
  const formik = useFormik({
    initialValues: {
      agent: '',
      department: '',
      newDepartment: '',
      departmentToDelete: '',
    },
    onSubmit
  });

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        fullWidth
        sx={{ ml: 4, mr: 4, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
      >
        Agents
      </Button>
      <BootstrapDialog onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        <BootstrapDialogTitle
          sx={{ p: 2, fontSize: '1.6rem', backgroundColor: '#111827', color: '#FFFFFF' }}
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Assign Beet Social Agents
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography
            sx={{ ml: 1, mr: 2, mb: 2, mt: 2 }}
            variant="body1"
            gutterBottom
          >
            Assign company users as agents of a department.
          </Typography>
          <Alert severity="info">
            Please note that the amount of agents allowed is limited by the Beet Social plan you have purchased.
          </Alert>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Grid item
xs={6}>
              <TextFieldWrapper
                formik={formik}
                label="Agent"
                name="agent"
                sx={{ width: '100%' }}
                selectOptions={users.map((user) => ({ value: user.id, label: user.name }))}
              />
            </Grid>
            <Grid item
xs={6}>
              <TextFieldWrapper
                formik={formik}
                label="Department"
                name="department"
                sx={{ width: '100%' }}
                selectOptions={departments.map((department) => ({ value: department.department_id, label: department.department_name }))}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
              mr: 0,
              ml: 'auto',
            }}
          >
            <Button
              onClick={formik.handleSubmit}
              autoFocus
              variant="outlined"
              sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
              disabled={!agentsAllowed}
            >
              Assign
            </Button>
          </Box>
          <Typography
            sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
            variant="subtitle2"
          >
            Department
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
            sx={{ ml: 1, mb: 2 }}
          >
            Create a new department or delete any department that is no longer needed.
          </Typography>
          <Alert 
            severity="info"
            sx={{ ml: 1, mr: 2, mb: 2, mt: 2 }}
          >
            Please note that in order to create a new department, you must have a phone number available.
            To check your current phone numbers, click <Link href="">here</Link>.
          </Alert>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 1,
                  mr: 0,
                  ml: 'auto',
                }}
              >
                <Button
                  onClick={formik.handleSubmit}
                  autoFocus
                  variant="outlined"
                  sx={{
                    ml: 2,
                    mr: 2,
                    mb: 2,
                    mt: 2,
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
                  }}
                  disabled={!departmentsAllowed}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 1,
                  mr: 0,
                  ml: 'auto',
                }}
              >
                <Button
                  onClick={handleDepartmentDelete}
                  autoFocus
                  variant="outlined"
                  sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Typography
            sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
            variant="subtitle2"
          >
            Current Agents
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
            sx={{ ml: 1, mb: 3 }}
          >
            Check the current agents assigned to company departments.
            Each agent can be unassigned at any time by clicking the delete button,
            but their information won&apos;t be erased.
            Once unassigned, an agent can be assigned to another department as needed.
          </Typography>
          {agents.length !== 0 ? (
            <SimpleTable
              columns={columns}
              rows={agentRows}
              onDeleteRow={handleAgentsDelete}
            />
          ) : (
            <Typography
              sx={{
                ml: 1,
                mr: 2,
                mb: 2,
                mt: 2,
                textAlign: 'center',
                fontSize: '1.1rem',
              }}
              variant="body1"
              gutterBottom
            >
              No agents assigned to departments.
            </Typography>
          )}
        </DialogContent>
        {responseMessage && (
          <SuccessSnackbar
            responseMessage={responseMessage}
            variant='filled'
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          />
        )}
        {errorMessage && (
          <ErrorSnackbar
            errorMessage={errorMessage}
            variant='filled'
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          />
        )}
      </BootstrapDialog>
    </>
  );
};

