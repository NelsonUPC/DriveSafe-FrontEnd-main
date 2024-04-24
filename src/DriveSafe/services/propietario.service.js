import http from '../../shared/services/http-common';

class PropietarioService {
    getAll() {
        return http.get('/propietarios');
    }
    create(data) {
        return http.post('/propietarios', data);
    }
    update(id, data) {
        return http.put(`/propietarios/${id}`, data);
    }

    delete(id) {
        return http.delete(`/propietarios/${id}`);
    }
}

export default new PropietarioService();