import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axiosInstance'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    useEffect(()=>{
        if (!companyId || !user) return;
        const fetchSingleCompany = async () => {
            try {
                const res = await api.get(`${COMPANY_API_END_POINT}/get/${companyId}`);
                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {}
        }
        fetchSingleCompany();
    },[companyId, user, dispatch])
}

export default useGetCompanyById
