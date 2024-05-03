import axios from 'axios';

const URL = 'https://fake-api-pi-rose.vercel.app/';

class AlquilerService {
    getAll() {
        return axios.get(URL + 'alquiler');
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