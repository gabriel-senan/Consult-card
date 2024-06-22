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
    $card_number = $_POST['card-number'];
    $name_text = $_POST['name-text'];
    $cpf_text = $_POST['cpf-text'];
    $valid_thru_text = $_POST['valid-thru-text'];

    $sql = "INSERT INTO card_info (card_number, name_text, cpf_text, valid_thru_text)
    VALUES ('$card_number', '$name_text', '$cpf_text', '$valid_thru_text')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
