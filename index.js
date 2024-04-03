const express = require('express')
const app = express()
const port = 3000
const proxy_check = require('proxy-check');



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/check', async (req, res) => {
    var proxy = req.body.proxy;
    var split = proxy.split(":");
    if (split.length !== 4) return "FALSE";
    let host = split[0];
    let port = split[1];
    let username = split[2];
    let pass = split[3];
    const pCheck = {
        host: host,
        port: port,
        proxyAuth: username + ":" + pass
    }
    var result = await check(pCheck)
    res.status(200).send(result);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



const check = async (proxy) => {
    try {
        const result = await proxy_check(proxy);
        console.log("proxy: " + proxy.host + " status: " + result);
        return "TRUE";
    } catch (error) {
        console.log("proxy: " + proxy.host + " status: " + error);
        return "FALSE";
    }
};
