import axios from 'axios';
import http from '@/shared/services/http-common.js';

const API = 'https://drivesafes.azurewebsites.net/api/';

class RentService {
    getAll() {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'Rent', { headers: { 'Authorization': `Bearer ${token}` } });
    }

    getById(id) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'Rent/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    getByUserId(userId) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'Rent/Tenant/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    create(data) {
        const token = localStorage.getItem('userToken');
        return axios.post(API + 'Rent', data, { headers: { 'Authorization': `Bearer ${token}` } });
    }

    update(id, data) {
        const token = localStorage.getItem('userToken');
        return axios.put(API + 'Rent/' + id, data, { headers: { 'Authorization': `Bearer ${token}` } });
    }

    delete(id) {
        const token = localStorage.getItem('userToken');
        return axios.delete(API + 'Rent/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
}

export default new RentService();
