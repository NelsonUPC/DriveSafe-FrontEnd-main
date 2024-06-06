import axios from 'axios';

const API = 'http://localhost:5014/api/';

class RentService {
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

    delete(id) {
        return axios.delete(API + 'Rent/' + id);
    }
}

export default new RentService();