import React, { useEffect } from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import { SimpleTable } from '../general/simple-table';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import TextFieldWrapper from '../general/textfield-wrapper';
import SuccessSnackbar from '../settings/settings-success-msg';
import * as Yup from 'yup';
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
 * 
 */
export const SocialAgentSelection = () => {

  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

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

    // Fetch all users associated to a company
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await api.get('/api/v1/users/users-group-by', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(response.data.users);
        } catch (err) {
          console.log(err);
        }
      };
      fetchUsers();
  
    }, [token]);

  // Fetch assigned agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/api/v1/social/agents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAgents(response.data.agents);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAgents();
  }, [token]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/api/v1/social/departments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDepartments(response.data.departments);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDepartments();
  }, [token]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setResponseMessage('');
    // Reset formik values to initial state
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
      console.log('response: ', response);
      setResponseMessage(response.data.message);
      setDepartments(departments.filter((department) => (department.department_id !== formik.values.departmentToDelete)));
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (values) => {
    console.log('values: ', values);
    if(values.agent !== '' && values.department !== '') {
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
        setResponseMessage(response.data.message);
        setAgents([...agents, { agent_id: response.data.user.agent_id, name: response.data.user.name, role: response.data.user.role, department_name: response.data.department.department_name, department_id: response.data.department.department_id }]);
      } catch (err) {
        console.log(err);
      }
    }
    if(values.newDepartment !== ''){
      try {
        const response = await api.post('/api/v1/social/departments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            departmentName: values.newDepartment,
          },
        });
        console.log('response onsubmit: ', response)
        setResponseMessage(response.data.message);
        setDepartments([...departments, { department_id: response.data.addedDepartment._id , department_name: values.newDepartment }]);
        console.log('departments: ', departments)
      } catch (err) {
        console.log(err);
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
          Select Social Agents
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography
            sx={{ ml: 1, mr: 2, mb: 2, mt: 2 }}
            variant="body1"
            gutterBottom
          >
            Assign company users as agents of a department.
          </Typography>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
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
            >
              Add
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
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Grid item xs={6}>
              <TextFieldWrapper
                formik={formik}
                label="New Department"
                name="newDepartment"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={3}>
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
                  sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
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
            but their information won't be erased. 
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
          <SuccessSnackbar responseMessage={responseMessage} />
        )}
      </BootstrapDialog>
    </>
  );
};

