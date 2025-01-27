import axios from 'axios';
import { store } from '../rtk/Store';
import { logout } from '../rtk/Reducer';
import { resetToken } from '../rtk/Reducer';


const AxiosHelper = (token = '', contentType = 'application/json') => {
    const axiosInstance = axios.create({
        //baseURL: 'http://localhost:3000/'// IP: mạng
        baseURL: 'https://be-linkage.vercel.app/'// deploy
    });
    // cmd -----> ipconfig -----> IPv4 Address (192.168.1.1)
    axiosInstance.interceptors.request.use(
        async (config) => {
            //const token = '';
            const token = store.getState().app.token;
            config.headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': contentType
            }
            return config;
        }, (error) => {
            Promise.reject(error)
        }
    );

    axiosInstance.interceptors.response.use((response) => {
        return response.data;
    }, async (error) => {
        const x = error?.config;
        if (error.response.status == 403 && !x?.sent) {
            //console.error("403, token hết hạn");
            x.sent = true;
            //gọi api refreshToken
            await axios.post(`https://be-linkage.vercel.app/user/refreshToken`, {
                refreshToken: store.getState().app.refreshToken
            })
                .then(async function (response) {
                    //console.log("=>token1: " + response.data?.token);
                    await store.dispatch(resetToken(response.data?.token));
                    x.headers['Authorization'] = `Bearer ${response.data?.token}`;
                })
                .catch(async function (error) {
                    console.log(error);
                    // refreshToken hết hạn đăng xuất ra
                    await store.dispatch(logout());
                });
            return axiosInstance(x);
        }
        if (error.response && error.response.data) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error.message);
    });

    return axiosInstance;
};

export default AxiosHelper;



