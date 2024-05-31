import axios from 'axios';

const URL = 'http://localhost:3000/';

class AlquilerService {
    getAll() {
        return axios.get(URL + 'alquiler');
    }

    getById(id) {
        return axios.get(`${URL}alquiler/${id}`);
    }

    getByUserId(userId) {
        return axios.get(`${URL}alquiler?arrendatario_id=${userId}`);
    }

    getByPropietarioId(propietarioId) {
        return axios.get(`${URL}alquiler?propietario_id=${propietarioId}`);
    }

    create(data) {
        return axios.post(URL + 'alquiler', data);
    }

    update(id, data) {
        return axios.put(URL + `alquiler/${id}`, data);
    }

    delete(id) {
        return axios.delete(URL + `alquiler/${id}`);
    }
}

export default new AlquilerService();