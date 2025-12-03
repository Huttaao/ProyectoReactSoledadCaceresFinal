import { useCallback } from 'react';
import { toast } from 'react-toastify';


export const useAsyncToast = () => {
    const success = useCallback((message) => {
    queueMicrotask(() => toast.success(message));
}, []);

    const error = useCallback((message) => {
    queueMicrotask(() => toast.error(message));
}, []);

    const warning = useCallback((message) => {
    queueMicrotask(() => toast.warning(message));
}, []);

    const info = useCallback((message) => {
    queueMicrotask(() => toast.info(message));
}, []);

    return { success, error, warning, info };
};
