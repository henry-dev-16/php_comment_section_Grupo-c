<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$nombre   = trim($data['nombre']   ?? '');
$email    = trim($data['email']    ?? '');
$password = $data['password']      ?? '';

if ($nombre === '' || $email === '' || $password === '') {
    echo json_encode(['ok' => false, 'error' => 'Todos los campos son obligatorios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok' => false, 'error' => 'Email no válido']);
    exit;
}

$db = get_db();

$stmt = $db->prepare('SELECT id FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['ok' => false, 'error' => 'Este email ya está registrado']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare('INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)');
$stmt->execute([$nombre, $email, $hash]);

$usuario = [
    'id'     => $db->lastInsertId(),
    'nombre' => $nombre,
    'email'  => $email,
];

session_set_user($usuario);

echo json_encode(['ok' => true, 'usuario' => $usuario]);
