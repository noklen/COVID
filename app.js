const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const cheerio = require('cheerio');
const got = require('got');

const vgmUrl= 'https://reservatic.com/cs/public_services/mestska-poliklinika-praha-mestska-poliklinika-praha-odberove-misto-marianske-nam/calendar?operation_id=7461&no_select_place=true&only_covid_operations=&place_id=5336#select_year';
const errorMess = 'Termíny na následující dny jsou obsazeny. Nové objednání zkuste později.'

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('index.html');
});
function parsePage() {
  got(vgmUrl).then(response => {
    const $ = cheerio.load(response.body);
    let element = $('.alert-danger').text()
    if(errorMess !== element) {
      console.log('Записывайся!!', vgmUrl)
    }
  }).catch(err => {
    console.log(err);
  });
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  setInterval(parsePage, 1000)
});




