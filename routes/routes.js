const fs = require("fs");
const urlHandler = require("url");
const path = require("path");

const controlUsuarios = require("./../controllers/controller_usuarios");
const controlTransferencias = require("./../controllers/controller_transferencia");

const routes = (req, res) => {

    const { url, method } = req;
    const { pathname, query: params } = urlHandler.parse(req.url, true);
    const extension = path.extname(url);
    let fileType;

    // *** Paths para servir el HTML ***
    if (pathname === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.readFile('./public/index.html', 'utf8', (err, data) => {
            res.end(data)
        });
    };

    if (pathname.startsWith("/assets/")) {

        if (extension === ".html")  { fileType =  {'Content-Type': 'text/html'} };
        if (extension === ".css")   { fileType =  {'Content-Type': 'text/css'} };
        if (extension === ".js")    { fileType =  {'Content-Type': 'text/javascript'} };
        if (extension === ".ico")   { fileType =  {'Content-Type': 'image/x-icon'} };
        if (extension === ".jpg")   { fileType =  {'Content-Type': 'image/jpeg'} };
        if (extension === ".png")   { fileType =  {'Content-Type': 'image/png'} };
        if (extension === ".gif")   { fileType =  {'Content-Type': 'image/gif'} };
        if (extension === ".svg")   { fileType =  {'Content-Type': 'image/svg'} };
        if (extension === ".webp")  { fileType =  {'Content-Type': 'image/webp'} };


        fs.readFile(path.join(__dirname, "../public/",  pathname), (err, data) => {
            res.writeHead(200, fileType);
            if (err) {
                console.log("Error en write: ", err.message);
                return new Error("error 404")
            }
            res.write(data);
            res.end();
        });
    }

    /// *** Paths para servir el API del servidor ***

    if (pathname === "/usuarios") {
        controlUsuarios.mostrarUsuarios(req, res);
    }

    if (pathname === "/usuario" && method === "POST") {
        controlUsuarios.agregarUsuarios(req, res);
    }

    if (pathname === "/usuario" && method === "DELETE") {
        controlUsuarios.borrarUsuarios(req, res);
    }

    if (pathname === "/usuario" && method === "PUT") {
        controlUsuarios.editarUsuarios(req, res);
    }
}


module.exports = routes;