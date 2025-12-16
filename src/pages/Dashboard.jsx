// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Alert, Button, Stack, Paper, Grid, 
  Fade, Menu, MenuItem, ListItemIcon, Avatar, Divider
} from '@mui/material';

// Ícones
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import CalculateIcon from '@mui/icons-material/Calculate';

// Imagens e Componentes
import headerLogo from '../assets/header_logo.png'; 
import ThemeSwitch from '../components/ThemeSwitch';
import UploadForm from '../components/UploadForm';
import ResultsTable from '../components/ResultsTable';
import CogLoader from '../components/CogLoader';
import DownloadLoader from '../components/DownloadLoader';
import { calculateDistances, downloadErrorFile } from '../api/apiService';

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [showContent, setShowContent] = useState(false);
  
  // Estado do Menu Suspenso
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const navigate = useNavigate();

  // Dados do Usuário
  const userName = localStorage.getItem('nome') || 'Usuário';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleNavigateAdmin = () => {
    navigate('/admin');
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const fileName = `CardioGeriatria_Rotas_${dateStr}.xlsx`;

    XLSX.writeFile(workbook, fileName);
    setTimeout(() => setIsDownloading(false), 1000);
  };
  
  const handleProcessSubmit = async (baseAddress, file) => {
    setIsLoading(true);
    setError('');
    setResults([]);

    const formData = new FormData();
    Object.keys(baseAddress).forEach(key => {
        formData.append(`base_${key}`, baseAddress[key]);
    });
    formData.append('file', file);

    try {
      const data = await calculateDistances(formData);
      setResults(data.success_data || []);
      
      if (data.error_file_url) {
        downloadErrorFile(data.error_file_url);
        setError('Atenção: Alguns endereços não foram localizados. Verifique o arquivo de erros baixado.');
      } else if ((data.success_data || []).length === 0) {
        setError('Nenhum endereço válido foi processado. Verifique a formatação da planilha.');
      }
    } catch (err) {
      setError(err.message || 'Erro desconhecido ao processar.');
      if(err.message && err.message.includes('401')) handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <CogLoader />}
      {isDownloading && <DownloadLoader onComplete={() => setIsDownloading(false)} />}
      
      <Fade in={showContent} timeout={800}>
        <Box sx={{ minHeight: '100vh', pb: 8 }}>
          
          {/* HEADER / BARRA SUPERIOR */}
          <Paper 
            elevation={0} 
            sx={{ 
              mb: 4, py: 1, 
              borderRadius: 0, 
              borderBottom: '1px solid', borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                
                {/* ESQUERDA: Logo Imagem */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '200px' }}>
                  <Box 
                    component="img"
                    src={headerLogo}
                    alt="Logo CardioGeriatria"
                    sx={{ 
                      height: { xs: 35, md: 45 }, 
                      width: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </Box>

                {/* CENTRO: Ferramentas */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flex: 1, justifyContent: 'center' }}>
                    <Button 
                        startIcon={<CalculateIcon />}
                        variant="soft" 
                        sx={{ 
                            borderRadius: 5, 
                            px: 3, 
                            fontWeight: 'bold',
                            color: 'primary.main',
                            bgcolor: 'action.hover'
                        }}
                    >
                        Calculadora CEP
                    </Button>
                </Box>

                {/* DIREITA: Perfil e Ações */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: '200px', justifyContent: 'flex-end' }}>
                  
                  <ThemeSwitch />

                  {/* Botão de Perfil (Nome + Função + Avatar) */}
                  <Button 
                    onClick={handleMenuOpen} 
                    sx={{ 
                        textTransform: 'none', 
                        color: 'text.primary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 1,
                        ml: 1,
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="subtitle2" fontWeight="700" lineHeight={1.2}>
                            {userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" lineHeight={1}>
                            {isAdmin ? 'Administrador' : 'Colaborador'}
                        </Typography>
                    </Box>
                    
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 'bold' }}>
                        {userName.charAt(0).toUpperCase()}
                    </Avatar>
                  </Button>

                </Stack>
              </Box>
            </Container>
          </Paper>

          {/* MENU SUSPENSO */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                minWidth: 200,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 20,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* Opções do Menu */}
            {isAdmin && (
                <MenuItem onClick={handleNavigateAdmin}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Painel Administrativo
                </MenuItem>
            )}

            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <Typography color="error">Sair</Typography>
            </MenuItem>
          </Menu>

          {/* CONTEÚDO */}
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="center">
              
              <Grid item xs={12} sx={{ textAlign: 'center', mb: 1 }}>
                <Typography variant="h4" gutterBottom fontWeight="700" color="text.primary">
                  Calculadora de Rotas
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={4} sx={{ maxWidth: '1000px', mx: 'auto', p: { xs: 2, md: 5 } }}>
                  <UploadForm onSubmit={handleProcessSubmit} isLoading={isLoading} />
                </Paper>
              </Grid>

              {error && (
                <Grid item xs={12} md={10}>
                  <Alert severity={error.includes('Atenção') ? 'warning' : 'error'} variant="filled">
                    {error}
                  </Alert>
                </Grid>
              )}
              
              {results.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">Resultados ({results.length})</Typography>
                    <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={handleDownload} disabled={isDownloading} sx={{ px: 4 }}>
                      Baixar Excel
                    </Button>
                  </Box>
                  <Paper elevation={4} sx={{ overflow: 'hidden' }}>
                    <ResultsTable data={results} />
                  </Paper>
                </Grid>
              )}

            </Grid>
          </Container>
        </Box>
      </Fade>
    </>
  );
}