<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Jared Ramirez">
    <title>Deja tu comentario</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body class="bg-light">

<nav class="navbar navbar-dark bg-dark shadow-sm">
    <div class="container">
        <span class="navbar-brand fw-semibold">
            <i class="bi bi-chat-dots"></i> Sistema de Comentarios
        </span>
        <button class="btn btn-outline-light btn-sm" id="logout-btn">
            <i class="bi bi-box-arrow-right"></i> Salir
        </button>
    </div>
</nav>


<div class="container mt-5" style="max-width: 700px;">

    <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">

            <div class="d-flex align-items-center mb-3">
                <div class="avatar me-2">U</div>
                <strong>Publicar comentario</strong>
            </div>

            <textarea 
                id="comentario-texto" 
                class="form-control mb-3"
                rows="3"
                placeholder="¿Qué estás pensando?"
            ></textarea>

            <div class="text-end">
                <button id="enviar-btn" class="btn btn-dark">
                    <i class="bi bi-send"></i> Publicar
                </button>
            </div>

        </div>
    </div>

    <div id="lista-comentarios"></div>

</div>
</body>
</html>