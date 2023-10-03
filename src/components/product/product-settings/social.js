import React, { useEffect, useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import { SimpleTable } from '../../general/simple-table';
import { SettingsDialog } from './settings-dialog';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import TextFieldWrapper from '../../general/textfield-wrapper';
import api from '../../../lib/axios';


export const SocialSettings = () => {
  const [state, setState] = useState({
    users: [],
    agents: [],
    departments: [],
    departmentsAllowed: false,
    agentsAllowed: false,
    responseMessage: '',
    errorMessage: ''
  });

  const { users, agents, departments, departmentsAllowed, agentsAllowed, responseMessage, errorMessage } = state;
  const token = localStorage.getItem('jwt');

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'role', headerName: 'Role', width: 50 },
    { field: 'department', headerName: 'Department', width: 100 },
    { field: 'delete', headerName: '', width: 5 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [usersResponse, agentsResponse, departmentsResponse, phoneIdsResponse] = await Promise.all([
        api.get('/api/v1/users/users-group-by', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/v1/social/agents', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/v1/social/departments', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/v1/whatsapp/business-account', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setState(prevState => ({
        ...prevState,
        users: usersResponse.data.users,
        agents: agentsResponse.data.agents,
        departments: departmentsResponse.data.departments,
        departmentsAllowed: phoneIdsResponse.data.phoneNumberIds > departmentsResponse.data.departments.length
      }));
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchAgentsQty = async () => {
      try {
        const response = await api.get('/api/v1/purchases/active', { headers: { Authorization: `Bearer ${token}` } });

        if (response && response.data) {
          const activePurchases = response.data.active.filter(purchase => purchase.agents_qty > 0);
          const agentsQty = activePurchases.length > 0 ? activePurchases.reduce((acc, curr) => acc + curr.agents_qty, 0) : 0;
          setState(prevState => ({ ...prevState, agentsAllowed: agentsQty > agents.length }));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchAgentsQty();
  }, [token, agents]);

  const handleAgentsDelete = useCallback(async (row) => {
    try {
      const response = await api.delete('/api/v1/social/agents', {
        headers: { Authorization: `Bearer ${token}` },
        data: { agent: row }
      });

      setState(prevState => ({
        ...prevState,
        responseMessage: response.data.message,
        agents: prevState.agents.filter(agent => !(agent.agent_id === row.agent_id && agent.department_id === row.department_id))
      }));
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  const agentRows = useMemo(() => agents.map((agent, index) => ({
    id: index,
    agent_id: agent.agent_id,
    name: agent.name,
    role: agent.role,
    department: agent.department_name,
    department_id: agent.department_id
  })), [agents]);

  const formik = useFormik({
    initialValues: {
      agent: '',
      department: '',
      newDepartment: '',
      departmentToDelete: ''
    },
    onSubmit: async (values) => {
      if (values.agent !== '' && values.department !== '') {
        try {
          const response = await api.post('/api/v1/social/agents', {
            headers: { Authorization: `Bearer ${token}` },
            data: { userId: values.agent, departmentId: values.department }
          });

          if (response.data.success) {
            setState(prevState => ({
              ...prevState,
              responseMessage: response.data.message,
              agents: [...prevState.agents, {
                agent_id: response.data.user.agent_id,
                name: response.data.user.name,
                role: response.data.user.role,
                department_name: response.data.department.department_name,
                department_id: response.data.department.department_id
              }]
            }));
          } else {
            setState(prevState => ({ ...prevState, errorMessage: response.data.message }));
          }
        } catch (err) {
          console.log(err);
          setState(prevState => ({ ...prevState, errorMessage: 'An error occurred while processing the request' }));
        }
      }

      if (values.newDepartment !== '') {
        try {
          const response = await api.post('/api/v1/social/departments', {
            headers: { Authorization: `Bearer ${token}` },
            data: { departmentName: values.newDepartment }
          });

          if (response.data.success) {
            setState(prevState => ({
              ...prevState,
              responseMessage: response.data.message,
              departments: [...prevState.departments, {
                department_id: response.data.addedDepartment._id,
                department_name: values.newDepartment
              }]
            }));
          } else {
            setState(prevState => ({ ...prevState, errorMessage: response.data.message }));
          }
        } catch (err) {
          console.log(err);
          setState(prevState => ({ ...prevState, errorMessage: 'An error occurred while processing the request' }));
        }
      }

      formik.resetForm();
    }
  });

  const handleDepartmentDelete = async () => {
    try {
      const response = await api.delete('/api/v1/social/departments', {
        headers: { Authorization: `Bearer ${token}` },
        data: { departmentId: formik.values.departmentToDelete }
      });

      setState(prevState => ({
        ...prevState,
        responseMessage: response.data.message,
        departments: prevState.departments.filter(department => department.department_id !== formik.values.departmentToDelete)
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const dialogContent = (
    <>
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
      <Alert severity="info" sx={{ ml: 1, mr: 2, mb: 2, mt: 2 }}>
        Please note that in order to create a new department, you must have a phone number available.
        To check your current phone numbers, click <Link href="">here</Link>.
      </Alert>
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
        <SimpleTable columns={columns} rows={agentRows} onDeleteRow={handleAgentsDelete} />
      ) : (
        <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, textAlign: 'center', fontSize: '1.1rem' }} variant="body1" gutterBottom>
          No agents assigned to departments.
        </Typography>
      )}
    </>
  );

  const tabs = [
    { label: 'General', content: dialogContent },
    { label: 'Rooms', content: <div>Rooms content goes here</div> },
];

  return (
    <>
      <SettingsDialog
        response={responseMessage}
        error={errorMessage}
        tabs={tabs}
      />
    </>
  );
};