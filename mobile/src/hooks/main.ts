import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { MainContext } from '../contexts';
import { showError, showMessage, getInfo, getListData, getSingleData, addData, updateData, deleteData } from '../services/apis';


function dataKey(str: any) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '-');
}

export const useInfo = (params: any) => {
    const { token } = useContext(MainContext)
    return useQuery({
        queryKey: [dataKey(params.doctype), params],
        queryFn: () => getInfo(params),
        enabled: !!token
    });
};

export const useFeachData = (params: any) => {
    const { token } = useContext(MainContext)
    return useQuery({
        queryKey: [dataKey(params.doctype), params],
        queryFn: () => getListData(params),
        enabled: !!token && !!params?.fields
    });
};

export const useFeachSingle = (params: any) => {
    const { token } = useContext(MainContext)
    return useQuery({
        queryKey: [dataKey(params.doctype), params],
        queryFn: () => getSingleData(params),
        enabled: !!token && !!params.id,
        select: (data) => {
            let newData = { ...data, ...data?.location }
            delete newData.location
            delete newData.name
            return newData
        },
    });
};

export const useAddData = (onSuccessCallback: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params) => {
            return addData(params)
        },
        onSuccess: (data, variable: any) => {
            if (data && !variable.notAlert) showMessage(`${variable.doctype} add successfully`);
            onSuccessCallback(data)
            queryClient.invalidateQueries({ queryKey: [dataKey(variable.doctype)] });
        },
        onError: (error) => {
            showError(error)
        },
    });
};

export const useUpdateData = (onSuccessCallback: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: any) => {
            delete params.creation
            delete params.modified
            return updateData(params)
        },
        onSuccess: (data, variable: any) => {
            if (data) showMessage(`${variable.doctype} update successfully`);
            onSuccessCallback(data)
            queryClient.invalidateQueries({ queryKey: [dataKey(variable.doctype)] });
        },
        onError: (error) => {
            showError(error)
        },
    });
};

export const useDeleteData = (onCallback: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: any) => {
            return deleteData({ doctype: params.doctype, ids: params.ids })
        },
        onSuccess: (data, variable) => {
            onCallback({ success: true })
            if (data) showMessage(`${variable.doctype} deleted successfully`);
            queryClient.invalidateQueries({ queryKey: [dataKey(variable.doctype)] });
        },
        onError: (error, variable) => {
            onCallback({ error: true })
            showMessage(`Cann't delete ${variable.doctype}, because it is linked`, 'error');
        },
    });
};