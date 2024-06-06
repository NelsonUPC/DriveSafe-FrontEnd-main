import axios from 'axios';

const API = 'http://localhost:5014/api/';

class UserService {
    getUsers() {
        return axios.get(API + 'User');
    }
    getUserById(id) {
        return axios.get(API + 'User/' + id);
    }
    create(data){
        return axios.post(API + 'User', data);
    }
    update(id, data) {
        return axios.put(API + 'User/' + id, data);
    }
}

export default new UserService();