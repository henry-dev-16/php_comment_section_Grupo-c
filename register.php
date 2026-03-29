<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="icon" href="assets/img/icono.ico" type="image/x-icon">
</head>
<body class="bg-light d-flex align-items-center min-vh-100">

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">

                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h4 class="text-center mb-4">Crear Cuenta</h4>

                        <div id="register-error" class="alert alert-danger d-none"></div>

                        <form id="register-form">
                            <div class="mb-3">
                                <label for="register-nombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="register-nombre" placeholder="Tu nombre" required>
                            </div>
                            <div class="mb-3">
                                <label for="register-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="register-email" placeholder="correo@ejemplo.com" required>
                            </div>
                            <div class="mb-3">
                                <label for="register-password" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="register-password" placeholder="Mínimo 6 caracteres" required>
                            </div>
                            <button type="submit" class="btn btn-dark w-100" id="register-btn">Registrarse</button>
                        </form>

                        <p class="text-center mt-3 mb-0">
                            <small>¿Ya tienes cuenta? <a href="login.php" class="text-decoration-none">Inicia sesión</a></small>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <script src="assets/js/auth.js"></script>
</body>
</html>
