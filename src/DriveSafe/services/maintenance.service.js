import axios from 'axios';
import http from '@/shared/services/http-common.js';

const API = 'http://localhost:5232/api/';

class MaintenanceService {

    getAll() {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'Maintenance', { headers: { 'Authorization': `Bearer ${token}` } });
    }

    getById(id) {
        const token = localStorage.getItem('userToken');
        return axios.get(API + 'Maintenance/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    create(data) {
        const token = localStorage.getItem('userToken');
        return axios.post(API + 'Maintenance', data, { headers: { 'Authorization': `Bearer ${token}` } });
    }

    update(id, data) {
        const token = localStorage.getItem('userToken');
        return axios.put(API + 'Maintenance/' + id, data);
    }
}

export default new MaintenanceService();