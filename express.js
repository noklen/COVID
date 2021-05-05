const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')

const cheerio = require('cheerio');
const got = require('got');

const vgmUrl= 'https://reservatic.com/cs/public_services/mestska-poliklinika-praha-mestska-poliklinika-praha-odberove-misto-marianske-nam/calendar?operation_id=7461&no_select_place=true&only_covid_operations=&place_id=5336#select_year';
const errorMess = 'Termíny na následující dny jsou obsazeny. Nové objednání zkuste později.'

const app = express();
const port = process.env.PORT || 8080;
const hostname = '127.0.0.1';

// app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(cors());

let result = {};

app.get('/', (req, res) => {
  res.json(result)
});


function parsePage() {
  got(vgmUrl).then(response => {
    const $ = cheerio.load(response.body);
    let element = $('.alert-danger').text()
    if(errorMess !== element) {
     return result = {message: true};
    }
    return result = {message: false};
  }).catch(err => {
    console.log(err);
  });
}

app.listen(port, hostname, () => {
  console.log('Server started at http://localhost:' + port);
  setInterval(parsePage, 1000)
});

