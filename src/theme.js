// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

// Função para gerar o tema baseado no modo (light/dark)
export const getTheme = (mode) => {
  const isDark = mode === 'dark';

  // Cores base estilo Apple
  const backgroundDefault = isDark ? '#000000' : '#f5f5f7'; // Fundo geral
  const paperBackground = isDark ? 'rgba(28, 28, 30, 0.75)' : 'rgba(255, 255, 255, 0.65)'; // Efeito vidro
  const primaryMain = '#007AFF'; // Azul iOS

  return createTheme({
    palette: {
      mode,
      primary: { main: primaryMain },
      secondary: { main: '#5856D6' }, // Roxo iOS
      background: {
        default: backgroundDefault,
        paper: paperBackground,
      },
      text: {
        primary: isDark ? '#F5F5F7' : '#1D1D1F',
        secondary: isDark ? '#86868b' : '#86868b',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 20, // Cantos mais arredondados (estilo iOS)
    },
    components: {
      // Configuração Global do "Liquid Glass"
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Remove overlay padrão do Material Dark
            backgroundColor: paperBackground,
            backdropFilter: 'blur(20px) saturate(180%)', // O segredo do "Glass"
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)'}`,
            boxShadow: isDark 
              ? '0 10px 30px rgba(0,0,0,0.5)' 
              : '0 10px 30px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none', // Estilo mais limpo sem Uppercase
            borderRadius: 12,
            fontWeight: 600,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          },
        },
      },
    },
  });
};