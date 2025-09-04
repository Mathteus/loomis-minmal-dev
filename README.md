# Frontend - Next.js

## Visão Geral

Aplicação frontend construída com Next.js e TypeScript. Responsável pela interface, interação do usuário e comunicação com a API backend.

---

## Tecnologias principais

- React
- Next.js
- TypeScript
- CSS Modules / Styled Components (conforme padrão do projeto)
- Autenticação via JWT

---

## Como executar localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure variáveis de ambiente (`.env.local`) com URLs e chaves.
4. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000`

---

## Qualidade de código

- Husky + lint-staged configurados para pré-commit.
- ESLint e Prettier configurados.

---

## Testes

- Recomendado usar Jest e React Testing Library.
- Execute:
  ```bash
  npm run test
  ```

---

## Deploy

- Compatível com Vercel, Netlify, AWS Amplify e similares.
- CI/CD configurado via GitHub Actions.

---

## Contato

Entre em contato com a equipe frontend para dúvidas.