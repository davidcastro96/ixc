const low = require("lowdb");
// Archivo asincronico de base de datos en JSON
const fileAsincronico = require("lowdb/adapters/FileAsync");
// Creación de la db

let db;

async function crearConexion() {
  const createDB = new fileAsincronico("db.json");
  db = await low(createDB);
  db.defaults({ id: [] }).write();
}
// Devolver la bd
const getConnection = () => {
  return db;
};

function resetData() {
  const newState = [];
  db.setState(newState);
}

// Exportar funciones / métodos
module.exports = {
  crearConexion,
  getConnection,
  resetData
};
