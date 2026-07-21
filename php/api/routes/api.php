<?php
require_once __DIR__ . "/../controller/personaController.php";
$controller = new PersonaController();

$metodo = $_SERVER['REQUEST_METHOD'];
switch ($metodo) {
    case 'GET':
        $controller->listarPersonas();
        break;
    case 'POST':
        $controller->guardarPersona();
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}