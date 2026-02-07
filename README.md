# Telos CRM – Frontend (Vue 3)

Frontend do **Telos CRM**, desenvolvido com **Vue 3**, **Vite** e **Pinia**, responsável pela interface administrativa do sistema, consumindo a API Laravel.

---

## 🧰 Stack utilizada

* **Vue 3** (Composition API)
* **Vite**
* **Pinia** (gerenciamento de estado)
* **Vue Router**
* **Axios** (cliente HTTP)
* **TailwindCSS + DaisyUI**

---

## 📁 Estrutura do projeto

```
src/
 ├── api/            # Configuração do Axios (http.js)
 ├── components/     # Componentes reutilizáveis
 ├── directives/     # Diretivas customizadas para manipular DOM diretamente
 ├── composables/    # Composables globais
 ├── layouts/        # Layout principal (sidebar, header)
 ├── router/         # Rotas e guards
 ├── stores/         # Stores Pinia
 ├── views/          # Páginas (Dashboard, Users, Orders...)
 └── main.js
```

---

## ⚙️ Configuração do ambiente

### 1️⃣ Pré-requisitos

* Node.js **20+**
* NPM ou Yarn

---

### 2️⃣ Instalação

```bash
npm install
```

---

### 3️⃣ Variáveis de ambiente

Copie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

---

## ▶️ Executando o projeto

O frontend é executado via **Docker**.

```bash
docker compose up --build
```

Após subir os containers, a aplicação ficará disponível em:

```
http://localhost:5173
```

```

---

## 🔐 Autenticação

- Login via API (Bearer Token)
- Token armazenado no **Pinia + localStorage**
- Interceptor Axios injeta o token automaticamente

Ao **logout**:
- Todas as stores são resetadas
- Token removido
- Redirecionamento para `/login`

---

## 🛡️ Controle de acesso

### Perfis suportados

- **admin**
- **seller**

### Regras

| Recurso | Admin | Seller |
|------|------|--------|
| Dashboard | ✅ | ✅ |
| Usuários | ✅ | ❌ |
| Fornecedores | ✅ | ❌ |
| Produtos | ✅ | ✅ |
| Pedidos | ✅ | ✅ |

- Menus são exibidos conforme perfil
- Rotas protegidas com **router guards**
- Backend valida permissões (Policies)

---

## ⚠️ Tratamento global de erros

O Axios possui **interceptor global**, responsável por:

- `401` → logout automático
- `403` → mensagem de permissão
- `422` → exibe erro de validação do backend
- `500` → erro genérico

Isso evita `try/catch` repetido nos componentes.

---

## 📮 Postman

A API utilizada por este frontend possui uma coleção Postman compartilhada.

https://www.postman.com/viniciusdornelas/telos-api/overview

