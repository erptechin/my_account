import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getListData, getSingleData } from 'utils/apis';
import { useAuthContext } from "app/contexts/auth/context";

function dataKey(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '-');
}

export const useFeachData = (params) => {
    const { isAuthenticated, user } = useAuthContext();
    const firstQuery = useQuery({
        queryKey: ['firstQuery', dataKey(params.doctype), params],
        queryFn: () => getListData({ ...params, fields: JSON.stringify(["name"]), filters: JSON.stringify([[params.doctype, "client", "=", user.clientId]]) }),
        enabled: isAuthenticated,
        select: (data) => {
            return data?.data[0] ?? {}
        },
    });

    const brandName = firstQuery?.data?.name ?? null
    params['id'] = brandName
    const secondQuery = useQuery({
        queryKey: ['secondQuery', firstQuery.data],
        queryFn: () => getSingleData(params),
        enabled: !!brandName
    });

    return brandName ? secondQuery : firstQuery
};