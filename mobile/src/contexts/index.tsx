import { createContext, useEffect, useState } from 'react'
import { DevSettings } from 'react-native';
import { FC, PropsWithChildren } from 'react'
import { useQuery } from '@tanstack/react-query';
import en from "../languages/en";

import { getProfile } from "../services/apis";
import { getData, setData, removeData } from "../hooks/useStorage";

interface MainContextProps {
    isLoading: boolean,
    token: any,
    setToken: (params: object) => Promise<void>,
    user: any,
    labels: any,
    logout: () => Promise<void>
}

export const MainContext = createContext<MainContextProps>({
    isLoading: false,
    token: null,
    setToken: () => Promise.resolve(),
    user: null,
    labels: null,
    logout: () => Promise.resolve(),
})

export const MainProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isLoading] = useState<any>(false)
    const [token, setToken] = useState(null)
    const [labels] = useState(en)
    const [user, setUser] = useState(null)

    const { data, refetch, error } = useQuery({
        queryKey: ['profile', token],
        queryFn: getProfile,
        enabled: !!token,
    })

    useEffect(() => {
        const fetchData = async () => {
            const token = await getData('token')
            if (token) {
                refetch()
                setToken(token)
            } else {
                setToken(null)
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        if (data) {
            if (data.user) {
                setUser(data.user)
            }
        }
        if (error) {
            setData('token', null)
            setToken(null);
            DevSettings.reload();
        }
    }, [data, error]);


    const handleLogout = async () => {
        removeData('token');
        setToken(null);
        DevSettings.reload();
    }

    const handleToken = async (value: any) => {
        setData('token', value)
        setToken(value)
    }

    return (
        <MainContext.Provider value={{ isLoading, labels, token, setToken: handleToken, user, logout: handleLogout }}>
            {children}
        </MainContext.Provider>
    )
}