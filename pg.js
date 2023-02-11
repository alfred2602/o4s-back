// pools will use environment variables

//For internal purpose
// in windows use this command
//set DATABASE_URL={database url from heroku credential}
//echo %DATABASE_URL%

// no client is used only pools (check_pool function)
// for connection information
const { Pool, Client } = require('pg')
const express = require('express')
var pg = require('pg');
const app = express();
const port = 3500
//postgres://ybiovghs:0zhcNjOJJeluebvFLZ7K9v7rf_G_BLz7@satao.db.elephantsql.com/ybiovghs
// var conString = "postgres://alfredserver26:qmDSjPzo64Iv@ep-withered-math-593725.ap-southeast-1.aws.neon.tech/neondb" //Can be found in the Details page
// var client = new pg.Client(conString);

const client = new Client({
    user: "alfredserver26",
    host: 'ep-withered-math-593725.ap-southeast-1.aws.neon.tech',
    database: 'neondb',
    password: 'qmDSjPzo64Iv',
    port: 5432,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         require: false,
//         rejectUnauthorized: false
//     }});
// const pool = new pg.Pool(conString)
const pool = new Pool({
    user: "alfredserver26",
    host: 'ep-withered-math-593725.ap-southeast-1.aws.neon.tech',
    database: 'neondb',
    password: 'qmDSjPzo64Iv',
    port: 5432,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
})

async function connect() {
    const query = `
    CREATE TABLE users (
        shortlink varchar,
        id varchar,
        dom varchar
    );
`;
    const query1 = `
    insert into users("shortlink","id","dom") values();
`;
    await client.connect()
    const res = await client.query(query);
    //const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    //console.log(res) // Hello world!
    // await client.disco
    await client.end()
}
// insert()
// connect()

async function insert() {
    const query1 = `
    ALTER TABLE users
    ADD COLUMN expiryDate DATE,
    ADD COLUMN batchNo VARCHAR(255),
    ADD COLUMN mrp INT;
    
`;
    await client.connect()
    const res = await client.query(query1);
    //const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    //console.log(res) // Hello world!
    await client.end()
}
// insert();
async function check(link) {

    const query1 = `
    select * from users where shortlink='${link}';
    `;

    try {
        await client.connect()
    }
    catch (e) {
        //console.log(e)
    }

    const res = await client.query(query1);
    //const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    //console.log(res.rows[0]) // Hello world!
    console.log(res.rows[0])

    await client.end()
    return res.rows[0];
}
// try {
//     await pool.connect()
// }
// catch (e) {
//     //console.log(e)
// }
async function check_pool(link) {

    //original - https://widget.o4s.io/indexEng.html?lang=GEN&productCode=31933964256&companyCode=pasura&skuCode=exodus-500ml
    //ours - http://localhost:3000/indexEng.html?lang=GEN&productCode=15933797458&companyCode=pasura&skuCode=exodus-500ml
    // &dom=01-06-2020&expiryDate=2020-06-01&batchno=GN202007&mrp=440
    console.log(link)
    const query1 = ` select * from users where shortlink='${link}'; `;

   
    const res = await pool.query(query1);
    /*
        remove the setting below
    */
    console.log(res.rows[0])
    let resCopy = JSON.parse(JSON.stringify(res.rows[0]));

    resCopy.expiryDate = "2020-06-01";
    resCopy.batchNo = "GN202007";
    resCopy.mrp = "440";
    //http://localhost:3000/1.1.1.1.hTsyA
    let dom = resCopy.dom;
    //console.log(resCopy)
    try {
        // let expiryDate = res.rows[0].expiryDate;
        // let batchNo = res.rows[0].batchNo;
        // let mrp = res.rows[0].mrp;
    }
    catch (e) {
        console.log(e)
    }
    try {
        // await pool.end()
    }
    catch (e) {
        //console.log(e)
    }

    //localStorage.setItem("dom", dom);
    //localStorage.setItem("expiryDate", expiryDate);
    //localStorage.setItem("batchNo", batchNo);
    //localStorage.setItem("mrp", mrp);


    //await pool.release()
    //await pool.end();

    return resCopy;
}

app.get('/favicon.ico', (req, res) => {
    res.send('ico')

})

app.get('/*', async (req, res) => {
    if (req.url !== "/favicon.ico") {
        console.log(req.url.substring(1))


        let info = await check_pool(req.url.substring(1));
        //let new_link = "https://widget-o4s.herokuapp.com/indexEng.html?lang=GEN&productCode=" + info['id']  + "&companyCode=pasura&skuCode=exodus-250ml" + "&dom=" + info['dom'];
        try {
            //   let new_link = "https://widget-o4s.herokuapp.com/indexEng.html?lang=GEN&productCode=" + info['id'] + "&companyCode=pasura&skuCode=exodus-250ml";
            let new_link = "http://localhost:3000/indexEng.html?lang=GEN&productCode=" + info['id']
                + "&companyCode=pasura&skuCode=exodus-250ml" + "&dom=" + info['dom']
                + "&expiryDate=" + info["expiryDate"] + "&batchNo=" + info["batchNo"] + "&mrp=" + info["mrp"];
            console.log(new_link)
            res.redirect(new_link);
        }
        catch (e) {
            res.send("404 Not Found")
        }
    }
})

app.listen(process.env.PORT || 3500, () => {
    //console.log(`Example app listening at http://localhost:${port}`)
})


//check();
//insert()

/*
PGUSER=dmrocdfxzlpwuo PGHOST=ec2-54-236-146-234.compute-1.amazonaws.com PGPASSWORD=22f599fca056af07de2bc820d9b48dd6939e3d00e300f4ab43ee4559748f172a \
PGDATABASE=d68fb82ib9de7q PGPORT=5432 node pg.js

setx PGHOST "ec2-54-236-146-234.compute-1.amazonaws.com"
setx PGPASSWORD "22f599fca056af07de2bc820d9b48dd6939e3d00e300f4ab43ee4559748f172a"
setx PGUSER "dmrocdfxzlpwuo"
setx PGDATABASE "d68fb82ib9de7q"
setx PGPORT 5432
*/