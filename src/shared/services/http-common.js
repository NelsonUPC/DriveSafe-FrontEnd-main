import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://drivesafes.azurewebsites.net/api/',
    headers: { 'Content-type': 'application/json' }
});



export default instance;