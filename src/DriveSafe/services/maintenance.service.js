import axios from 'axios';

const API = 'http://localhost:5014/api/';

class MaintenanceService {
    getAll() {
        return axios.get(API + 'Maintenance');
    }

    create(data) {
        return axios.post(API + 'Maintenance', data);
    }

    update(id, data) {
        return axios.put(API + 'Maintenance/' + id, data);
    }
}

export default new MaintenanceService();