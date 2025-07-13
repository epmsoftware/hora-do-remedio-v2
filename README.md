
# Hora do Remédio — Versão Atualizada

Este repositório contém a versão mais recente do projeto **Hora do Remédio**, com todas as atualizações aplicadas no sistema.

## Etapas para publicar este projeto em um novo repositório GitHub

Se você já tem o projeto em sua máquina mas deseja subir **em um novo repositório**, siga os passos abaixo:

---

### 1. Remover repositório Git antigo

Abra o terminal PowerShell na pasta do projeto e execute:

```powershell
Remove-Item -Recurse -Force .git
```

---

### 2. Iniciar um novo repositório Git

```bash
git init
```

---

### 3. Conectar ao novo repositório no GitHub

Substitua a URL pelo endereço real do seu novo repositório:

```bash
git remote add origin https://github.com/seu-usuario/novo-repositorio.git
```

---

### 4. Adicionar todos os arquivos do projeto

```bash
git add .
```

---

### 5. Fazer o primeiro commit

```bash
git commit -m "Versão atualizada"
```

---

### 6. Enviar (push) para o novo repositório

```bash
git push -u origin main
```

---

### Observação

- Esse processo substitui o repositório anterior e conecta seu projeto a um **novo repositório no GitHub**.
- Lembre-se de atualizar a URL no passo 3 com o link correto do seu novo repositório.
