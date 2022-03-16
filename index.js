const express = require("express");
const request = require("request");
const exphbs = require("express-handlebars");
const bp = require("body-parser");
const app = express();

//inicio el motor de plantillas
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//método para analizar las solicitudes entrantes
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//ruta
app.get("/", (req, res) => {
  request(
    //ruta de la API de IXC
    "http://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts",
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

app.get("/crear", (req, res) => {
  res.render("crear", {
    layout: "main",
  });
});

app.post("/form", (req, res) => {
  res.send(req.body);
});

//Inicia el server
app.listen(3000);
