<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-light d-flex align-items-center min-vh-100">

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">

                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h4 class="text-center mb-4">Iniciar Sesión</h4>

                        <div id="login-error" class="alert alert-danger d-none"></div>

                        <form id="login-form">
                            <div class="mb-3">
                                <label for="login-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="login-email" placeholder="correo@ejemplo.com" required>
                            </div>
                            <div class="mb-3">
                                <label for="login-password" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="login-password" placeholder="Tu contraseña" required>
                            </div>
                            <button type="submit" class="btn btn-dark w-100" id="login-btn">Entrar</button>
                        </form>

                        <p class="text-center mt-3 mb-0">
                            <small>¿No tienes cuenta? <a href="register.php" class="text-decoration-none">Regístrate</a></small>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <script src="assets/js/auth.js"></script>
</body>
</html>
