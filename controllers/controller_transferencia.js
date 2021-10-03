const queries = require("./../services/db_pool_services");
const urlHandler = require("url");
const { get } = require("http");


const getCurrentDate = async () => {
    sqlQuery = `SELECT NOW()::timestamp;`;
    const response = await queries.dbPoolQuery(sqlQuery);
    const fecha = JSON.parse(response);
    return fecha[0].now
}

const getUserIdByName = async (userName) => {
    sqlQuery = `select id from usuarios where nombre = '${userName}';`;
    const response = await queries.dbPoolQuery(sqlQuery);
    const idUser = JSON.parse(response);
    return idUser[0].id;
};

const getUserNameById = async (userId) => {
    sqlQuery = `select nombre from usuarios where id = ${userId};`;
    const response = await queries.dbPoolQuery(sqlQuery);
    return JSON.parse(response)[0].nombre;
};

const mostrarTransferencias = async (req, res) => {
    console.log("Opcion Mostrar Transferencias");
    let queryTransferencias = `select t.id, emis.nombre, recep.nombre, t.monto, t.fecha `;
    queryTransferencias += `from transferencias as t `;
    queryTransferencias += `inner join usuarios as emis on t.emisor = emis.id `
    queryTransferencias += `inner join usuarios as recep on t.receptor = recep.id;`
    const sqlQuery = {
        text: queryTransferencias,
        values: [],
        rowMode: 'array'
    };

    let results;
    try {
        response = await queries.dbPoolQuery(sqlQuery);
        console.log("response ", response);
        results = JSON.parse(response);
    } catch (error) {
        console.log("Error en mostrar transferencias: ", error.message);
        response = {
            code: error.code,
            message: error.message
        }
    } finally {
        console.log("results finally ", results);
        res.writeHead(200, { "Content-Type": "Application/json" });
        res.end(JSON.stringify(results));
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
        const monto = parseFloat(body.monto);
        const queryUpdateUser = ``

        
        const allQueries = [ 
        {
            text: `update usuarios set balance = balance - $2 where id = (select id from usuarios where nombre = $1) returning *; `,
            values: [body.emisor,  monto],
        },
        {
            text: `update usuarios set balance = balance + $2 where id = (select id from usuarios where nombre = $1) returning *;  `,
            values: [body.receptor, monto]
        },
        {
            text: `insert into transferencias (emisor, receptor, monto, fecha) values ((select id from usuarios where nombre = $1), (select id from usuarios where nombre = $2), $3, $4) returning *;`,
            values: [body.emisor, body.receptor, monto, fecha],
            rowMode: 'array'
        }]


        let response;
        try {
            response = await queries.dbPoolTransaction(allQueries);
            //response = JSON.stringify(response);
        } catch (error) {
            console.log("Error en agregar transacciones: ", error.message);
            response = {
                code: error.code,
                message: error.message
            }
        } finally {
            res.end((response));
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