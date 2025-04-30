import axios from "axios";
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';
import { Buffer } from 'buffer';

import { getData } from "@/src/hooks/useStorage";
import { Config } from "@/src/common";

export const apiClient = axios.create({
    baseURL: `${Config.REACT_APP_BASE_URL}/api/`,
    headers: {
        "Accept": "application/json"
    },
});

export const getAuthorizationToken = async () => {
    const token = await getData('token')
    if (token) {
        let decodedToken;
        if (Platform.OS === 'web') {
            decodedToken = new TextDecoder("utf-8").decode(
                Uint8Array.from(atob(token), c => c.charCodeAt(0))
            );
        } else {
            decodedToken = Buffer.from(token, 'base64').toString('utf-8');
        }
        apiClient.defaults.headers['Authorization'] = `token ${decodedToken}`
    }
}

export const showMessage = (data: any, type: any = null) => {
    if (type == "error") {
        Toast.show({
            type: 'error',
            text1: data,
        });
    } else {
        Toast.show({
            type: 'success',
            text1: data,
        });
    }
};

export const showError = (error: any) => {
    if (error?.response?.data?.message) {
        Toast.show({
            type: 'error',
            text1: error.response.data.message,
        });
    } else if (error?.response?.data?._server_messages) {
        const server_messages = JSON.parse(error?.response?.data?._server_messages)
        const messages = JSON.parse(server_messages[0])
        Toast.show({
            type: 'error',
            text1: messages.message,
        });
    } else {
        Toast.show({
            type: 'error',
            text1: error?.message,
        });
    }
};

export const signUp = async (body: any) => {
    body['company'] = Config.REACT_APP_COMPANY
    const response = await apiClient.post(`method/my_account.api.auth.sign_up`, body);
    return response.data;
};

export const login = async (params: any) => {
    params['company'] = Config.REACT_APP_COMPANY
    const response = await apiClient.get(`method/my_account.api.auth.login`, { params });
    return response.data;
};

export const logOut = async () => {
    const response = await apiClient.post(`method/logout`, { withCredentials: false });
    return response.data;
};


export const changePassword = async (body: any) => {
    await getAuthorizationToken()
    const response = await apiClient.post(`method/my_account.api.auth.change_password`, body);
    return response.data;
};

export const getProfile = async (params: any) => {
    await getAuthorizationToken()
    try {
        const response = await apiClient.get(`method/my_account.api.auth.profile`, params);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProfile = async (body: any) => {
    await getAuthorizationToken()
    const response = await apiClient.post(`method/my_account.api.auth.update_profile`, body);
    return response.data.message;
};


export const getInfo = async (params: any) => {
    await getAuthorizationToken()
    const response = await apiClient.get(`method/my_account.api.doctype.list_info`, { params });
    return response?.data?.data
};

export const getListData = async (params: any) => {
    await getAuthorizationToken()
    const response = await apiClient.get(`method/my_account.api.doctype.list_data`, { params });
    return response?.data?.data
};

export const getSingleData = async (params: any) => {
    await getAuthorizationToken()
    const response = await apiClient.get(`method/my_account.api.doctype.single_data`, { params })
    return response?.data?.data?.data ?? {};
};

export const addData = async (params: any) => {
    await getAuthorizationToken()
    const response = await apiClient.post(`resource/${params.doctype}`, params.body);
    return response.data.data;
};

export const updateData = async (params: any) => {
    await getAuthorizationToken()
    const response = await apiClient.put(`resource/${params.doctype}/${params.body.id}`, params.body);
    return response.data.data;
};

export const deleteData = async (body: any) => {
    await getAuthorizationToken()
    const response = await apiClient.post(`method/my_account.api.doctype.delete_data`, body);
    return response.data;
};

export const getCustomData = async (params: any) => {
    await getAuthorizationToken()
    const response = await apiClient.post(`method/${params.url}`, params.args)
    return response?.data?.message ?? {};
};

export const fileUpload = async (file: any) => {
    await getAuthorizationToken()
    const formdata = new FormData();
    formdata.append("is_private", "0");
    formdata.append("folder", "Home/Attachments");
    formdata.append("file", file, file.name);
    const response = await apiClient.post(`upload_file`, formdata);
    return response.data;
};