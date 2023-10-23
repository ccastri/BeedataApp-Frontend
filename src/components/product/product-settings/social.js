import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFormik } from 'formik';
import { SettingsDialog } from './settings-dialog';
import { SocialGeneralContent } from './social-tabs/general';
import { MetricsContent } from './social-tabs/metrics';
import api from '../../../lib/axios';


export const SocialSettings = ({ wabas, updatedWabas }) => {
  const [state, setState] = useState({
    users: [],
    agents: [],
    departments: [],
    availableDepartments: [],
    availablePhoneNums: [],
    departmentsAllowed: false,
    agentsAllowed: false,
    responseMessage: '',
    errorMessage: ''
  });

  const { users, agents, departments, availableDepartments, availablePhoneNums, departmentsAllowed, agentsAllowed, responseMessage, errorMessage } = state;
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchData = async () => {
      const [usersResponse, agentsResponse, departmentsResponse, availableDepartmentsResponse, phoneIdsResponse] = await Promise.all([
        api.get('/api/v1/users/users-group-by', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/v1/social/agents', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/v1/social/departments', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/v1/social/available-departments', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/v1/whatsapp/business-account', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const phoneNumbers = phoneIdsResponse.data.availablePhoneNumbers; // Calculate once

      setState(prevState => ({
        ...prevState,
        users: usersResponse.data.users,
        agents: agentsResponse.data.agents,
        departments: departmentsResponse.data.departments,
        availableDepartments: availableDepartmentsResponse.data.departments,
        availablePhoneNums: phoneNumbers, // Set the calculated value
        departmentsAllowed: phoneNumbers.length > 0 // Update based on the calculated value
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

  const handleDisconnect = useCallback(async (phoneId, phoneNumber, department, departmentId) => {
    try {
      console.log(phoneId, phoneNumber, department, departmentId);
      const response = await api.put('/api/v1/whatsapp/business-account', {
        headers: { Authorization: `Bearer ${token}` },
        data: { phoneNumberId: phoneId, departmentId: null }
      });

      if (response.data.success) {
        updatedWabas(phoneId);
        setState(prevState => ({
          ...prevState,
          responseMessage: response.data.message,
          availableDepartments: [...prevState.availableDepartments, {
            department_id: departmentId,
            department_name: department
          }],
          availablePhoneNums: [...prevState.availablePhoneNums, {
            phone_id: phoneId,
            phone_number: phoneNumber
          }]
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          errorMessage: response.data.message
        }));
      }
    } catch (error) {
      console.log(error);
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

  const departmentRows = useMemo(() => {
    const filteredWabas = wabas.filter(waba => waba.department_id !== null && waba.department_id !== '');
    return filteredWabas.map((waba, index) => ({
      id: index,
      departmentId: waba.department_id,
      department: departments.length > 0 ? departments.find(department => department.department_id === waba.department_id).department_name : '',
      phone: waba.phone_number,
      phoneId: waba.phone_id,
      status: 'Connected',
    }));
  }, [wabas, departments]);

  const formik = useFormik({
    initialValues: {
      agent: '',
      department: '',
      availableDepartment: '',
      departmentPhoneNumber: '',
      newDepartment: '',
      departmentToDelete: ''
    },
    onSubmit: async (values) => {
      setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));

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
      if (values.availableDepartment !== '' && values.departmentPhoneNumber !== '') {
        try {
          const response = await api.put('/api/v1/whatsapp/business-account', {
            headers: { Authorization: `Bearer ${token}` },
            data: { phoneNumberId: values.departmentPhoneNumber, departmentId: values.availableDepartment }
          });

          if (response.data.success) {
            updatedWabas(values.departmentPhoneNumber, values.availableDepartment);
            setState(prevState => ({
              ...prevState,
              responseMessage: response.data.message,
              availableDepartments: prevState.availableDepartments.filter(department => department.department_id !== values.availableDepartment),
              availablePhoneNums: prevState.availablePhoneNums.filter(phoneNum => phoneNum.phone_id !== values.departmentPhoneNumber),
            }));
          };

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
                department_name: response.data.addedDepartment.name
              }],
              availableDepartments: [...prevState.availableDepartments, {
                department_id: response.data.addedDepartment._id,
                department_name: response.data.addedDepartment.name
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

      if (values.departmentToDelete !== '') {
        try {
          const response = await api.delete('/api/v1/social/departments', {
            headers: { Authorization: `Bearer ${token}` },
            params: { departmentId: formik.values.departmentToDelete }
          });

          if (response.data.success) {
            const newPhoneNum = response.data.availablePhoneNum;
            const phoneNums = prevState.availablePhoneNums;
            const phoneNumsSet = new Set(phoneNums);
            if (!phoneNumsSet.has(newPhoneNum)) {
              phoneNums.push(newPhoneNum);
            }
            setState(prevState => ({
              ...prevState,
              responseMessage: response.data.message,
              departments: prevState.departments.filter(department => department.department_id !== formik.values.departmentToDelete),
              availableDepartments: prevState.availableDepartments.filter(department => department.department_id !== formik.values.departmentToDelete),
              availablePhoneNums: phoneNums
            }));
            formik.resetForm();
          } else {
            setState(prevState => ({ ...prevState, errorMessage: response.data.message }));
          }
        } catch (err) {
          console.log(err);
        }
      }

      formik.resetForm();
    }
  });

  const clearMessages = () => {
    setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));
  };

  const generalContent = <SocialGeneralContent
    users={users}
    agents={agents}
    departments={departments}
    availableDepartments={availableDepartments}
    availablePhoneNums={availablePhoneNums}
    departmentsAllowed={departmentsAllowed}
    agentsAllowed={agentsAllowed}
    formik={formik}
    agentRows={agentRows}
    departmentRows={departmentRows}
    handleAgentsDelete={handleAgentsDelete}
    handleDisconnect={handleDisconnect}
  />

  const metricsContent = <MetricsContent
    agents={agents}
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


