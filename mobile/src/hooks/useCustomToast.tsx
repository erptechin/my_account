import { useToast, Toast, ToastTitle } from '@/src/components/ui/toast';


export const useCustomToast = () => {
    const toast = useToast();

    const showSuccessToast = (title: any, description: any = null, errorType = "error", duration = 3000) => {
        console.log(title)
        toast.show({
            placement: "top",
            duration: duration,
            render: () => {
                return (
                    <Toast
                        className="p-4 gap-3 w-full sm:min-w-[386px] bg-background-0 shadow-hard-2 flex-row"
                        action={"error"}
                    >
                        <ToastTitle size="sm">{title}</ToastTitle>
                    </Toast>
                )
            },
        })
    };

    return {
        showSuccessToast
    };
};
