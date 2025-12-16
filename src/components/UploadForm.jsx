// src/components/UploadForm.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Alert, Divider, useTheme } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function UploadForm({ onSubmit, isLoading }) {
  const theme = useTheme();
  const [baseAddress, setBaseAddress] = useState({
    rua: 'Av. Dr. Enéas Carvalho de Aguiar',
    numero: '44',
    bairro: 'Cerqueira César',
    municipio: 'São Paulo',
    cep: '05403-900',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => setBaseAddress(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile || Object.values(baseAddress).some(f => !f)) return alert('Preencha tudo!');
    onSubmit(baseAddress, selectedFile);
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit}>
      
      {/* SEÇÃO DE ORIGEM */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LocationOnIcon color="primary" />
          <Typography variant="h6" fontWeight="600">1. Ponto de Partida</Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <TextField label="Rua / Logradouro" name="rua" value={baseAddress.rua} onChange={handleInputChange} fullWidth required variant="outlined" />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Número" name="numero" value={baseAddress.numero} onChange={handleInputChange} fullWidth required variant="outlined" />
          </Grid>
          
          <Grid item xs={12} md={5}>
            <TextField label="Bairro" name="bairro" value={baseAddress.bairro} onChange={handleInputChange} fullWidth required variant="outlined" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Município" name="municipio" value={baseAddress.municipio} onChange={handleInputChange} fullWidth required variant="outlined" />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="CEP" name="cep" value={baseAddress.cep} onChange={handleInputChange} fullWidth required variant="outlined" />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4, opacity: 0.1 }} />

      {/* SEÇÃO DE ARQUIVO */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <UploadFileIcon color="primary" />
          <Typography variant="h6" fontWeight="600">2. Dados dos Pacientes</Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(1, 67, 97, 0.3)' : undefined }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Typography variant="body2">Use o modelo padrão.</Typography>
              {/* CORREÇÃO AQUI: href alterado para modelo_input.xlsx */}
              <Button size="small" startIcon={<DownloadIcon />} href="/modelo_input.xlsx" download="modelo_input.xlsx">Baixar Modelo</Button>
           </Box>
        </Alert>

        <Box sx={{ 
            p: 4, border: '2px dashed', 
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', 
            borderRadius: 3, textAlign: 'center',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(250,250,250,0.5)'
        }}>
            <Button variant="contained" component="label" sx={{ px: 4, py: 1 }}>
              Selecionar Arquivo
              <input type="file" hidden accept=".csv, .xls, .xlsx" onChange={(e) => setSelectedFile(e.target.files[0])}/>
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {selectedFile ? selectedFile.name : 'Nenhum arquivo selecionado'}
            </Typography>
        </Box>

        <Button type="submit" variant="contained" fullWidth size="large" disabled={isLoading} sx={{ mt: 4, py: 2, fontSize: '1.1rem' }}>
            {isLoading ? 'Calculando...' : 'Processar Rotas'}
        </Button>
      </Box>
    </Box>
  );
}

export default UploadForm;