<?php
echo "Hello, World!<br>";
$nombre = "Juan";
echo "Mi nombre es " . $nombre . "<br>";
$edad = 30;
$estado = TRUE;
$datosdecimales = 3.14;
// concatenar variables
echo "Mi nombre es " . $nombre . " y tengo " . $edad . " años.<br>";

if($edad > 18) {
    echo "Soy mayor de edad.<br>";
} elseif($edad == 18) {
    echo "Tengo exactamente 18 años.<br>";
}
else {
    echo "Soy menor de edad.<br>";
}

$si =1;

while($si <= 5) {
    echo "<h1>El número es: " . $si . "</h1><br>";
    $si++;
}
for($i = 1; $i <= 5; $i++) {
    echo "<h1>El número es: " . $i . "</h1><br>";
}

$arregloNombres = array("Juan", "María", "Pedro");
$arregloNombres[] = "Ana"; // Agregar un nuevo nombre al arreglo
$arregloNombres2 = ["Luis", "Sofía", "Carlos"]; // Otra forma de crear un arreglo
foreach($arregloNombres as $nombre) {
    echo "El nombre es: " . $nombre . "<br>";
}

function saludo() {
    return "¡Hola, mundo!";
}

function saludar($nombre) {
    return "Hola, " . $nombre . "!";
}
echo saludo();
echo "<br>";
echo saludar("Juan");
?>