import axios from 'axios';

const API = 'http://localhost:5014/api/';

class VehicleService {
    getAll() {
        return axios.get(API + 'Vehicle');
    }

    getById(id) {
        return axios.get(API + 'Vehicle/' + id);
    }

    getByUserId(userId) {
        return axios.get(API + 'Vehicle/GetByUserId/' + userId);
    }

    create(data) {
        return axios.post(API + 'Vehicle', data);
    }

    delete(id) {
        return axios.delete(API + 'Vehicle/' + id);
    }
}

export default new VehicleService();