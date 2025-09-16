# Sistema de Gestão de Aluguéis (SGA) - Protótipo

![Status](https://img.shields.io/badge/Status-Prot%C3%B3tipo-yellow)

Um protótipo de sistema web para gerenciamento de aluguéis, focado em pequenos proprietários. O sistema resolve a dificuldade da gestão manual de imóveis, inquilinos e controle de pagamentos.

Este projeto foi desenvolvido como atividade para a disciplina de **Engenharia e Projeto de Software** (Professor Dr. Romes Heriberto).

## ✨ Funcionalidades Principais (Requisitos)

* **RF001:** Cadastrar e gerenciar seus Imóveis.
* **RF002:** Cadastrar e gerenciar seus Inquilinos.
* **RF003:** Associar um inquilino a um imóvel, criando um contrato.
* **RF004:** Marcar o pagamento mensal do aluguel como "Pago" (check-in).
* **RF005:** Gerar um relatório básico de pagamentos em formato PDF.

## 🗂️ Arquivos do Projeto

Este repositório contém os 3 arquivos principais que compõem o protótipo funcional:

* **`index.html`**: O arquivo principal. Contém a estrutura HTML da tela de login e do painel de controle principal. É ele que carrega os scripts do Firebase e o `app.js`.
* **`style.css`**: A folha de estilos. Contém todo o CSS para dar ao sistema uma aparência amigável e limpa (NF001 - Usabilidade).
* **`app.js`**: O "cérebro" do protótipo. Este arquivo JavaScript contém toda a lógica para:
    * Conectar ao Firebase (usando o `firebaseConfig`).
    * Gerenciar o login e logout do usuário.
    * Realizar os cadastros (Imóvel, Inquilino, Contrato).
    * Renderizar o painel de pagamentos (RF004).
    * Gerar o relatório em PDF (RF005).

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (Puro)
* **Backend (BaaS):** Firebase
* **Banco de Dados:** Cloud Firestore
* **Autenticação:** Firebase Authentication
* **Relatórios:** jsPDF (carregado via CDN)

## 🚀 Como Executar o Protótipo

Para rodar este projeto, você precisa configurar sua própria instância do Firebase.

**1. Crie um Projeto no Firebase:**
* Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto.

**2. Crie um App Web e Obtenha o `firebaseConfig`:**
* No painel do seu projeto, clique no ícone `</>` (Adicionar app Web).
* Registre o app e copie o objeto `const firebaseConfig = { ... };`.

**3. Cole o `firebaseConfig`:**
* Abra o arquivo `app.js` e cole o seu `firebaseConfig` no local indicado (substituindo o placeholder).

**4. Configure os Serviços do Firebase:**
* **Authentication:** No Console, ative o provedor **"E-mail/senha"**. Depois, na aba "Users", crie seu usuário de login (o "proprietário").
* **Cloud Firestore:** No Console, crie um banco de dados e inicie no **"Modo de Teste"**.

**5. Execute o Projeto:**
* Abra o `index.html` usando uma extensão como o "Live Server" (VS Code) ou o
