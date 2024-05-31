import axios from 'axios';

const URL = 'http://localhost:3000/';
const URL2 = 'http://localhost:5014/api/';

class UserService {

    getUsers() {
        return axios.get(URL2 + 'User');
        //return axios.get(URL + 'usuario');
    }

    getUserById(id) {
        return axios.get(URL2 + 'User/' + id);
        //return axios.get(`${URL}usuario/${id}`);
    }

    create(data){
        return axios.post(URL2 + 'User', data);
        //return axios.post(URL + 'usuario', data)
    }

    update(id, data) {
        return axios.put(URL2 + 'User/' + id, data);
    }
}

export default new UserService();