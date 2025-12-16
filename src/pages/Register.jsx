// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/apiService';
import { Container, TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';

export default function Register() {
  const [form, setForm] = useState({ nome: '', matricula: '', email: '', senha: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(form);
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (err) {
      // Captura mensagem detalhada do backend (ex: Matrícula não autorizada)
      setError(err.response?.data?.detail || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Novo Cadastro</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Informe a matrícula autorizada pelo gestor.
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
          <TextField fullWidth margin="normal" label="Nome Completo" name="nome" onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Matrícula" name="matricula" onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="E-mail" name="email" type="email" onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Senha" name="senha" type="password" onChange={handleChange} required />
          
          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}>
            Cadastrar
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Voltar ao Login
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}