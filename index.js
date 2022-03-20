const express = require("express");
const request = require("request");
const sqlite3 = require("sqlite3").verbose();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();

let db = new sqlite3.Database("./db/contacts.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("conectado a la base de datos");
});

const url =
  "https://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts?offset=1100&limit=500";
/* ----------------------------------------------- */
//inicio el motor de plantillas
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
/* ----------------------------------------------- */
//método para analizar las solicitudes entrantes
app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: true }));
/* ----------------------------------------------- */
//carpeta de estaticos
app.use(express.static("public"));
/* ----------------------------------------------- */
//ruta
app.get("/", (req, res) => {
  request(
    //ruta de la API de IXC
    url,
    (err, response, body) => {
      if (!err) {
        const contacts = JSON.parse(body);
        res.render("home", {
          layout: "main",
          contacts: contacts,
        });
      }
    }
  );
});
/* ----------------------------------------------- */
app.get("/form", (req, res) => {
  res.render("form", { layout: "main" });
});
/* ----------------------------------------------- */
//FORM POST CREAR CONTACTO
app.post("/form", (req, res) => {
  const form = req.body;
  const options = {
    uri: "https://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts",
    method: "POST",
    json: {
      login: form.login,
      name: {
        first: form.nombre,
        last: form.apellido,
      },
    },
  };
  request(options, (error, response, body) => {
    if (!error) {
      res.render("form", { layout: "main", form: form });
    }
  });
});
/* ----------------------------------------------- */
// DELETE
app.get("/:id", (req, res) => {
  const id = req.params.id;
  const options = {
    uri: `https://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts/${id}`,
    method: "DELETE",
  };
  request(options, (error, response, body) => {
    if (!error) {
      res.render("home", {
        layout: "main",
      });
    }
  });
});
/* ----------------------------------------------- */

app.patch("/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body
  console.log(body)
  const options = {
    uri: `https://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts/${id}`,
    method: "PATCH",
    json: body
  };
  request(options, (error, response, body) => {
    if (!error) {
      res.render("home", {
        layout: "main",
      });
    }
  });
});

//Inicia el server
app.listen(3000);
