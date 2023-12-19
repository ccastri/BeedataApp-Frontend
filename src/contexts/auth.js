import React, { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { ...state, token: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children, initialState = { token: null }  }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (token) => {
    let expires = new Date();
    expires.setTime(expires.getTime() + (5 * 60 * 60 * 1000));
    Cookies.set('jwt', token, { path: '/', secure: true, expires: expires });
    dispatch({ type: 'LOGIN', payload: token });
  };

  const logout = () => {
    Cookies.remove('jwt');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ token: state.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};