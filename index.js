const express = require("express");
const request = require("request");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const {crearConexion, getConnection, resetData} = require("./database");
const app = express();

// Crear conexión db
crearConexion();

// Puertos del hosting o el 3000
const port = process.env.PORT || 3000;

// Url API REST Cloud Oracle
const url = "https://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts?offset=1100&limit=500";
/* ----------------------------------------------- */
// Inicio el motor de plantillas
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
/* ----------------------------------------------- */
// Método para analizar las solicitudes entrantes
app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({extended: true}));
/* ----------------------------------------------- */
// Carpeta de estaticos
app.use(express.static("public"));
/* ----------------------------------------------- */
// Ruta principal
app.get("/", (req, res) => { // Conexión base de datos
    request(
        // Ruta de la API de IXC
        url,
        (err, response, body) => {
            if (!err) {
                const contacts = JSON.parse(body);
                res.render("home", {
                    layout: "main",
                    contacts: contacts
                });
                // Guardar ID en LowDB para poder consultar en caso de desconexion con la API
                resetData();
                contacts.items.forEach((e) => {
                    getConnection().get("id").push(e.id).write();
                    console.log(e.id);
                });
            }
        }
    );
});
/* ----------------------------------------------- */
app.get("/form", (req, res) => {
    res.render("form", {layout: "main"});
});
/* ----------------------------------------------- */
// FORM POST CREAR CONTACTO
app.post("/form", (req, res) => {
    const form = req.body;
    const options = {
        uri: "https://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts",
        method: "POST",
        json: {
            login: form.login,
            name: {
                first: form.nombre,
                last: form.apellido
            }
        }
    };
    request(options, (error, response, body) => {
        if (!error) {
            res.render("form", {
                layout: "main",
                form: form
            });
        }
    });
});
/* ----------------------------------------------- */
// DELETE
app.get("/:id", (req, res) => {
    const id = req.params.id;
    const options = {
        uri: `https://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts/${id}`,
        method: "DELETE"
    };
    request(options, (error, response, body) => {
        if (!error) {
            res.render("home", {layout: "main"});
        }
    });
});
/* ----------------------------------------------- */

app.patch("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    // console.log(body)
    const options = {
        uri: `https://ICXCandidate:Welcome2021@imaginecx--tst2.custhelp.com/services/rest/connect/v1.3/contacts/${id}`,
        method: "PATCH",
        json: body
    };
    request(options, (error, response, body) => {
        if (!error) {
            res.render("home", {layout: "main"});
        }
    });
});

// Inicia el server
app.listen(port);