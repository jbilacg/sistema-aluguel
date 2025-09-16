//
// PASSO 1: Cole seu objeto firebaseConfig aqui
// (Aquele que você pegou do Console do Firebase)
//
const firebaseConfig = {
    apiKey: "SEU_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Referências dos serviços do Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Referências dos elementos do HTML
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

const dashboardList = document.getElementById('dashboard-list');
const formAddImovel = document.getElementById('form-add-imovel');
const formAddInquilino = document.getElementById('form-add-inquilino');
const formAddContrato = document.getElementById('form-add-contrato');
const selectImovel = document.getElementById('select-imovel');
const selectInquilino = document.getElementById('select-inquilino');
const btnGerarRelatorio = document.getElementById('btn-gerar-relatorio');

// Variáveis globais para guardar dados
let globalImoveis = {};
let globalInquilinos = {};
let globalContratos = [];

// --- 1. LÓGICA DE AUTENTICAÇÃO ---

// Observador do estado de autenticação
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuário está logado
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block';
        // Carrega todos os dados do usuário
        carregarDados();
    } else {
        // Usuário está deslogado
        loginContainer.style.display = 'block';
        appContainer.style.display = 'none';
    }
});

// Evento de Login
btnLogin.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert("Erro no login: " + error.message));
});

// Evento de Logout
btnLogout.addEventListener('click', () => {
    auth.signOut();
});


// --- 2. LÓGICA PRINCIPAL (CARREGAR DADOS) ---

function carregarDados() {
    // Limpa dados antigos
    globalImoveis = {};
    globalInquilinos = {};
    globalContratos = [];
    selectImovel.innerHTML = '<option value="">Selecione um Imóvel Disponível</option>';
    selectInquilino.innerHTML = '<option value="">Selecione um Inquilino</option>';

    // Carrega Imóveis
    db.collection('imoveis').onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => {
            globalImoveis[doc.id] = doc.data();
            // Adiciona ao select (RF003)
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().endereco;
            selectImovel.appendChild(option);
        });
    });

    // Carrega Inquilinos
    db.collection('inquilinos').onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => {
            globalInquilinos[doc.id] = doc.data();
            // Adiciona ao select (RF003)
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().nome;
            selectInquilino.appendChild(option);
        });
    });

    // Carrega Contratos e Pagamentos (RF004)
    carregarDashboard();
}

// --- 3. RF001 - CADASTRAR IMÓVEL ---
formAddImovel.addEventListener('submit', (e) => {
    e.preventDefault();
    const endereco = document.getElementById('imovel-endereco').value;
    const valor = parseFloat(document.getElementById('imovel-valor').value);

    db.collection('imoveis').add({
        endereco: endereco,
        valorAluguel: valor
    }).then(() => {
        alert("Imóvel cadastrado!");
        formAddImovel.reset();
        carregarDados(); // Recarrega os selects
    }).catch(e => alert("Erro: " + e.message));
});

// --- 4. RF002 - CADASTRAR INQUILINO ---
formAddInquilino.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('inquilino-nome').value;
    const cpf = document.getElementById('inquilino-cpf').value;

    db.collection('inquilinos').add({
        nome: nome,
        cpf: cpf
    }).then(() => {
        alert("Inquilino cadastrado!");
        formAddInquilino.reset();
        carregarDados(); // Recarrega os selects
    }).catch(e => alert("Erro: " + e.message));
});

// --- 5. RF003 - ASSOCIAR (CRIAR CONTRATO) ---
formAddContrato.addEventListener('submit', (e) => {
    e.preventDefault();
    const imovelId = selectImovel.value;
    const inquilinoId = selectInquilino.value;

    if (!imovelId || !inquilinoId) {
        alert("Selecione um imóvel E um inquilino.");
        return;
    }

    db.collection('contratos').add({
        imovelId: imovelId,
        inquilinoId: inquilinoId,
        ativo: true
    }).then(() => {
        alert("Contrato criado!");
        formAddContrato.reset();
        carregarDashboard(); // Atualiza o dashboard
    }).catch(e => alert("Erro: "e.message));
});


// --- 6. RF004 - DASHBOARD DE PAGAMENTO ---

async function carregarDashboard() {
    dashboardList.innerHTML = 'Carregando...'; // Limpa a lista
    globalContratos = []; // Reseta contratos

    // Pega o mês e ano atual (ex: "09-2025")
    const hoje = new Date();
    const mesAnoAtual = `${(hoje.getMonth() + 1).toString().padStart(2, '0')}-${hoje.getFullYear()}`;

    // 1. Buscar todos os pagamentos feitos neste mês
    const pagamentosSnapshot = await db.collection('pagamentos')
                                     .where('mesAno', '==', mesAnoAtual)
                                     .get();
    
    // Cria um mapa para saber quais contratos já pagaram
    const contratosPagos = {};
    pagamentosSnapshot.docs.forEach(doc => {
        contratosPagos[doc.data().contratoId] = true;
    });

    // 2. Buscar todos os contratos ativos
    const contratosSnapshot = await db.collection('contratos')
                                      .where('ativo', '==', true)
                                      .get();
    
    dashboardList.innerHTML = ''; // Limpa "Carregando"
    
    contratosSnapshot.docs.forEach(doc => {
        const contrato = doc.data();
        const contratoId = doc.id;
        globalContratos.push({ id: contratoId, ...contrato }); // Salva para o relatório

        // Pega os detalhes do imóvel e inquilino (dos dados já carregados)
        const imovel = globalImoveis[contrato.imovelId];
        const inquilino = globalInquilinos[contrato.inquilinoId];

        if (!imovel || !inquilino) {
            console.warn("Contrato com dados órfãos:", contratoId);
            return;
        }

        // 3. Renderizar o item no dashboard
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-pagamento');
        
        const infoP = document.createElement('p');
        infoP.classList.add('info');
        infoP.innerHTML = `<span>${inquilino.nome}</span> (Imóvel: ${imovel.endereco} - R$ ${imovel.valorAluguel})`;
        
        const btnPagar = document.createElement('button');
        btnPagar.classList.add('btn-pagar');

        // Verifica se este contrato está na lista de pagos
        if (contratosPagos[contratoId]) {
            itemDiv.classList.add('pago');
            btnPagar.textContent = 'Pago';
            btnPagar.disabled = true;
        } else {
            btnPagar.textContent = 'Marcar como Pago';
            btnPagar.onclick = () => registrarPagamento(contratoId, mesAnoAtual);
        }

        itemDiv.appendChild(infoP);
        itemDiv.appendChild(btnPagar);
        dashboardList.appendChild(itemDiv);
    });
}

// Função que efetiva o pagamento (o "check")
function registrarPagamento(contratoId, mesAno) {
    db.collection('pagamentos').add({
        contratoId: contratoId,
        mesAno: mesAno,
        dataPagamento: new Date()
    }).then(() => {
        alert("Pagamento registrado!");
        carregarDashboard(); // Atualiza a tela
    }).catch(e => alert("Erro ao registrar: " + e.message));
}


// --- 7. RF005 - GERAR RELATÓRIO PDF ---
btnGerarRelatorio.addEventListener('click', async () => {
    alert("Gerando relatório... Isso pode levar alguns segundos.");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório de Pagamentos - SGA", 14, 22);

    const corpoTabela = [];
    
    // Pega o mês e ano atual
    const hoje = new Date();
    const mesAnoAtual = `${(hoje.getMonth() + 1).toString().padStart(2, '0')}-${hoje.getFullYear()}`;

    // Re-busca pagamentos para garantir dados frescos
    const pagamentosSnapshot = await db.collection('pagamentos')
                                     .where('mesAno', '==', mesAnoAtual)
                                     .get();
    const contratosPagos = {};
    pagamentosSnapshot.docs.forEach(doc => {
        contratosPagos[doc.data().contratoId] = true;
    });

    // Processa os contratos que já temos
    globalContratos.forEach(contrato => {
        const imovel = globalImoveis[contrato.imovelId];
        const inquilino = globalInquilinos[contrato.inquilinoId];

        if (imovel && inquilino) {
            const status = contratosPagos[contrato.id] ? "Pago" : "Pendente";
            corpoTabela.push([
                inquilino.nome,
                imovel.endereco,
                imovel.valorAluguel.toFixed(2),
                status
            ]);
        }
    });

    // Usa a biblioteca autoTable para criar a tabela
    doc.autoTable({
        startY: 30,
        head: [['Inquilino', 'Imóvel', 'Valor (R$)', 'Status Mês Atual']],
        body: corpoTabela,
    });

    // Salva o PDF
    doc.save(`relatorio_pagamentos_${mesAnoAtual}.pdf`);
});
