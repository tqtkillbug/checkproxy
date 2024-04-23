const express = require('express')
const app = express()
const port = 3000
const proxy_check = require('proxy-check');
const REQUEST = require('request'); // Import module request




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

app.post('/api/info', async (req, res) => {
    var proxy = req.body.proxy;
    var split = proxy.split(":");
    if (split.length !== 4) return "{}";
    let host = split[0];
    var result = await getInfo(host)
    res.status(200).send(result);
})

app.post('/api/info/ip', async (req, res) => {
    var proxy = req.body.proxy;
    var split = proxy.split(":");
    if (split.length !== 4) return "{s}";
    let host = split[0];
    let port = split[1];
    var result = host;
    if (host.indexOf(".com") > 0) {
        result = await getIpByProxy(`${host}:${port}`);
    }
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


const getInfo = async (ip) => {
    const options = {
        url: 'http://ip-api.com/json/' + ip,
    };

    try {
        const body = await new Promise((resolve, reject) => {
            REQUEST(options, function (error, response, body) {
                if (error) {
                    reject(error); // Nếu có lỗi, reject promise với thông tin lỗi
                } else {
                    resolve(body); // Nếu không có lỗi, resolve promise với nội dung phản hồi
                }
            });
        });

        return body;
    } catch (error) {
        return "{}";
    }
};

const getIpByProxy = async (host) => {
    const proxyUrl = 'http://' + host;
    const proxyUsername = '';
    const proxyPassword = '';
    const options = {
        url: 'https://api.ipify.org',
        proxy: proxyUrl,
        auth: {
            user: proxyUsername,
            pass: proxyPassword
        }
    };

    try {
        const body = await new Promise((resolve, reject) => {
            REQUEST(options, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
        return body;
    } catch (error) {
        return "{}";
    }
}






