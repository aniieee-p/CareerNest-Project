import { setCompanies, setLoading } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import api from '@/utils/axiosInstance';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        dispatch(setLoading(true));
        const res = await api.get(`${COMPANY_API_END_POINT}/get`);
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
      } finally {
        dispatch(setLoading(false));
      }
    }
    fetchCompanies();
  }, [])
}

export default useGetAllCompanies;
