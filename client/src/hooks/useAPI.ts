import { useContext } from 'react';
import AuthContext from '../providers/AuthContext';
import useFetch, { FetchProps, Exports as ex } from './useFetch';
import { notifications } from '@mantine/notifications';
export interface Exports extends ex { }

interface Validation {
    [k: string]: string;
}

export function handleError(res: { error?: string, message?: string, validation?: Validation } = {}) {
    const message = res.validation ? Object.values(res.validation) : res.error || res.message || JSON.stringify(res);
    notifications.show({ title: "Error",message, color: 'red', });
}

export default function useAPI({catch: error, modify, headers={}, ...props}: FetchProps) {
    const { logout } = useContext(AuthContext);
    const fetch = useFetch({
        catch: ({status, ...retData}) => {
            if (status===401) logout();
            if (error) error({status, ...retData});
            if (!retData.validation || Object.keys(retData.validation).length<=0) handleError(retData);
        },
        modify: (props) => {
            const modified = modify ? modify(props) : props;
            const auth: {session: string} = JSON.parse(JSON.parse(localStorage.getItem("auth")||"") || {});
            return {
                headers: {
                    Authorization : `Bearer ${auth.session}`,
                    ...headers
                },
                ...modified
            }
        },
        ...props
    });
    return fetch
}
