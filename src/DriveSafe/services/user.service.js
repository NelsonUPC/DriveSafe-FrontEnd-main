import axios from 'axios';

const URL = 'https://fake-api-pi-rose.vercel.app/';

class UserService {

    getUsers() {
        return axios.get(URL+'usuario' );
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
