import api from "./axios";


export const getActiveCoupons = () => {
    return api.get("/coupons/active");
};