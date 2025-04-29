import { useMutation, useQueryClient } from '@tanstack/react-query';

import { showMessage, showError, updateProfile } from '../services/apis';

export const useUpdateProfile = (onSuccessCallback: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (data: any) => {
            if (data) showMessage(data?.message);
            onSuccessCallback(data)
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error: any) => {
            showError(error)
        },
    });
};