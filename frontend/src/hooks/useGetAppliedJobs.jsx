import { setAllAppliedJobs } from "@/redux/jobSlice";
import api from "@/utils/axiosInstance";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth ?? {});

    useEffect(()=>{
        if(user?.role === "recruiter") {
            dispatch(setAllAppliedJobs([]));
            return;
        }
        const fetchAppliedJobs = async () => {
            try {
                const res = await api.get(`${APPLICATION_API_END_POINT}/get`);
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.applications));
                }
            } catch (error) {

            }
        }
        fetchAppliedJobs();
    },[user?.role])
};
export default useGetAppliedJobs;
