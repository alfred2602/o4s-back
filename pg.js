// pools will use environment variables
// for connection information
const { Pool, Client } = require('pg')
const express = require('express')
const app = express();
const port = 3000


const client = new Client({
    user: "dmrocdfxzlpwuo",
    host: 'ec2-54-236-146-234.compute-1.amazonaws.com',
    database: 'd68fb82ib9de7q',
    password: '22f599fca056af07de2bc820d9b48dd6939e3d00e300f4ab43ee4559748f172a',
    port: 5432,
    ssl: {
        require: false,
        rejectUnauthorized: false
    }
});

const pool = new Pool({ ssl: {
        require: false,
        rejectUnauthorized: false
    }});
/*const pool = new Pool({
    user: "dmrocdfxzlpwuo",
    host: 'ec2-54-236-146-234.compute-1.amazonaws.com',
    database: 'd68fb82ib9de7q',
    password: '22f599fca056af07de2bc820d9b48dd6939e3d00e300f4ab43ee4559748f172a',
    port: 5432,
    ssl: {
        require: false,
        rejectUnauthorized: false
    }
})*/


async function connect(){
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
    const res = await client.query(query1);
    //const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    //console.log(res) // Hello world!
    await client.end()
}

async function insert(){
    const query1 = `
    insert into users(shortlink,id,dom) values('1.1.1.1n87q46','93605123123','Dec-01-2020');
`;
    await client.connect()
    const res = await client.query(query1);
    //const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    //console.log(res) // Hello world!
    await client.end()
}

async function check(link) {

    const query1 = `
    select * from users where shortlink='${link}';
    `;

    try{
        await client.connect()
    }
    catch(e){
        //console.log(e)
    }

    const res = await client.query(query1);
    //const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    //console.log(res.rows[0]) // Hello world!
    await client.end()
    return  res.rows[0];
}

async function check_pool(link) {

    const query1 = ` select * from users where shortlink='${link}'; `;

    try{
        pool.connect()
    }
    catch(e){
        //console.log(e)
    }
    const res = await pool.query(query1);
    //await pool.release()
    //await pool.end();
    return  res.rows[0];
}

app.get('/favicon.ico', (req, res) => {
    res.send('ico')

})

app.get('/*', async (req, res) => {
    if( req.url !== "/favicon.ico"){
      //console.log(req.url.substring(1))
      let info = await check_pool(req.url.substring(1));
      //let new_link = "https://widget-o4s.herokuapp.com/indexEng.html?lang=GEN&productCode=" + info['id']  + "&companyCode=pasura&skuCode=exodus-250ml" + "&dom=" + info['dom'];
      try {
          let new_link = "http://localhost:3000/indexEng.html?lang=GEN&productCode=" + info['id'] + "&companyCode=pasura&skuCode=exodus-250ml" + "&dom=" + info['dom'];
          //console.log(new_link)
          res.redirect(new_link);
      }
      catch (e) {
          res.send("404 Not Found")
      }
    }
})

app.listen(process.env.PORT || 3000, () => {
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