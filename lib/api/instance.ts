import axios from 'axios';

const baseURL = "https://www.qa.delgo.pet/api";

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default axiosInstance;