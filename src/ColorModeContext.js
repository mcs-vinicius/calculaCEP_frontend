import { createContext } from 'react';

// Criação do Contexto isolado
export const ColorModeContext = createContext({ toggleColorMode: () => {} });