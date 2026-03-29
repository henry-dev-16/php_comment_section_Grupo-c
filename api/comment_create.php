<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'ok' => false,
        'error' => 'Método no permitido'
    ]);
    exit;
}

if (!session_is_logged()) {
    echo json_encode([
        'ok' => false,
        'error' => 'No autenticado'
    ]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$contenido = trim($data['contenido'] ?? '');

if ($contenido === '') {
    echo json_encode([
        'ok' => false,
        'error' => 'El comentario no puede estar vacío'
    ]);
    exit;
}

try {
    $db = get_db();
    $usuario = session_get_user();

    $stmt = $db->prepare('INSERT INTO comentarios (usuario_id, contenido) VALUES (?, ?)');
    $stmt->execute([$usuario['id'], $contenido]);

    $nuevoId = (int)$db->lastInsertId();

    $stmt = $db->prepare('
        SELECT c.id, c.usuario_id, c.contenido, c.creado_en, u.nombre
        FROM comentarios c
        INNER JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.id = ?
    ');
    $stmt->execute([$nuevoId]);

    $comentario = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'ok' => true,
        'comentario' => [
            'id' => (int)$comentario['id'],
            'usuario_id' => (int)$comentario['usuario_id'],
            'contenido' => $comentario['contenido'],
            'creado_en' => $comentario['creado_en'],
            'nombre' => $comentario['nombre'],
            'es_mio' => true
        ]
    ]);
} catch (Throwable $e) {
    echo json_encode([
        'ok' => false,
        'error' => 'Error al crear comentario'
    ]);
}