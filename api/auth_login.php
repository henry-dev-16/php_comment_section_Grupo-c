<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$email    = trim($data['email']    ?? '');
$password = $data['password']      ?? '';

if ($email === '' || $password === '') {
    echo json_encode(['ok' => false, 'error' => 'Email y contraseña son obligatorios']);
    exit;
}

$db   = get_db();
$stmt = $db->prepare('SELECT id, nombre, email, password_hash FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
$usuario = $stmt->fetch();

if (!$usuario || !password_verify($password, $usuario['password_hash'])) {
    echo json_encode(['ok' => false, 'error' => 'Credenciales incorrectas']);
    exit;
}

session_set_user($usuario);

echo json_encode([
    'ok'      => true,
    'usuario' => [
        'id'     => $usuario['id'],
        'nombre' => $usuario['nombre'],
        'email'  => $usuario['email'],
    ],
]);
