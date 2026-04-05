import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/utils/axiosInstance";
import { setNotifications } from "@/redux/notificationSlice";
import { NOTIFICATION_API } from "@/utils/constant";

const useGetNotifications = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            try {
                const res = await api.get(NOTIFICATION_API);
                if (res.data.success) dispatch(setNotifications(res.data.notifications));
            } catch {}
        };
        fetch();
    }, [user]);
};

export default useGetNotifications;
