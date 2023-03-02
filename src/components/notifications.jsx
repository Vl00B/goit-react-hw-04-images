import { toast } from 'react-toastify';

export const noRequest = () => toast.warning('Input your request!');
export const queryError = () => toast.error();
