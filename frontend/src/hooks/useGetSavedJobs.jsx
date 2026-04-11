import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/utils/axiosInstance';
import { setSavedJobs } from '@/redux/jobSlice';
import { SAVED_JOBS_API } from '@/utils/constant';

const useGetSavedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        // Only fetch saved jobs if user is authenticated and is a student
        if (!user || user.role !== 'student') return;
        
        const fetch = async () => {
            try {
                const res = await api.get(SAVED_JOBS_API);
                if (res.data.success) dispatch(setSavedJobs(res.data.savedJobs));
            } catch (err) {
                // Silently handle errors - user might not be authenticated
                console.log('Failed to fetch saved jobs:', err.message);
            }
        };
        fetch();
    }, [user]);
};

export default useGetSavedJobs;
