<?php
header('Content-Type: application/json');

require_once __DIR__ . '/config/conexion.php';

$db = new Conexion();

try {
    $pdo = $db->conectar();

    // Verificar que la BD existe y listar sus tablas
    $stmt  = $pdo->query("SHOW TABLES");
    $tablas = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'status'  => 'ok',
        'mensaje' => 'Conexión exitosa',
        'base'    => 'basepersona',
        'tablas'  => $tablas,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'mensaje' => $e->getMessage(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
