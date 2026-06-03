import Biblioteca from "../models/biblioteca.js";
import BibliotecaDAO from "../dao/bibliotecaDAO.js";

const dao = new BibliotecaDAO();

const b1 = new Biblioteca("Biblioteca Nacional", "San José", 1);
const b2 = new Biblioteca("Biblioteca UCR", "Ciudad Universitaria", 2);
const b3 = new Biblioteca("Biblioteca UNED", "Mercedes de Montes de Oca", 3);

dao.insertar(b1);
dao.insertar(b2);
dao.insertar(b3);

console.log("Todas las bibliotecas:");
console.log(dao.consultar());