import api from '@/utils/axiosInstance';
import { setSingleJob } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetSingleJob = (jobId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await api.get(`${JOB_API_END_POINT}/get/${jobId}`);
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job)); 
                }
            } catch (error) {}
        }
        fetchSingleJob();
    }, [])
}

export default useGetSingleJob;
