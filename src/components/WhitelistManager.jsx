// frontend/src/components/WhitelistManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, 
  List, ListItem, ListItemText, ListItemIcon, Divider, 
  Alert, IconButton, Tooltip, Chip, Grid, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { 
  getWhitelist, addToWhitelist, deleteWhitelist,
  getUsers, deleteUser, resetUserPassword
} from '../api/apiService';

export default function WhitelistManager() {
  const [matricula, setMatricula] = useState('');
  const [allowedList, setAllowedList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  const [tempPassword, setTempPassword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [wData, uData] = await Promise.all([getWhitelist(), getUsers()]);
      setAllowedList(wData);
      setUsersList(uData);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  const handleLiberar = async () => {
    if (!matricula) return;
    try {
      await addToWhitelist(matricula);
      setMsg({ type: 'success', text: `Matrícula ${matricula} liberada!` });
      setMatricula('');
      loadData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Erro ao liberar.' });
    }
  };

  const handleRevogar = async (id) => {
    if(!window.confirm("Tem certeza que deseja remover esta pré-aprovação?")) return;
    try {
      await deleteWhitelist(id);
      loadData();
    } catch (err) {
      // CORREÇÃO: Usando 'err'
      console.error("Erro ao revogar:", err);
      alert("Erro ao remover item.");
    }
  };

  const handleExcluirUsuario = async (id) => {
    if(!window.confirm("ATENÇÃO: Isso excluirá permanentemente o usuário. Continuar?")) return;
    try {
      await deleteUser(id);
      setMsg({ type: 'success', text: 'Usuário excluído com sucesso.' });
      loadData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Erro ao excluir usuário.' });
    }
  };

  const handleResetarSenha = async (id, nome) => {
    if(!window.confirm(`Deseja resetar a senha de ${nome}?`)) return;
    try {
      const data = await resetUserPassword(id);
      setTempPassword(data.temp_password); 
      setOpenDialog(true); 
    } catch (err) {
      // CORREÇÃO: Usando 'err'
      console.error("Erro ao resetar senha:", err);
      alert("Erro ao resetar senha.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
      
      {msg.text && <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg({type:'', text:''})}>{msg.text}</Alert>}

      <Grid container spacing={4}>
        
        {/* COLUNA 1: USUÁRIOS ATIVOS */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" /> Usuários Cadastrados
          </Typography>
          <Paper elevation={2} sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List>
              {usersList.length === 0 ? <ListItem><ListItemText secondary="Nenhum usuário." /></ListItem> : 
                usersList.map((user) => (
                  <React.Fragment key={user.id}>
                    <ListItem
                      secondaryAction={
                        <Box>
                          <Tooltip title="Resetar Senha">
                            <IconButton onClick={() => handleResetarSenha(user.id, user.nome)}>
                              <LockResetIcon color="warning" />
                            </IconButton>
                          </Tooltip>
                          {!user.is_admin && (
                            <Tooltip title="Excluir Usuário">
                              <IconButton onClick={() => handleExcluirUsuario(user.id)} edge="end">
                                <DeleteIcon color="error" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      }
                    >
                      <ListItemText 
                        primary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {user.nome}
                            {user.is_admin && <Chip icon={<AdminPanelSettingsIcon />} label="Admin" size="small" color="primary" variant="outlined" />}
                          </Box>
                        }
                        secondary={`Matrícula: ${user.matricula} | ${user.email}`} 
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              }
            </List>
          </Paper>
        </Grid>

        {/* COLUNA 2: LISTA DE PERMISSÃO (WHITELIST) */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon color="secondary" /> Pré-Aprovações
          </Typography>
          
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                fullWidth size="small" 
                placeholder="Nova Matrícula" 
                value={matricula} 
                onChange={(e) => setMatricula(e.target.value)} 
              />
              <Button variant="contained" color="secondary" onClick={handleLiberar}>Add</Button>
            </Box>
          </Paper>

          <Paper elevation={1} sx={{ maxHeight: 300, overflow: 'auto' }}>
            <List dense>
              {allowedList.length === 0 ? <ListItem><ListItemText secondary="Nenhuma pendente." /></ListItem> :
                allowedList.map((item) => (
                  <ListItem key={item.id}
                    secondaryAction={
                      <IconButton edge="end" size="small" onClick={() => handleRevogar(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 30 }}><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={item.matricula} />
                  </ListItem>
                ))
              }
            </List>
          </Paper>
        </Grid>

      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Senha Redefinida</DialogTitle>
        <DialogContent>
          <Typography>
            A senha foi alterada com sucesso. Envie a senha temporária abaixo para o usuário:
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f0f0', borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
              {tempPassword}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigator.clipboard.writeText(tempPassword)}>Copiar</Button>
          <Button onClick={() => setOpenDialog(false)} autoFocus>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}