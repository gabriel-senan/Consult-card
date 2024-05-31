document.addEventListener('DOMContentLoaded', function() {
    // Adiciona um evento de clique ao botão "Fazer Consulta"
    document.getElementById('consultar-button').addEventListener('click', function(event) {
        event.preventDefault(); // Previne o envio do formulário

        var cardNumber = document.getElementById('card-number').value.replace(/\D/g, ''); // Remove todos os não números
        var sum = 0;

        // Calcula a soma dos dígitos
        for (var i = 0; i < cardNumber.length; i++) {
            sum += parseInt(cardNumber[i]);
        }

        // Verifica se a soma é par ou ímpar e mostra a mensagem correspondente
        if (sum % 2 === 0) {
            mostrarMensagem('retorno-positivo-busca');
        } else {
            mostrarMensagem('retorno-negativo-busca');
        }
    });
});

// Função para mostrar a mensagem correspondente e ocultar a outra
function mostrarMensagem(id) {
    var retornoNegativo = document.getElementById('retorno-negativo-busca');
    var retornoPositivo = document.getElementById('retorno-positivo-busca');

    // Mostra a mensagem correspondente
    if (id === 'retorno-negativo-busca') {
        retornoNegativo.style.display = 'block';
        retornoPositivo.style.display = 'none';
    } else {
        retornoNegativo.style.display = 'none';
        retornoPositivo.style.display = 'block';
    }
}
