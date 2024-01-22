import type {RootState} from '../stores';
import {useSelector} from 'react-redux';

export const useCommonStore = () => {
    const permissions = useSelector((state: RootState) => state.user.permissions);
    const isFullscreen = useSelector((state: RootState) => state.public.isFullscreen);
    return {
        permissions,
        isFullscreen,
    };
}
