import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/utils/axiosInstance';
import { setSavedJobs } from '@/redux/jobSlice';
import { SAVED_JOBS_API } from '@/utils/constant';

const useGetSavedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            try {
                const res = await api.get(SAVED_JOBS_API);
                if (res.data.success) dispatch(setSavedJobs(res.data.savedJobs));
            } catch (err) {

            }
        };
        fetch();
    }, [user]);
};

export default useGetSavedJobs;
