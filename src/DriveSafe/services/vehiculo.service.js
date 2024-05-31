import axios from 'axios';

const URL = 'http://localhost:3000/';
class VehiculoService {
    getAll() {
        return axios.get(URL + 'vehiculo');
    }

    getById(id) {
        return axios.get(`${URL}vehiculo/${id}`);
    }

    getByUserId(userId) {
        return axios.get(`${URL}vehiculo?propietario_id=${userId}`);
    }

    create(data) {
        return axios.post(URL + 'vehiculo', data);
    }
    /*update(id, data) {
        return axios.put(URL + 'vehiculo/{id}', data);
    }*/

    delete(id) {
        return axios.delete(`${URL}vehiculo/${id}`);
    }
}

export default new VehiculoService();