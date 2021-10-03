const queries = require("./../services/db_pool_services");
const urlHandler = require("url");

const mostrarUsuarios = async (req, res) => {
    console.log("Opcion Mostrar Usuarios");
    const sqlQuery = {
        text: `select * from usuarios order by id;`,
        values: []
    };
    let response;
    try {
        response = await queries.dbPoolQuery(sqlQuery);
        console.log("lista de usuarios: ");
    } catch (error) {
        console.log("Error en mostrar usuarios: ", error.message);
        response = {
            code: error.code,
            message: error.message
        }
    } finally {
        res.end(response);
    }
};

const agregarUsuarios = async (req, res) => {
    console.log("Opcion Agregar Usuarios");
    let body;
    req.on("data", (data) => {
        body = JSON.parse(data);
    })
    req.on("end", async () => {
        const sqlQuery = {
            text: `insert into usuarios (nombre, balance) values ($1, $2) returning *;`,
            values: [body.nombre, body.balance]
        };
        let response;
        try {
            response = await queries.dbPoolQuery(sqlQuery);
            response = JSON.stringify(response);
            console.log("Usuario agregado: ", response);
        } catch (error) {
            console.log("Error en agregar canciones: ", error.message);
            response = {
                code: error.code,
                message: error.message
            }
        } finally {
            res.end(response);
        }
    })
};

const editarUsuarios = async (req, res) => {
    console.log("Opcion Editar Usuarios");
    let body;
    req.on("data", (data) => {
        body = JSON.parse(data);
    })

    req.on("end", async () => {
        console.log("editar usuarios, req end body", body);
        const sqlQuery = {
            text: `update usuarios set nombre = $2, balance = $3 where id = $1 returning *;`,
            values: [urlHandler.parse(req.url, true).query.id, body.name, body.balance]
        };
        let response;
        try {
            response = await queries.dbPoolQuery(sqlQuery);
        } catch (error) {
            console.log("Error en borrar usuarios: ", error.message);
            response = {
                code: error.code,
                message: error.message
            }
        } finally {
            res.end(response);
        }
    })
};

const borrarUsuarios = async (req, res) => {
    console.log("Opcion Borrar Usuarios");

    const sqlQuery = {
        text: `delete from usuarios where id = $1 returning *;`,
        values: [urlHandler.parse(req.url, true).query.id]
    };
    let response;
    try {
        response = await queries.dbPoolQuery(sqlQuery);

    } catch (error) {
        console.log("Error en borrar usuarios: ", error.message);
        response = {
            code: error.code,
            message: error.message
        }
    } finally {
        res.end(response);
    }
};


module.exports = {
    mostrarUsuarios,
    agregarUsuarios,
    editarUsuarios,
    borrarUsuarios
}