import express from 'express';
import request from 'request';
const router = express.Router();

router.get('/', (req, res) => {
request('https://api.coinmarketcap.com/v1/ticker/bitcoin',function (error, response, exchange1) {
	if (!error && response.statusCode == 200) {
			var obj1 = JSON.parse(exchange1)
			}
	request('https://api.coindesk.com/v1/bpi/currentprice.json', function (error, response, exchange2) {
	if (!error && response.statusCode == 200) {
		var obj2 = JSON.parse(exchange2);
		}
	request('https://blockchain.info/ticker', function (error, response, exchange3) {
	if (!error && response.statusCode == 200) {
		var obj3 = JSON.parse(exchange3);
		res.render('index', {
		exchange1: obj1,
		exchange2: obj2,
		exchange3: obj3
		});
		}

	});
			});
				});  
					});

export default router;
