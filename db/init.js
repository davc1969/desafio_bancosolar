const {
    Pool,
    Client
} = require('pg');

//
const {
    DB_USER,
    DB_HOST,
    DB_PASSWORD,
    DB_DATABASE,
    DB_PORT,
    DB_MAX,
    DB_IDLETIMEOUTMILLIS,
    DB_CONNECTIONTIMEOUTMILLIS
} = process.env;


const config = {
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    max: DB_MAX,
    idleTimeoutMillis: DB_IDLETIMEOUTMILLIS,
    connectionTimeoutMillis: DB_CONNECTIONTIMEOUTMILLIS,

};

//************* Singleton Pool from pg ilbrary */
class CustomPool {
    
    constructor() {
        if(!CustomPool.instance) {
            CustomPool.instance = this;
        }

        return CustomPool.instance;
    }

    getPoolInstance() {
        if(!CustomPool.poolInstance) {
            CustomPool.poolInstance = new Pool(config);
        }
        return CustomPool.poolInstance;
    }
}

const instancePool = new CustomPool();
Object.freeze(instancePool);


//************* Singleton Client from pg ilbrary */
class CustomClient {
    
    constructor() {
        if(!CustomClient.instance) {
            CustomClient.instance = this;
        }

        return CustomClient.instance;
    }

    getClientInstance() {
        if(!CustomClient.poolInstance) {
            CustomClient.poolInstance = new Client(config);
        }
        return CustomClient.poolInstance;
    }
}

const instanceClient = new CustomClient();

Object.freeze(instanceClient);



module.exports = {
    instancePool,
    instanceClient
}