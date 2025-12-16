// frontend/src/pages/AdminPanel.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  Container, Typography, Box, Paper, Button, List, ListItem, 
  ListItemText, IconButton, TextField, 
  Grid, Tab, Tabs, Chip, Divider, Avatar, useTheme, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Stack, Tooltip
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset'; 
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useNavigate } from 'react-router-dom';
// Importamos todas as funções do serviço centralizado
import { 
  getUsers, 
  deleteUser, 
  getWhitelist, 
  addToWhitelist, 
  deleteWhitelist, 
  resetUserPassword 
} from '../api/apiService';

function TabPanel({ children, value, index }) {
  return <div hidden={value !== index} style={{ padding: '24px 0' }}>{value === index && children}</div>;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [whitelist, setWhitelist] = useState([]);
  const [newMatricula, setNewMatricula] = useState('');
  
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  const fetchData = useCallback(async () => {
    try {
      // Usando as funções do apiService em vez de axios direto
      const [uData, wData] = await Promise.all([
        getUsers(),
        getWhitelist()
      ]);
      setUsers(uData);
      setWhitelist(wData);
    } catch (error) { 
      console.error("Erro ao buscar dados:", error); 
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddWhitelist = async () => {
    if (!newMatricula) return;
    try {
      await addToWhitelist(newMatricula);
      setNewMatricula(''); 
      fetchData();
    } catch (error) { 
        console.error(error);
        alert('Erro ao adicionar ou matrícula já existe.'); 
    }
  };

  const handleDeleteWhitelist = async (id) => {
    if(!window.confirm('Remover esta matrícula da lista de espera?')) return;
    try { 
        await deleteWhitelist(id); 
        fetchData(); 
    } catch(error) { console.error(error); }
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try { 
        await deleteUser(id); 
        fetchData(); 
    } catch(error) { console.error(error); }
  };

  const handleResetPassword = async (id) => {
    if(!window.confirm('Isso irá gerar uma senha temporária para o usuário. Continuar?')) return;
    try {
        const data = await resetUserPassword(id);
        setTempPassword(data.temp_password);
        setResetDialogOpen(true);
    } catch (error) {
        console.error(error);
        alert('Erro ao resetar senha.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword);
    alert('Senha copiada!');
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="md">
        
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ bgcolor: theme.palette.background.paper }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">Painel Administrativo</Typography>
            <Typography variant="body2" color="text.secondary">Gerencie acessos e segurança</Typography>
          </Box>
        </Box>

        <Paper square={false} elevation={0} sx={{ overflow: 'hidden', borderRadius: 2, mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            variant={isMobile ? "fullWidth" : "standard"}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<VerifiedUserIcon />} iconPosition="start" label="Lista de Espera" />
            <Tab icon={<SecurityIcon />} iconPosition="start" label="Usuários" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                <TextField 
                  label="Adicionar Matrícula Permitida" 
                  value={newMatricula} 
                  onChange={(e) => setNewMatricula(e.target.value)}
                  fullWidth size="small"
                  placeholder="Ex: 12345"
                />
                <Button 
                  variant="contained" 
                  startIcon={<AddCircleIcon />} 
                  onClick={handleAddWhitelist}
                  sx={{ width: isMobile ? '100%' : 'auto', whiteSpace: 'nowrap', py: 1 }}
                >
                  Liberar
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ overflow: 'hidden' }}>
                <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
                  {whitelist.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Divider />}
                      <ListItem sx={{ px: 3, py: 2 }}>
                        <Stack 
                            direction="row" 
                            justifyContent="space-between" 
                            alignItems="center" 
                            width="100%"
                        >
                            <Box>
                                <Typography fontWeight="bold" variant="body1">
                                    {item.matricula}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Acesso Autorizado
                                </Typography>
                            </Box>
                            
                            <IconButton edge="end" color="error" onClick={() => handleDeleteWhitelist(item.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                      </ListItem>
                    </React.Fragment>
                  ))}
                  {whitelist.length === 0 && (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">Nenhuma matrícula na lista de espera.</Typography>
                    </Box>
                  )}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
           <Paper sx={{ overflow: 'hidden' }}>
            <List sx={{ p: 0 }}>
              {users.map((user, index) => (
                <React.Fragment key={user.id}>
                  {index > 0 && <Divider variant="inset" component="li" />}
                  <ListItem 
                    alignItems="flex-start"
                    sx={{ py: 2 }}
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        {!user.is_admin && (
                            <>
                                <Tooltip title="Resetar Senha">
                                    <IconButton color="warning" onClick={() => handleResetPassword(user.id)}>
                                        <LockResetIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir Usuário">
                                    <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                      </Stack>
                    }
                  >
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      <Avatar sx={{ bgcolor: user.is_admin ? 'secondary.main' : 'primary.main', width: 40, height: 40 }}>
                        {user.nome ? user.nome[0].toUpperCase() : 'U'}
                      </Avatar>
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography fontWeight="bold">{user.nome}</Typography>
                          {user.is_admin && <Chip label="Admin" size="small" color="secondary" sx={{ height: 20, fontSize: '0.6rem' }} />}
                          {user.must_change_password && <Chip label="Troca de Senha Pendente" size="small" color="warning" variant="outlined" sx={{ height: 20, fontSize: '0.6rem' }} />}
                        </Box>
                      }
                      secondary={
                        <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                          <Typography variant="body2" component="span" color="text.primary">
                            {user.email}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Matrícula: {user.matricula}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
           </Paper>
        </TabPanel>

      </Container>

      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Senha Resetada com Sucesso</DialogTitle>
        <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
                Anote a senha temporária abaixo. O usuário será obrigado a trocá-la no próximo login.
            </Alert>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f5f5f5', p: 2, borderRadius: 2, border: '1px dashed #ccc' }}>
                <Typography variant="h5" sx={{ fontFamily: 'monospace', flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
                    {tempPassword}
                </Typography>
                <IconButton onClick={copyToClipboard}>
                    <ContentCopyIcon />
                </IconButton>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}