import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllAdminJobs } from '@/redux/jobSlice'

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true});
        if(res.data.success){
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {

      }
    }
    fetchAllAdminJobs();
  },[])
}

export default useGetAllJobs 
