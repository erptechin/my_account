import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { showMessage, showError, getWishlists, addWishlist, deleteWishlist } from '../services/apis';
import { MainContext } from "../contexts";

export const useWishlists = () => {
    const { token, setWishlists } = useContext(MainContext)
    return useQuery({
        queryKey: ['wishlists'],
        queryFn: getWishlists,
        enabled: !!token,
        select: (data: any) => {
            setWishlists(data?.data?.wish_list_data ?? [])
            return data?.data?.wish_list_data ?? [];
        },
    });
};

export const useAddWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addWishlist,
        onSuccess: (data: any) => {
            if (data) showMessage(data?.message);
            queryClient.invalidateQueries({ queryKey: ['wishlists'] });
        },
        onError: (error: any) => {
            showError(error)
        },
    });
};

export const useDeleteWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteWishlist,
        onSuccess: (data: any) => {
            if (data) showMessage(data?.message);
            queryClient.invalidateQueries({ queryKey: ['wishlists'] });
        },
        onError: (error: any) => {
            showError(error)
        },
    });
};