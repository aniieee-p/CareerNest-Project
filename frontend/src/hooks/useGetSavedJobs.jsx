import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSavedJobs } from '@/redux/jobSlice';
import { SAVED_JOBS_API } from '@/utils/constant';

const useGetSavedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            try {
                const res = await axios.get(SAVED_JOBS_API, { withCredentials: true });
                if (res.data.success) dispatch(setSavedJobs(res.data.savedJobs));
            } catch (err) {
                console.log(err);
            }
        };
        fetch();
    }, [user]);
};

export default useGetSavedJobs;
