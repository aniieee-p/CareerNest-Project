import { setAllJobs, setLoading } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axiosInstance'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);

    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                dispatch(setLoading(true));
                const res = await api.get(`${JOB_API_END_POINT}/get`);
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchAllJobs();
    },[]) // eslint-disable-line
}

export default useGetAllJobs
