import http from '../../shared/services/http-common';

class AlquilerService {
    getAll() {
        return http.get('/alquileres');
    }
    create(data) {
        return http.post('/alquileres', data);
    }
    update(id, data) {
        return http.put(`/alquileres/${id}`, data);
    }

    delete(id) {
        return http.delete(`/alquileres/${id}`);
    }
}

export default new AlquilerService();