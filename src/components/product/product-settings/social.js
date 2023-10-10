import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import { SettingsDialog } from './settings-dialog';
import { GeneralContent } from './social-tabs/general';
import { MetricsContent } from './social-tabs/metrics';
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
        departmentsAllowed: phoneIdsResponse.data.phoneNumberIds.length > departmentsResponse.data.departments.length
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
      departmentConnect: '',
      departmentPhoneNumber: '',
      newDepartment: '',
      departmentToDelete: ''
    },
    validate: (values) => {
      const errors = {};
    
      if (values.agent && !values.department) {
        errors.department = 'Department is required';
      }
    
      if (values.newDepartment && !values.departmentPhoneNumber) {
        errors.departmentPhoneNumber = 'Phone number is required';
      }
    
      if (values.department && !values.agent) {
        errors.agent = 'Agent is required';
      }
    
      if (values.departmentPhoneNumber && !values.newDepartment) {
        errors.newDepartment = 'Department is required';
      }
    
      return errors;
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
      if (values.departmentConnect !== '' && values.departmentPhoneNumber !== '') {
        try {
          const response = await api.put('/api/v1/whatsapp/business-account', {
            headers: { Authorization: `Bearer ${token}` },
            data: { phoneNumberId: values.departmentPhoneNumber, departmentId: values.departmentConnect }
          });

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

  const clearMessages = () => {
    setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));
  };

  const generalContent = <GeneralContent
    users={users}
    agents={agents}
    departments={departments}
    departmentsAllowed={departmentsAllowed}
    agentsAllowed={agentsAllowed}
    formik={formik}
    agentRows={agentRows}
    handleAgentsDelete={handleAgentsDelete}
    handleDepartmentDelete={handleDepartmentDelete}
  />

  const metricsContent = <MetricsContent
    agents={agents}
    departments={departments}
  />

  const tabs = [
    { label: 'General', content: generalContent },
    { label: 'Metrics', content: metricsContent },
  ];

  return (
    <>
      <SettingsDialog
        response={responseMessage}
        error={errorMessage}
        tabs={tabs}
        clearMessages={clearMessages}
      />
    </>
  );
};


