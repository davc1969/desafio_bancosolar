const pool = require("./../db/init").instancePool.getPoolInstance();

const dbPoolQuery = async (queryJSON) => {
    return new Promise ( (resolve, reject) => {
        pool.connect( async (error_connection, client, release) => {
            try {
                if (error_connection) {
                    throw new Error(error_connection)
                }
                const results = await client.query(queryJSON);
                resolve(JSON.stringify(results.rows));
            } catch (error) {
                console.log("error en try de dbPoolQuery", error.message);
                reject(error);
            } finally {
                release();
            }
        })
    })
};

// dbPoolTransaction recibe un array de queries especificados en JSON, esto permite ejecutar múltiples solicitudes a la vez.
// retorna el resultado de la primera consulta unicamente
const dbPoolTransaction = async (sqlQueries) => {
    return new Promise ( (resolve, reject) => {

        pool.connect( async (error_conexion, client, release) => {
           
            try {
                if (error_conexion) { throw new Error(error_conexion) }

                await client.query("BEGIN");
                let results = [];
                sqlQueries.forEach( async (qry, idx) => {
                    results[idx] = await client.query(qry);
                });
                await client.query("COMMIT")
                console.log("transaction responde total", results.rows);
                resolve (JSON.stringify(results[0].rows));
            } catch (error) {
                await client.query("ROLLBACK")
                console.log("Fallo en la transacci�n: ", error.message);
                reject (error);
            } finally {
                await release();
            }
            
        });
        
    })
}

module.exports = {
    dbPoolQuery,
    dbPoolTransaction
};
