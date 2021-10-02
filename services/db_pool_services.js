const pool = require("./../db/init").instancePool.getPoolInstance();

const dbPoolQuery = async (queryJSON) => {
    return new Promise ( (resolve, reject) => {
        pool.connect( async (error_connection, client, release) => {
            try {
                console.log("try dbpoolq ", queryJSON);
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
                resolve (results);
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
