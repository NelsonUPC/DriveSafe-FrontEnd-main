import axios from 'axios';

const URL = 'http://localhost:3000/';

class UserService {

    getUsers() {
        return axios.get(URL + 'usuario');
    }

    getUserById(id) {
        return axios.get(`${URL}usuario/${id}`);
    }

    create(data){
        return axios.post(URL + 'usuario', data)
    }

    update(id, data) {
        return axios.put(`${URL}usuario/${id}`, data);
    }
}

export default new UserService();
