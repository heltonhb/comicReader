# Gibiteca HQ

Leitor interativo de histórias em quadrinhos (HQs) com experiência imersiva de leitura.

## 🚀 Funcionalidades

### Modos de Leitura

- **Flipbook**: Experiência clássica com páginas que viram, sombras e animações
- **Webtoon**: Scroll vertical contínuo para leitura fluida

### Navegação

- Setas do teclado (← →) para virar páginas
- Gestos de swipe em dispositivos tácteis
- Clique nas laterais para avançar/voltar
- Miniaturas navegáveis
- Zoom com pinch (mobile) e scroll (desktop)

### Sincronização

- Progresso de leitura guardado localmente
- Sincronização com Firebase (login com Google)
- Funciona offline (PWA)

### UX

- Fullscreen automático ao abrir volume
- Controles que aparecem/ocultam automaticamente
- Som ao virar página
- Barra de progresso com número da página
- Tema adaptável (claro/escuro baseado na cor da página)

## 🛠️ Instalação

```bash
npm install
```

## ⚙️ Configuração

Criar ficheiro `.env` na raiz com as tuas credenciais Firebase:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 🧪 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build rápido (sem converter PDFs)
npm run build:fast

# Build com conversão de PDFs
npm run build

# Verificar erros de lint
npm run lint

# Verificar e corrigir formatação
npm run format:check
npm run format

# Executar testes
npm run test

# Executar testes com cobertura
npm run test:coverage
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
├── test/                # Testes
├── assets/              # Imagens e recursos
├── volumes.js           # Registo de volumes disponíveis
├── firebase.js          # Configuração Firebase
├── analytics.js         # Mixpanel tracking
└── router.jsx           # Rotas da aplicação
```

## 📦 Adicionar um Novo Volume

1. **Preparar imagens**: Converter PDF para WebP (1920px largura, qualidade 85)

2. **Estrutura de pastas**: `public/volumes/nome-do-volume/`

3. **Criar metadata.json**: `{"numPages": 48, "title": "...", "author": "..."}`

4. **Registar em `src/volumes.js`**: Adicionar objeto ao array VOLUMES

5. **Build e deploy**: `npm run build`

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | Verificar erros de código |
| `npm run format` | Formatar código |
| `npm run test` | Executar testes |

## 🎨 Design System

- **Cor primária**: `#D4AF37` (dourado)
- **Fundo**: `#0a0a0a` (quase preto)

## 📝 Licença

MIT