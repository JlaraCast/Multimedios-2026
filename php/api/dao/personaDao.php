<?php
require_once __DIR__ . "/../models/persona.php";
require_once __DIR__ . "/../config/conexion.php";

class PersonaDao
{
    private $conexion;

    public function __construct()
    {
        $db = new Conexion();
        $this->conexion = $db->conectar();
    }

    public function listarPersonas()
    {
        $sql = "SELECT * FROM personas";
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function guardarPersona(Persona $persona)
    {
        $sql = "INSERT INTO personas (nombre, apellido, correo, fecha_creacion) VALUES (:nombre, :apellido, :correo, :fecha_creacion)";
        $stmt = $this->conexion->prepare($sql);
        return $stmt->execute([
            ':nombre'          => $persona->getNombre(),
            ':apellido'        => $persona->getApellido(),
            ':correo'          => $persona->getCorreo(),
            ':fecha_creacion'  => date('Y-m-d H:i:s'),
        ]);
    }
}
