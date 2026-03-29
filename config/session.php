<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function session_set_user(array $usuario): void {
    $_SESSION['user_id']   = $usuario['id'];
    $_SESSION['user_name'] = $usuario['nombre'];
    $_SESSION['user_email']= $usuario['email'];
}

function session_get_user(): ?array {
    if (!session_is_logged()) {
        return null;
    }
    return [
        'id'     => $_SESSION['user_id'],
        'nombre' => $_SESSION['user_name'],
        'email'  => $_SESSION['user_email'],
    ];
}

function session_is_logged(): bool {
    return isset($_SESSION['user_id']);
}
