import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import api from '@/utils/axiosInstance';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get(`${COMPANY_API_END_POINT}/get`);
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {}
    }
    fetchCompanies();
  }, [])
}

export default useGetAllCompanies;
