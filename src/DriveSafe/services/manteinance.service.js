import axios from 'axios';

const URL = 'http://localhost:3000/';
class MantenimientoService {
    getAll() {
        return axios.get(URL + 'mantenimiento');
    }

    getById(id) {
        return axios.get(`${URL}mantenimiento/${id}`);
    }

    getByUserId(userId) {
        return axios.get(`${URL}mantenimiento?arrendatario_id=${userId}`);
    }

    create(data) {
        return axios.post(URL + 'mantenimiento', data);
    }

    update(id, data) {
        return axios.put(`${URL}mantenimiento/${id}`, data);
    }

    delete(id) {
        return axios.delete(`${URL}mantenimiento/${id}`);
    }
}

export default new MantenimientoService();
