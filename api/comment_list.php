<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'ok' => false,
        'error' => 'Método no permitido'
    ]);
    exit;
}

try {
    $db = get_db();

    $usuario = session_get_user();
    $usuarioId = $usuario['id'] ?? null;

    $pagina = isset($_GET['pagina']) ? (int) $_GET['pagina'] : 1;
    if ($pagina < 1) {
        $pagina = 1;
    }

    $porPagina = 10;
    $offset = ($pagina - 1) * $porPagina;

    $stmtTotal = $db->query('SELECT COUNT(*) AS total FROM comentarios');
    $total = (int) $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];
    $totalPaginas = (int) ceil($total / $porPagina);

    $sql = '
        SELECT c.id, c.usuario_id, c.contenido, c.creado_en, u.nombre
        FROM comentarios c
        INNER JOIN usuarios u ON c.usuario_id = u.id
        ORDER BY c.creado_en DESC, c.id DESC
        LIMIT :limite OFFSET :offset
    ';

    $stmt = $db->prepare($sql);
    $stmt->bindValue(':limite', $porPagina, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $comentarios = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $comentarios[] = [
            'id' => (int) $row['id'],
            'usuario_id' => (int) $row['usuario_id'],
            'contenido' => $row['contenido'],
            'creado_en' => $row['creado_en'],
            'nombre' => $row['nombre'],
            'es_mio' => $usuarioId !== null && (int) $row['usuario_id'] === (int) $usuarioId
        ];
    }

    echo json_encode([
        'ok' => true,
        'comentarios' => $comentarios,
        'paginacion' => [
            'pagina' => $pagina,
            'por_pagina' => $porPagina,
            'total' => $total,
            'total_paginas' => $totalPaginas
        ]
    ]);
} catch (Throwable $e) {
    echo json_encode([
        'ok' => false,
        'error' => 'Error al listar comentarios'
    ]);
}