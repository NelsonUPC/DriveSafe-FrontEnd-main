import axios from 'axios';

const API = 'https://drivesafes.azurewebsites.net/api/';

class UserService {
    getUsers() {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'User', { headers: { 'Authorization': `Bearer ${token}` } });
    }
    getUserById(id) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'User/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
    create(data){
        return axios.post(API + 'User/Register', data);
    }
    update(id, data) {
        const token = localStorage.getItem('userToken');
        return axios.put(API + 'User/' + id, data, { headers: { 'Authorization': `Bearer ${token}` } });
    }
}

export default new UserService();