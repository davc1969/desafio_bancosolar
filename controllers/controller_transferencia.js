const queries = require("./../services/db_pool_services");
const urlHandler = require("url");
const { get } = require("http");


const getCurrentDate = async () => {
    sqlQuery = `SELECT NOW()::timestamp;`;
    const response = await queries.dbPoolQuery(sqlQuery);
    const fecha = JSON.parse(response);
    return fecha[0].now
}

const getUserid = async (userName) => {
    sqlQuery = `select id from usuarios where nombre = '${userName}';`;
    const response = await queries.dbPoolQuery(sqlQuery);
    const idUser = JSON.parse(response);
    return idUser[0].id;
}

const mostrarTransferencias = async (req, res) => {
    console.log("Opcion Mostrar Transferencias");
    const sqlQuery = {
        text: `select * from transferencias;`,
        values: []
    };
    let response;
    try {
        response = await queries.dbPoolQuery(sqlQuery);
        console.log("lista de transferencias: ");
    } catch (error) {
        console.log("Error en mostrar transferencias: ", error.message);
        response = {
            code: error.code,
            message: error.message
        }
    } finally {
        res.end(response);
    }
};

const agregarTransferencias = async (req, res) => {
    console.log("Opcion Agregar Transferencias");

    const fecha = await getCurrentDate();
    let body;
    req.on("data", (data) => {
        body = JSON.parse(data);
    })
    
    req.on("end", async () => {

        const fecha = await getCurrentDate();
        const idEmisor = await getUserid(body.emisor);
        const idReceptor = await getUserid(body.receptor);
        const monto = parseFloat(body.monto);
        
        const allQueries = [ 
        {
            text: `update usuarios set balance = balance - $2 where id = $1; `,
            values: [idEmisor,  monto]
        },
        {
            text: `update usuarios set balance = balance + $2 where id = $1; `,
            values: [idReceptor, monto]
        },
        {
            text: `insert into transferencias (emisor, receptor, monto, fecha) values ($1, $2, $3, $4);`,
            values: [idEmisor, idReceptor, monto, fecha]
        }]


        let response;
        try {
            response = await queries.dbPoolTransaction(allQueries);
            response = JSON.stringify(response);
            console.log("Transaccion agregado: ", response);
        } catch (error) {
            console.log("Error en agregar transacciones: ", error.message);
            response = {
                code: error.code,
                message: error.message
            }
        } finally {
            res.end(response);
        }
    })
};

const editarTransferencias = async (req, res) => {
    console.log("Opcion Editar Transferencias");
};

const borrarTransferencias = async (req, res) => {
    console.log("Opcion Borrar Transferencias");
};


module.exports = {
    mostrarTransferencias,
    agregarTransferencias,
    editarTransferencias,
    borrarTransferencias
}