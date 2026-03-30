import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);

    useEffect(()=>{
        if(user?.role === "recruiter") {
            dispatch(setAllAppliedJobs([]));
            return;
        }
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.applications));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    },[user?.role])
};
export default useGetAppliedJobs;
