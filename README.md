# Sistema de Gestão de Aluguéis (SGA) - Protótipo

![Status](https://img.shields.io/badge/Status-Prot%C3%B3tipo-yellow)

Um protótipo de sistema web para gerenciamento de aluguéis, focado em pequenos proprietários. O sistema resolve a dificuldade da gestão manual de imóveis, inquilinos e controle de pagamentos.

[cite_start]Este projeto foi desenvolvido como atividade para a disciplina de **Engenharia e Projeto de Software** [cite: 1] [cite_start](Professor Dr. Romes Heriberto [cite: 3]).

## ✨ Funcionalidades Principais

O sistema permite ao proprietário (Usuário):

* [cite_start]**RF001:** Cadastrar e gerenciar seus Imóveis[cite: 38].
* [cite_start]**RF002:** Cadastrar e gerenciar seus Inquilinos[cite: 47].
* **RF003:** Associar um inquilino a um imóvel, criando um contrato.
* [cite_start]**RF004:** Marcar o pagamento mensal do aluguel como "Pago" (check-in)[cite: 47].
* **RF005:** Gerar um relatório básico de pagamentos em formato PDF.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (Puro)
* **Backend (BaaS):** Firebase
* **Banco de Dados:** Cloud Firestore
* **Autenticação:** Firebase Authentication
* **Relatórios:** jsPDF

## 🚀 Como Executar o Protótipo

Para rodar este projeto localmente ou em seu ambiente de desenvolvimento (como o Firebase Studio / IDX), você precisa configurar sua própria instância do Firebase.

**1. Crie um Projeto no Firebase:**
* Acesse o [Console do Firebase](https://console.firebase.google.com/).
* Clique em "Criar um novo projeto do Firebase".
* Siga os passos de configuração.

**2. Crie um App Web e Obtenha o `firebaseConfig`:**
* Dentro do seu novo projeto, no painel principal, clique no ícone `</>` (Adicionar app Web).
* Registre o app.
* O Firebase fornecerá um objeto `const firebaseConfig = { ... };`.
* **Copie** este objeto.

**3. Cole o `firebaseConfig`:**
* Abra o arquivo `app.js` do projeto.
* **Cole** o objeto `firebaseConfig` no topo do arquivo, substituindo o placeholder.

**4. Configure os Serviços do Firebase:**
* **Authentication:** No menu lateral do Console, vá em "Authentication" > "Sign-in method" e ative o provedor **"E-mail/senha"**.
* **Crie um Usuário:** Na aba "Users" do Authentication, crie um usuário de teste (ex: `admin@admin.com`, senha `123456`) para que você possa logar.
* **Cloud Firestore:** No menu lateral, vá em "Cloud Firestore" > "Criar banco de dados" e inicie no **"Modo de Teste"** (para permitir leituras e escritas durante o desenvolvimento).

**5. Execute o Projeto:**
* Se estiver usando o Firebase Studio / Project IDX, ele fornecerá um link de "Preview" ou um botão "Run" (Executar) que cria um servidor web.
* Se estiver rodando localmente (ex: no VS Code), abra o `index.html` usando uma extensão como o "Live Server" (não funciona clicando duas vezes no arquivo `index.html` por causa das restrições de segurança do navegador).

## ✒️ Autores

* Jéssica Bilac Gaspareto
* 
