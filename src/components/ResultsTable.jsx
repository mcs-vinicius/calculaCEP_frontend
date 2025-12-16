import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box, Typography } from '@mui/material';

function ResultsTable({ data }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('distancia_rota_carro_km');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = useMemo(() => {
    const comparator = (a, b) => {
      // Modificado para não tratar valores de tempo como numéricos para ordenação
      const valA = (typeof a[orderBy] === 'number' && !isNaN(a[orderBy])) ? a[orderBy] : Infinity;
      const valB = (typeof b[orderBy] === 'number' && !isNaN(b[orderBy])) ? b[orderBy] : Infinity;

      // Se não for numérico, faz a comparação de string
      if (typeof a[orderBy] !== 'number') {
        if (b[orderBy] < a[orderBy]) { return order === 'asc' ? 1 : -1; }
        if (b[orderBy] > a[orderBy]) { return order === 'asc' ? -1 : 1; }
        return 0;
      }
      
      // Comparação numérica
      if (valB < valA) { return order === 'asc' ? 1 : -1; }
      if (valB > valA) { return order === 'asc' ? -1 : 1; }
      return 0;
    };
    return [...data].sort(comparator);
  }, [data, order, orderBy]);

  // --- ALTERAÇÃO AQUI ---
  // 1. Atualizei o id para 'tempo_transporte_hh_mm_ss'.
  // 2. Mudei o label para "Tempo de Transporte (HH:MM:SS)".
  // 3. Removi a propriedade 'numeric' para tratar como texto, já que "00:15:30" não é um número.
  const columns = [
    { id: 'id_paciente', label: 'ID Paciente' },
    { id: 'cep', label: 'CEP' },
    { id: 'distancia_rota_carro_km', label: 'Distancia (Carro)', numeric: true },
    { id: 'distancia_transporte_km', label: 'Distancia (Transporte)', numeric: true },
    { id: 'tempo_transporte_hh_mm_ss', label: 'Tempo de Transporte (HH:MM:SS)' }, // Alterado
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>3. Resultados</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de resultados">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.numeric ? 'right' : 'left'} sortDirection={orderBy === column.id ? order : false}>
                  <TableSortLabel active={orderBy === column.id} direction={orderBy === column.id ? order : 'asc'} onClick={() => handleRequestSort(column.id)}>
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.id_paciente}>
                <TableCell component="th" scope="row">{row.id_paciente}</TableCell>
                <TableCell>{row.cep}</TableCell>
                <TableCell align="right">{row.distancia_rota_carro_km}</TableCell>
                <TableCell align="right">{row.distancia_transporte_km}</TableCell>
                <TableCell align="left">{row.tempo_transporte_hh_mm_ss}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ResultsTable;