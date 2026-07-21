<?php
//CREATE TABLE `personas` (
//	`id` INT NULL,
//	`nombre` VARCHAR(50) NULL DEFAULT NULL,
//	`apellido` VARCHAR(50) NULL DEFAULT NULL,
//	`correo` VARCHAR(50) NULL DEFAULT NULL,
//	`fecha_creacion` VARCHAR(50) NULL DEFAULT NULL
//)
class Persona {
    private $id;
    private $nombre;
    private $apellido;
    private $correo;
    private $fecha_creacion;

    public function __construct() {}

    // Getters y setters para cada propiedad
    public function getId() {
        return $this->id;
    }
    public function setId($id) {
        $this->id = $id;
    }

    public function getNombre() {
        return $this->nombre;
    }
    public function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    public function getApellido() {
        return $this->apellido;
    }
    public function setApellido($apellido) {
        $this->apellido = $apellido;
    }

    public function getCorreo() {
        return $this->correo;
    }
    public function setCorreo($correo) {
        $this->correo = $correo;
    }

    public function getFechaCreacion() {
        return $this->fecha_creacion;
    }
    public function setFechaCreacion($fecha_creacion) {
        $this->fecha_creacion = $fecha_creacion;
    }

}
?>