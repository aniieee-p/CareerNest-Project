import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    useEffect(()=>{
        if (!companyId || !user) return;
        const fetchSingleCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true});

                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {

            }
        }
        fetchSingleCompany();
    },[companyId, user, dispatch])
}

export default useGetCompanyById
