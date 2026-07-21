<?php
require_once __DIR__ . "/../dao/personaDao.php";
require_once __DIR__ . "/../views/respuesta.php";

class PersonaController
{
    private $personaDao;

    public function __construct()
    {
        $this->personaDao = new personaDao();
    }

    public function listarPersonas()
    {

        respuestaJson($this->personaDao->listarPersonas());
    }
    
public function guardarPersona(){
    $json = json_decode(file_get_contents('php://input'),true);
     $persona = new Persona();
        $persona->setNombre($json['nombre']);
        $persona->setApellido($json['apellido']);
        $persona->setCorreo($json['correo']);
        $resultado = $this->personaDao->guardarPersona($persona);
        if ($resultado) {
            respuestaJson(['mensaje' => 'Persona guardada exitosamente']);
        } else {
            respuestaJson(['error' => 'Error al guardar la persona']);
        }
}
}
