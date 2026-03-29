<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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
$comentarioId = isset($data['id']) ? (int) $data['id'] : 0;

if ($comentarioId <= 0) {
    echo json_encode([
        'ok' => false,
        'error' => 'ID inválido'
    ]);
    exit;
}

try {
    $db = get_db();
    $usuario = session_get_user();

    $stmt = $db->prepare('SELECT id, usuario_id FROM comentarios WHERE id = ?');
    $stmt->execute([$comentarioId]);
    $comentario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$comentario) {
        echo json_encode([
            'ok' => false,
            'error' => 'Comentario no encontrado'
        ]);
        exit;
    }

    if ((int) $comentario['usuario_id'] !== (int) $usuario['id']) {
        echo json_encode([
            'ok' => false,
            'error' => 'No autorizado'
        ]);
        exit;
    }

    $stmt = $db->prepare('DELETE FROM comentarios WHERE id = ?');
    $stmt->execute([$comentarioId]);

    echo json_encode([
        'ok' => true,
        'message' => 'Comentario eliminado'
    ]);
} catch (Throwable $e) {
    echo json_encode([
        'ok' => false,
        'error' => 'Error al eliminar comentario'
    ]);
}