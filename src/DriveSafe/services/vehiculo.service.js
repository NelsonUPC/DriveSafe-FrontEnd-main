import axios from 'axios';

const URL = 'http://localhost:3000/';
const API = 'http://localhost:5014/api/';
class VehiculoService {
    getAll() {
        return axios.get(API + 'Vehicle');
        //return axios.get(URL + 'vehiculo');
    }

    getById(id) {
        return axios.get(API + 'Vehicle/' + id);
        //return axios.get(`${URL}vehiculo/${id}`);
    }

    getByUserId(userId) {
        return axios.get(API + 'Vehicle/GetByUserId/' + userId);
        //return axios.get(`${URL}vehiculo?propietario_id=${userId}`);
    }

    create(data) {
        return axios.post(API + 'Vehicle', data);
        //return axios.post(URL + 'vehiculo', data);
    }
    /*update(id, data) {
        return axios.put(URL + 'vehiculo/{id}', data);
    }*/

    delete(id) {
        return axios.delete(API + 'Vehicle/' + id);
        //return axios.delete(`${URL}vehiculo/${id}`);
    }
}

export default new VehiculoService();