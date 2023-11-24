import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import { useFormik } from 'formik';
import { SettingsDialog } from './settings-dialog';
import { SocialGeneralContent } from './social-tabs/general';
import { MetricsContent } from './social-tabs/metrics';
import CompanyContext from '../../../contexts/company-context';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import api from '../../../lib/axios';

const fetchData = async (companyId, token, setState) => {
  const [usersResponse, agentsResponse, departmentsResponse, availableDepartmentsResponse, phoneIdsResponse] = await Promise.all([
    api.get(`/api/v1/${companyId}/users`, { headers: { Authorization: `Bearer ${token}` } }),
    api.get(`/api/v1/${companyId}/social/agents`, { headers: { Authorization: `Bearer ${token}` } }),
    api.get(`/api/v1/${companyId}/social/departments`, { headers: { Authorization: `Bearer ${token}` } }),
    api.get(`/api/v1/${companyId}/social/available-departments`, { headers: { Authorization: `Bearer ${token}` } }),
    api.get(`/api/v1/${companyId}/whatsapp`, { headers: { Authorization: `Bearer ${token}` } })
  ]);

  setState(prevState => ({
    ...prevState,
    users: usersResponse.data.users,
    agents: agentsResponse.data.agents,
    departments: departmentsResponse.data.departments,
    availableDepartments: availableDepartmentsResponse.data.departments,
    availablePhoneNums: phoneIdsResponse.data.availablePhoneNumbers,
    departmentsAllowed: phoneIdsResponse.data.availablePhoneNumbers.length > 0
  }));
};

const fetchAgentsQty = async (companyId, token, agents, setState) => {
  try {
    const response = await api.get(`/api/v1/${companyId}/purchases/active`, { headers: { Authorization: `Bearer ${token}` } });

    if (response && response.data) {
      const activePurchases = response.data.active.filter(purchase => purchase.agents_qty > 0);
      const agentsQty = activePurchases.length > 0 ? activePurchases.reduce((acc, curr) => acc + curr.agents_qty, 0) : 0;
      setState(prevState => ({ ...prevState, agentsAllowed: agentsQty > agents.length }));
    }
  } catch (err) {
    console.log(err);
  }
};
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
  const token = Cookies.get('jwt');
  const { companyId } = useContext(CompanyContext);

  useEffect(() => {
    fetchData(companyId, token, setState);
  }, [token]);

  useEffect(() => {
    fetchAgentsQty(companyId, token, agents, setState);
  }, [token, agents]);

  const handleAgentsDelete = useCallback(async (row) => {
    try {
      const response = await api.delete(`/api/v1/${companyId}/social/agents`, { agentId: row.agent_id, departmentId: row.department_id },
        { headers: { Authorization: `Bearer ${token}` } });

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
      const response = await api.put(`/api/v1/${companyId}/whatsapp`, { departmentId: null },
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { phoneNumberId: phoneId }
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
  }, [token, updatedWabas]);

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

  const handleAddAgent = async () => {
    setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));

    if (formik.values.agent !== '' && formik.values.department !== '') {
      try {
        const response = await api.post(`/api/v1/${companyId}/social/agents`, { userId: formik.values.agent, departmentId: formik.values.department },
          { headers: { Authorization: `Bearer ${token}` } }
        );

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

    formik.resetForm();
  };

  const handleAddDepartment = async () => {
    setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));

    if (formik.values.newDepartment !== '') {
      try {
        const response = await api.post(`/api/v1/${companyId}/social/departments`, { departmentName: formik.values.newDepartment },
          { headers: { Authorization: `Bearer ${token}` } }
        );

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

    formik.resetForm();
  };

  const handleConnectDepartment = async () => {
    setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));

    if (formik.values.availableDepartment !== '' && formik.values.departmentPhoneNumber !== '') {
      try {
        const response = await api.put(`/api/v1/${companyId}/whatsapp`, { departmentId: formik.values.availableDepartment }, 
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { phoneNumberId: formik.values.departmentPhoneNumber }
        });

        if (response.data.success) {
          updatedWabas(formik.values.departmentPhoneNumber, formik.values.availableDepartment);
          setState(prevState => ({
            ...prevState,
            responseMessage: response.data.message,
            availableDepartments: prevState.availableDepartments.filter(department => department.department_id !== formik.values.availableDepartment),
            availablePhoneNums: prevState.availablePhoneNums.filter(phoneNum => phoneNum.phone_id !== formik.values.departmentPhoneNumber),
          }));
        };

      } catch (err) {
        console.log(err);
        setState(prevState => ({ ...prevState, errorMessage: 'An error occurred while processing the request' }));
      }
    }

    formik.resetForm();
  };

  const handleDeleteDepartment = async () => {
    setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));

    if (formik.values.departmentToDelete !== '') {
      try {
        const response = await api.delete(`/api/v1/${companyId}/social/departments`, { departmentId: formik.values.departmentToDelete },
          { headers: { Authorization: `Bearer ${token}` } });

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
  };

  const formik = useFormik({
    initialValues: {
      agent: '',
      department: '',
      availableDepartment: '',
      departmentPhoneNumber: '',
      newDepartment: '',
      departmentToDelete: ''
    },
    onSubmit: () => { }
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
    handleAddAgent={handleAddAgent}
    handleAddDepartment={handleAddDepartment}
    handleConnectDepartment={handleConnectDepartment}
    handleDeleteDepartment={handleDeleteDepartment}
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

SocialSettings.propTypes = {
  wabas: PropTypes.array,
  updatedWabas: PropTypes.func
};