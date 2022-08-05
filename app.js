const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;

const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ORGANIC%}/g, product.organic);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempCard = fs.readFileSync(path.join(__dirname, 'views/card.html'), 'utf-8');
const overview = fs.readFileSync(path.join(__dirname, 'views/overview.html'), 'utf-8');
const detailProduct = fs.readFileSync(path.join(__dirname, 'views/detailProduct.html'), 'utf-8');

const server = http.createServer((req, res) => {
    const rudra = url.parse(req.url, true);
    // console.log('rudra', rudra);

    if (req.url === '/') {
        // const answer = dataObj.filter((e) => e.id == '1');
        // console.log(tempCard);
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        // console.log(cardsHtml);
        const product = overview.replace('{%PRODUCT%}', cardsHtml);
        res.end(product);
    }

    else if (rudra.pathname === '/products') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        // console.log(aksh);
        const product = dataObj[rudra.query.id];
        console.log(product);
        const output = replaceTemplate(detailProduct, product);
        res.end(output);
    }

    else {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.end('<h1> Not Found </h1>')
    }
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

