import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import api from '@/utils/axiosInstance'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllAdminJobs, setAdminJobsLoading } from '@/redux/jobSlice'

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchAllAdminJobs = async () => {
      try {
        dispatch(setAdminJobsLoading(true));
        const res = await api.get(`${JOB_API_END_POINT}/getadminjobs`);
        if(res.data.success){
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
      } finally {
        dispatch(setAdminJobsLoading(false));
      }
    }
    fetchAllAdminJobs();
  },[])
}

export default useGetAllJobs
