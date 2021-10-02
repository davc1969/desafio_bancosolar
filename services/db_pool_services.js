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


const dbPoolTransaction = async (sqlQuery) => {
    return new Promise ( (resolve, reject) => {

        pool.connect( async (error_conexion, client, release) => {
           
            try {

                if (error_conexion) { throw new Error(error_conexion) }

                await client.query("BEGIN");
                const results = await client.query(sqlQuery);
                await client.query("COMMIT")
                resolve (results);
            } catch (error) {
                await client.query("ROLLBACK")
                console.log("Fallo en la transacción: ", error.message);
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
