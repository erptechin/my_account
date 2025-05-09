import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';

import { MainContext } from "../contexts";
import { showMessage, showError, login, logOut, changePassword, signUp } from '../services/apis';

export const useSignUp = (onSuccessCallback: any) => {
    return useMutation({
        mutationFn: signUp,
        onSuccess: (data: any) => {
            if (data) showMessage(data?.message);
            onSuccessCallback(data)
        },
        onError: (error: any) => {
            showError(error)
        },
    });
};

export const useLogin = (onSuccessCallback: any) => {
    const { setToken, setUser } = useContext(MainContext)
    return useMutation({
        mutationFn: login,
        onSuccess: (data: any) => {
            setToken(data?.token)
            setUser(data?.user)
            onSuccessCallback(data)
        },
        onError: (error: any) => {
            showError(error)
        },
    });
};

export const useLogOut = () => {
    const { logout } = useContext(MainContext)
    return useMutation({
        mutationFn: logOut,
        onSuccess: () => {
            logout()
        },
        onError: (error: any) => {
            logout()
            showError(error)
        },
    });
};

export const useChangePassword = (onSuccessCallback: any) => {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: (data: any) => {
            if (data.message.status === "failed") {
                showMessage(data?.message?.message, "error");
            } else {
                onSuccessCallback(data)
                showMessage(data?.message?.message);
            }
        },
        onError: (error: any) => {
            showError(error)
        },
    });
};