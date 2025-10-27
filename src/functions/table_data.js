require('dotenv').config();

const { Client, Pool } = require('pg');


const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASS;
const dbPort = process.env.DB_PORT;


const dbPool = new Pool( {
    
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPass,
    port: dbPort,
    max: 10,
    connectionTimeoutMillis: 20000,
    idleTimeoutMillis: 30000,
    allowExitOnIdle: false,
    

})


async function listTables() {
  
    try {
        const query = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `;
  
        const res = await dbPool.query(query);
        return res.rows.map(rows => {return rows['table_name']})
        
    } catch (err) {

        console.error('Error executing query', err.stack);
        
    }

}


async function getTableNames() {

    if (!dbUser || !dbHost || !dbName || !dbPass || !dbPort) return console.log("missing db credentials");
    try {

        const all_tables = await listTables();
        const dbEquipTables = all_tables.slice(13, all_tables.length-1)
        // console.log(dbEquipTables)
        let equipTableNames = []
        const names = dbEquipTables;
        for(const index in dbEquipTables) {


            if(dbEquipTables[index].includes(',')) {

                dbEquipTables[index] = dbEquipTables[index].replace(/,\s/g, '_');
            
            }

            dbEquipTables[index] = dbEquipTables[index].replace(/ml_equip_/i, '');
    
            equipTableNames.push(dbEquipTables[index]);  
        }

        const editAndFulltable = { 
            
            full: names,
            edited: equipTableNames,
         }

        return editAndFulltable
        
        
    } catch (err) {

        console.error('Error executing query', err.stack);

    }
}

// (async () => {
//     const x = await getData();
//     console.log(x);
// })();


async function physical() {

    // const client = new Client({
    // user: dbUser,
    // host: dbHost,
    // database: dbName,
    // password: dbPass,
    // port: dbPort,
    // });

    if (!dbUser || !dbHost || !dbName || !dbPass || !dbPort) return console.log("missing db credentials");

    try {
        //1-18 all main physical equipment
        // Acquire a client from the connection pool
        // 'Name' 'Cost' 'Type' 'Stat' 'Passive_Desc'
        // await client.connect();

        const table_name = `public."ML_Equip_attack"`;

        const result = await dbPool.query(`SELECT * FROM ${table_name};`);

        const atk_obj = {

            main: result.rows.slice(0, 18),
            primary: result.rows.slice(19),
        }

        // Return the rows 0 to 18 from the result
        return atk_obj;

    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}

async function magic() {

    if (!dbUser || !dbHost || !dbName || !dbPass || !dbPort) return console.log("missing db credentials");

    try {
        //1-15, 25-26 all main magic equipment
        // Acquire a client from the connection pool
        // 'Name' 'Cost' 'Type' 'Stat' 'Passive_Desc'
        // await client.connect();

        const table_name = `public."ML_Equip_magic"`;

        const result = await dbPool.query(`SELECT * FROM ${table_name};`);

        const result1 = result.rows.slice(0, 15);
        
        const result3 = result.rows.slice(15, 25);


        const mag_obj = {
            
            main: result1,
            primary: result3,
        }
        
        return mag_obj

    } catch (err) {

        console.error('Error executing query', err.stack);

    }

}

async function defense() {

    if (!dbUser || !dbHost || !dbName || !dbPass || !dbPort) return console.log("missing db credentials");

    try {
        //1-13 all main defense equipment
        // Acquire a client from the connection pool
        // 'Name' 'Cost' 'Type' 'Stat' 'Passive_Desc'
        // await client.connect();

        const table_name = `public."ML_Equip_defense"`;

        const result = await dbPool.query(`SELECT * FROM ${table_name};`);

        const result1 = result.rows.slice(0, 13);
        const result2 = result.rows.slice(13);

        const def_obj = {
            
            main: result1,
            primary: result2,
        }
        
        return def_obj

    } catch (err) {

        console.error('Error executing query', err.stack);

    }

}

async function jungle() {

    if (!dbUser || !dbHost || !dbName || !dbPass || !dbPort) return console.log("missing db credentials");

    try {

        const table_name = `public."ML_Equip_jungle"`;

        const result = await dbPool.query(`SELECT * FROM ${table_name};`);

        return result.rows.slice(-3)

    } catch (err) {

        console.error('Error executing query', err.stack);

    }

}

async function roam() {

    if (!dbUser || !dbHost || !dbName || !dbPass || !dbPort) return console.log("missing db credentials");

    try {

        const table_name = `public."ML_Equip_roam"`;

        const result = await dbPool.query(`SELECT * FROM ${table_name};`);

        return result.rows.slice(-4)

    } catch (err) {

        console.error('Error executing query', err.stack);

    }

}

async function movement() {

    if (!dbUser || !dbHost || !dbName || !dbPass || !dbPort) return console.log("missing db credentials");

    try {

        const table_move = `public."ML_Equip_movement"`;
        const table_magic_move = `public."ML_Equip_magic, movement"`;
        const table_attack_move = `public."ML_Equip_attack, movement"`;
        const table_defense_move = `public."ML_Equip_defense, movement"`;

        const movement =  dbPool.query(`SELECT * FROM ${table_move};`);
        const magic_move = dbPool.query(`SELECT * FROM ${table_magic_move};`);
        const attack_move = dbPool.query(`SELECT * FROM ${table_attack_move};`);
        const defense_move = dbPool.query(`SELECT * FROM ${table_defense_move};`);

        const [movement_data, magic_move_data, attack_move_data, defense_move_data_data] = 
        await Promise.all([
            movement, magic_move, attack_move, defense_move
        ]);

        const movemement_data_main = movement_data.rows.slice(0,3);
        const movemement_data_primary = movement_data.rows[3];

        mov_obj = {

            main: [...movemement_data_main, ...magic_move_data.rows, ...attack_move_data.rows, ...defense_move_data_data.rows],
            primary: [movemement_data_primary],
        }

        return mov_obj


    } catch (err) {

        console.error('Error executing query', err.stack);

    }

}


async function special() {

    if (!dbUser || !dbHost || !dbName || !dbPass || !dbPort) return console.log("missing db credentials");

    try {

        const table_move_name = `public."ML_Equip_movement"`;
        const table_magic_name = `public."ML_Equip_magic"`;

        const table_move = dbPool.query(`SELECT * FROM ${table_move_name};`);
        const table_magic = dbPool.query(`SELECT * FROM ${table_magic_name};`);

        const [table_move_data, table_magic_data] = 
        await Promise.all(
            [table_move, table_magic]
        )
        
        return [...table_magic_data.rows.slice(25), ...table_move_data.rows.slice(4)]

    } catch (err) {

        console.error('Error executing query', err.stack);

    }

}

async function adaptive() {

    if (!dbUser || !dbHost || !dbName || !dbPass || !dbPort) return console.log("missing db credentials");

    try {

        const table_adapt_AtDeMa = `public."ML_Equip_adaptive, attack, defense, magic"`;
        const table_adapt_AtMa = `public."ML_Equip_adaptive, attack, magic"`;
        const table_adapt_De = `public."ML_Equip_adaptive, defense"`
        const table_AtMa = `public."ML_Equip_attack, magic"`

        const adapt_AtDeMa =  dbPool.query(`SELECT * FROM ${table_adapt_AtDeMa};`);
        const adapt_AtMa =  dbPool.query(`SELECT * FROM ${table_adapt_AtMa};`);
        const adapt_De =  dbPool.query(`SELECT * FROM ${table_adapt_De};`);
        const AtMa =  dbPool.query(`SELECT * FROM ${table_AtMa};`);

        const [adapt_AtDeMa_data, adapt_AtMa_data, adapt_De_data, AtMa_data] =
        await Promise.all([
            adapt_AtDeMa, adapt_AtMa, adapt_De, AtMa
        ])

        adapt_obj = {
            main:[...adapt_AtDeMa_data.rows, ...adapt_AtMa_data.rows, ...adapt_De_data.rows],
            primary: AtMa_data.rows
        }

        return adapt_obj

    } catch (err) {

        console.error('Error executing query', err.stack);

    }

}



// (async () => {

//     const phy = await movement();
//     console.log(phy.main);

// })();



module.exports = { 

    physical, 
    magic, 
    defense, 
    jungle,
    roam,
    movement,
    special,
    adaptive,
    dbPool, 
    getTableNames,

};