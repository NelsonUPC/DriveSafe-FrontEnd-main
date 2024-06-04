import axios from 'axios';

const URL = 'http://localhost:3000/';
const API = 'http://localhost:5014/api/';

class AlquilerService {
    getAll() {
        return axios.get(API + 'Rent');
    }

    getById(id) {
        return axios.get(API + 'Rent/' + id);
    }

    getByUserId(userId) {
        return axios.get(API + 'Rent/GetByUserId/' + userId);
    }

    create(data) {
        return axios.post(API + 'Rent', data);
    }

    update(id, data) {
        return axios.put(API + 'Rent/' + id, data);
    }
}

export default new AlquilerService();