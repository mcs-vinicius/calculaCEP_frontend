// frontend/src/pages/AdminProfile.jsx
import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, Button } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import WhitelistManager from '../components/WhitelistManager';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminProfile() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const userName = localStorage.getItem('nome');
  // CORREÇÃO: Vamos usar esta variável no JSX abaixo
  const userEmail = localStorage.getItem('email') || 'admin@admin.com'; 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/')} 
        sx={{ mb: 2 }}
      >
        Voltar para Calculadora
      </Button>

      <Paper elevation={3} sx={{ minHeight: '60vh' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab icon={<AdminPanelSettingsIcon />} label="Meu Perfil" />
            <Tab icon={<ManageAccountsIcon />} label="Gestão de Acessos" />
          </Tabs>
        </Box>

        {/* ABA 0: PERFIL */}
        <CustomTabPanel value={value} index={0}>
          <Typography variant="h5" gutterBottom>Perfil do Administrador</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1"><strong>Nome:</strong> {userName}</Typography>
            {/* CORREÇÃO: Agora o userEmail está sendo usado aqui */}
            <Typography variant="subtitle1"><strong>E-mail:</strong> {userEmail}</Typography>
            <Typography variant="subtitle1"><strong>Status:</strong> Super Admin</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Nesta área você poderá gerenciar suas configurações pessoais futuramente.
            </Typography>
          </Box>
        </CustomTabPanel>

        {/* ABA 1: GESTÃO DE USUÁRIOS */}
        <CustomTabPanel value={value} index={1}>
          <WhitelistManager />
        </CustomTabPanel>
      </Paper>
    </Container>
  );
}