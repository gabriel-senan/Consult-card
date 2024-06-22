<?php
$servername = "localhost";
$username = "gabriel";
$password = "123";
$dbname = "card_data";

// Criar conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexão
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitização e validação dos dados
    $card_number = filter_input(INPUT_POST, 'card-number', FILTER_SANITIZE_STRING);
    $name_text = filter_input(INPUT_POST, 'name-text', FILTER_SANITIZE_STRING);
    $cpf_text = filter_input(INPUT_POST, 'cpf-text', FILTER_SANITIZE_STRING);
    $valid_thru_text = filter_input(INPUT_POST, 'valid-thru-text', FILTER_SANITIZE_STRING);

    // Preparar a declaração SQL
    $stmt = $conn->prepare("INSERT INTO card_info (card_number, name_text, cpf_text, valid_thru_text) VALUES (?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("ssss", $card_number, $name_text, $cpf_text, $valid_thru_text);

        // Executar e verificar a inserção
        if ($stmt->execute()) {
            echo "Novo registro criado com sucesso";
        } else {
            echo "Erro: " . $stmt->error;
        }

        // Fechar a declaração
        $stmt->close();
    } else {
        echo "Erro na preparação da declaração: " . $conn->error;
    }
}

// Fechar a conexão
$conn->close();
?>

