import axios from 'axios';

const URL = 'http://localhost:3000/';
const API = 'http://localhost:5014/api/';

class UserService {
    getUsers() {
        return axios.get(API + 'User');
        //return axios.get(URL + 'usuario');
    }
    getUserById(id) {
        return axios.get(API + 'User/' + id);
        //return axios.get(`${URL}usuario/${id}`);
    }
    create(data){
        return axios.post(API + 'User', data);
        //return axios.post(URL + 'usuario', data)
    }
    update(id, data) {
        return axios.put(API + 'User/' + id, data);
    }
}

export default new UserService();