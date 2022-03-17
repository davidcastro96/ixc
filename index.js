const express = require("express");
const request = require("request");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();

const url =
  "https://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts";
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
        //console.log(contacts);
      }
    }
  );
});
/* ----------------------------------------------- */
app.get("/form", (req, res) => {
  res.render("form", { layout: "main" });
});
/* ----------------------------------------------- */
app.post("/form", (req, res) => {
  const form = req.body;
  const options = {
    uri: url,
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
//Inicia el server
app.listen(3000);
