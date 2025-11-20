// contexts/AppContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER_ROLE':
            return { ...state, userRole: action.payload };
        case 'SET_DASHBOARD_DATA':
            return { ...state, dashboardData: action.payload };
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, {
        userRole: null,
        dashboardData: {},
        currentModule: 'dashboard'
    });

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);