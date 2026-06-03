import biblioteca from '../models/biblioteca.js';
import BibliotecaDao from '../dao/bibliotecaDao.js';
const dao = new BibliotecaDao();

console.log(dao.consultar(1));