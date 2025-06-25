import React, { useState, useEffect } from 'react';
import { getUserAccount } from '../services/userService';

const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
    const userDefault = {
        isLoading: true,
        isAuthenticated: false,
        token: '',
        account: {}
    };

    const [user, setUser] = useState(userDefault);

    const loginContext = (userData) => {
        setUser({ ...userData, isLoading: false });
    };

    const logoutContext = () => {
        setUser({ ...userDefault, isLoading: false });
    };

    const fetchUser = async () => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            setUser({ ...userDefault, isLoading: false });
            return;
        }

        try {
            const response = await getUserAccount();
            if (response && response.EC === 0) {
                const { groupWithRoles, email, username, access_token } = response.DT;
                const data = {
                    isAuthenticated: true,
                    token: access_token,
                    account: { groupWithRoles, email, username },
                    isLoading: false
                };
                setUser(data);
            } else {
                setUser({ ...userDefault, isLoading: false });
            }
        } catch (e) {
            setUser({ ...userDefault, isLoading: false });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt');

        // Nếu không có token thì không cần fetch
        if (!token) {
            setUser(prev => ({ ...prev, isLoading: false }));
            return;
        }

        // Nếu có token thì luôn fetch để xác thực
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loginContext, logoutContext }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
