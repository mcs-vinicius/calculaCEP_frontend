// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, changePassword } from '../api/apiService';
import { 
  Box, Typography, Paper, TextField, Button, Alert, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  useTheme, Container, DialogContentText
} from '@mui/material';

import logoCardio from '../assets/header_logo.png'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(email, senha);
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('isAdmin', data.isAdmin);
      localStorage.setItem('nome', data.nome);
      localStorage.setItem('email', email);

      if (data.mustChangePassword) {
        setShowPasswordDialog(true);
      } else {
        // CORREÇÃO: Removido 'const isAdmin' pois não estava sendo usada
        navigate('/dashboard'); 
      }
    } catch (err) {
      console.error(err);
      setError('Login falhou. Verifique as credenciais.');
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (!newPassword || newPassword.length < 4) {
      alert("A senha deve ter pelo menos 4 caracteres.");
      return;
    }
    try {
      await changePassword(newPassword);
      alert("Senha alterada com sucesso!");
      setShowPasswordDialog(false);
      navigate('/dashboard');
    } catch (err) {
      console.error(err); // CORREÇÃO: Usando a variável err
      alert("Erro ao alterar senha.");
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 50, 60, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1 }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper elevation={12} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img src={logoCardio} alt="Logo CardioGeriatria" style={{ height: '80px', marginBottom: '10px' }} />
            <Typography component="h1" variant="h5" color="primary" fontWeight="bold">Automações</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal" required fullWidth id="email" label="E-mail ou Matrícula" name="email" autoComplete="email" autoFocus
              value={email} onChange={(e) => setEmail(e.target.value)} sx={{ bgcolor: 'white' }}
            />
            <TextField
              margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" autoComplete="current-password"
              value={senha} onChange={(e) => setSenha(e.target.value)} sx={{ bgcolor: 'white' }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => setShowForgotDialog(true)}
                    sx={{ textTransform: 'none', fontSize: '0.85rem' }}
                >
                    Esqueci minha senha
                </Button>
            </Box>

            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2, mb: 2, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}>
              Entrar
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/register" style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 500 }}>
                Não tem conta? Solicite acesso
              </Link>
            </Box>
          </Box>
        </Paper>
        
        <Typography variant="caption" align="center" display="block" sx={{ color: 'rgba(255,255,255,0.8)', mt: 3 }}>
          &copy; {new Date().getFullYear()} Saúde Digital
        </Typography>
      </Container>

      <Dialog open={showPasswordDialog} disableEscapeKeyDown fullWidth maxWidth="xs">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Troca de Senha Necessária</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>A sua senha temporária expirou. Defina uma nova senha.</Typography>
          <TextField autoFocus label="Nova Senha" type="password" fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleChangePasswordSubmit} variant="contained" fullWidth>Confirmar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showForgotDialog} onClose={() => setShowForgotDialog(false)}>
        <DialogTitle>Recuperação de Acesso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Como medida de segurança, o reset de senha é realizado apenas pelo administrador do sistema.
            <br /><br />
            Por favor, entre em contato com o setor responsável ou solicite o reset diretamente ao administrador informando sua matrícula.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForgotDialog(false)} color="primary">Entendido</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}