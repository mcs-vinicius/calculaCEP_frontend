// frontend/src/api/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// --- Auth ---
export const loginUser = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await api.post('/token', formData);
  const data = response.data;

  // --- CORREÇÃO DE MAPEAMENTO ---
  // O backend envia "is_admin", mas o frontend usa "isAdmin"
  return {
    access_token: data.access_token,
    token_type: data.token_type,
    isAdmin: data.is_admin,               // Mapeia is_admin -> isAdmin
    nome: data.nome,
    mustChangePassword: data.must_change_password // Mapeia snake_case -> camelCase
  };
};

export const registerUser = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const changePassword = async (newPassword) => {
  const response = await api.post('/users/change-password', { new_password: newPassword });
  return response.data;
};

// --- Admin ---
export const getWhitelist = async () => {
  const response = await api.get('/admin/whitelist');
  return response.data;
};

export const addToWhitelist = async (matricula) => {
  const response = await api.post('/admin/whitelist', { matricula });
  return response.data;
};

export const deleteWhitelist = async (id) => {
  const response = await api.delete(`/admin/whitelist/${id}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const resetUserPassword = async (userId) => {
  const response = await api.post(`/admin/users/${userId}/reset-password`);
  return response.data;
};

// --- Calculadora ---
export const calculateDistances = async (formData) => {
  try {
    const response = await api.post('/api/calculate-distances/', formData);
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data.detail || 'Erro no servidor.');
    throw new Error('Erro de conexão.');
  }
};

export const downloadErrorFile = (fileUrl) => {
  const link = document.createElement('a');
  link.href = `${API_BASE_URL}${fileUrl}`;
  link.setAttribute('download', 'relatorio_erros.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default api;