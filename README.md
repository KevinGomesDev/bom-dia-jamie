# 🌑 Bom Dia, Jamie!

Um jogo clicker/idle para dar bom dia ao Jamie... mas quanto mais você clica, mais sombrio fica! Começa feliz e ensolarado, termina no vazio existencial.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilos utilitários
- **Framer Motion** - Animações fluidas
- **React Confetti** - Efeitos de confete 🎉

## 🎮 Features

### Mecânicas de Jogo

- 💧 **Sistema de Clicker** - Clique para ganhar "luas"
- 📈 **Sistema de Níveis** - Ganhe XP e suba de nível a cada clique
- 🛒 **Loja de Upgrades** - Compre melhorias com temas sombrios
- ⏰ **Idle/AFK** - Ganhe luas automaticamente mesmo offline (até 8h)
- 💾 **Auto-save** - Progresso salvo automaticamente no localStorage
- 🔒 **Anti-cheat** - Sistema de hash para validar saves

### Upgrades Disponíveis

| Upgrade            | Efeito       | Descrição            |
| ------------------ | ------------ | -------------------- |
| 🥶 Café Frio       | +1/clique    | Café gelado          |
| 😵 Insônia         | +0.1/segundo | Geração automática   |
| 🍞 Pão Mofado      | +3/clique    | Café da manhã triste |
| 🎻 Playlist Triste | +0.5/segundo | Músicas melancólicas |
| 🐈‍⬛ Gato Preto      | +10/clique   | Companhia sombria    |
| 🌑 Escuridão       | +2/segundo   | O fim se aproxima    |
| 💀 O Vazio Eterno  | ???          | Segredo...           |

### Estágios Visuais (progressão invertida)

O jogo evolui visualmente conforme você progride:

1. ☀️ **Happy** - Início feliz e ensolarado
2. 😐 **Melancholy** - Começa a ficar triste
3. 🌧️ **Cloudy** - Nublado e cinza
4. ⛈️ **Storm** - Tempestade
5. 💀 **Abyss** - Abismo
6. 🕳️ **Void** - Vazio total

### Visuais

- ✨ Emojis flutuantes que mudam com o estágio
- ☁️ Nuvens animadas (claras → escuras)
- 🎊 Confete ao subir de nível
- 👤 Avatar do Jamie com estados visuais
- 💬 Mensagens dinâmicas baseadas no progresso

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura

```
bom-dia-jamie/
├── public/
├── src/
│   ├── components/
│   │   ├── FloatingEmojis.tsx  # Emojis flutuantes no fundo
│   │   ├── FunnyMessages.tsx   # Mensagens dinâmicas
│   │   ├── GameStats.tsx       # Estatísticas do jogo
│   │   ├── JamieAvatar.tsx     # Avatar com barra de XP
│   │   ├── Sun.tsx             # Componente do sol
│   │   ├── UpgradeElements.tsx # Elementos visuais dos upgrades
│   │   ├── UpgradeShop.tsx     # Loja de upgrades
│   │   └── VisualElements.tsx  # Elementos visuais dinâmicos
│   ├── App.tsx          # Componente principal + lógica do jogo
│   ├── main.tsx         # Entry point
│   └── index.css        # Estilos globais + backgrounds
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## ⚙️ Configuração

O jogo usa uma chave secreta para o sistema anti-cheat. Crie um arquivo `.env`:

```env
VITE_GAME_SECRET=sua_chave_secreta_aqui
```

---

Feito com 🖤 para Jamie

_"Bom dia... ou boa noite... ou... nada?"_
