import http from '../../shared/services/http-common';

class ArrendatarioService {
    getAll() {
        return http.get('/arrendatarios');
    }
    create(data) {
        return http.post('/arrendatarios', data);
    }
    update(id, data) {
        return http.put(`/arrendatarios/${id}`, data);
    }

    delete(id) {
        return http.delete(`/arrendatarios/${id}`);
    }
}

export default new ArrendatarioService();