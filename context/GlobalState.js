import Cookies from 'js-cookie';
import React, { createContext, useEffect, useReducer } from 'react';
import DBService from '../services/DB.service';
import reducersForm from './ReducersForm';
import reducersList from './ReducersList';
import reducersPage from './ReducersPage';

export const AppContext = createContext();

export const DataProvider = ({ user, error, children }) => {
    const initialState = {
        darkTheme: false,
        storeObjects: [],
        objectFormType: '',
        validSections: [],
        departments: [],
        updateObjectId: Cookies.get('updateObjectId') || '',
        forms: [{ 'update/person': [] }, { 'update/structure': [] }],
        savingSections: [],
    };

    const initialStateList = {
        exportMode: false,
        selectionToExport: [],
    };

    const initialStatePage = {
        sideMode: 'on',
        spinner: false,
        printPage: null,
        accordionSkeleton: [],
        accordionItems: [],
        modalDetail: {
            title: '',
            open: false,
            content: null,
        },
        hasBreadCrumbs: false,
        pageTheme: 'transparent',
        error: error || null,
        user: user || {},
        userConnected: user && Object.keys(user).length > 0,
    };

    const [stateForm, dispatchForm] = useReducer(reducersForm, initialState);
    const [stateList, dispatchList] = useReducer(
        reducersList,
        initialStateList
    );
    const [statePage, dispatchPage] = useReducer(
        reducersPage,
        initialStatePage
    );

    const cbInit = (storeObjects) => {
        dispatchForm({
            type: 'UPDATE_INDB_STORE_OBJECTS',
            payload: { storeObjects },
        });
    };

    useEffect(() => {
        DBService.init(['update/person', 'update/structure'], cbInit);
    }, []);

    return (
        <AppContext.Provider
            value={{
                stateForm,
                dispatchForm,
                stateList,
                dispatchList,
                statePage,
                dispatchPage,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
