import http from '../../shared/services/http-common';

class VehiculoService {
    getAll() {
        return http.get('/vehiculos');
    }
    create(data) {
        return http.post('/vehiculos', data);
    }
    update(id, data) {
        return http.put(`/vehiculos/${id}`, data);
    }

    delete(id) {
        return http.delete(`/vehiculos/${id}`);
    }
}

export default new VehiculoService();