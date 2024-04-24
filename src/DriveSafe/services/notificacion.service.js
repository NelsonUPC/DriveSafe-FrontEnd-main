import http from '../../shared/services/http-common';

class NotificacionService {
    getAll() {
        return http.get('/notificaciones');
    }
    create(data) {
        return http.post('/notificaciones', data);
    }
    update(id, data) {
        return http.put(`/notificaciones/${id}`, data);
    }

    delete(id) {
        return http.delete(`/notificaciones/${id}`);
    }
}

export default new NotificacionService();