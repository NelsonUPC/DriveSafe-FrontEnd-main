import axios from 'axios';

const API = 'https://drivesafes.azurewebsites.net/api/';


class VehicleService {
    getAll() {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'Vehicle', { headers: { 'Authorization': `Bearer ${token}` } });
    }

    getById(id) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'Vehicle/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    getByUserId(userId) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'Vehicle/Owner/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    create(data) {
        const token = localStorage.getItem('userToken');
        return axios.post(API + 'Vehicle', data, { headers: { 'Authorization': `Bearer ${token}` } });
    }

    delete(id) {
        const token = localStorage.getItem('userToken');
        return axios.delete(API + 'Vehicle/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
}

export default new VehicleService();