import api from './api';

export const bukuService = {
  async getAll(params = {}) {
    const response = await api.get('/buku', { params });
    return response.data;
  },
  async getById(id) {
    const response = await api.get(`/buku/${id}`);
    return response.data;
  },
  async create(data) {
    const response = await api.post('/buku', data);
    return response.data;
  },
  async update(id, data) {
    const response = await api.put(`/buku/${id}`, data);
    return response.data;
  },
  async remove(id) {
    const response = await api.delete(`/buku/${id}`);
    return response.data;
  },
  async getStatistik() {
    const response = await api.get('/buku/statistik');
    return response.data;
  }
};