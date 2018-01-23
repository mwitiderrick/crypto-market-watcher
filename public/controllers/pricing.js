let exchanges = [
    {name:"Okcoin",url:"wss://real.okcoin.com:10440/websocket"},
    {name:"bitFinnex",url:"wss://api.bitfinex.com/ws/2"},
    {name:"coinApi",url:"wss://spotusd-wsp.btcc.com/"}
    ] 

function fetchPrices(url,name){
	const wss = new WebSocket(url)
	let coin = document.getElementById(name)
	coin.style.fontWeight = 'bold'
	coin.style.fontSize ='x-large'
	wss.onmessage = (msg) =>{
	prices = jsonify(name,JSON.parse(msg.data))
	if(prices){
	coin.textContent = '$'+ prices
	}
	
							}
	let msg

	if(name=='Okcoin'){
	msg = JSON.stringify({ 
                'event': 'addChannel', 
                'channel': 'ok_sub_spot_btc_usd_ticker' 
            			})
	}else if(name=='bitFinnex'){
	msg = JSON.stringify({
                event: 'subscribe',
                channel: 'ticker',
                symbol: 'tBTCUSD'
            			})
	}else if(name=='coinApi'){
	            msg = JSON.stringify({
                CRID: "ALPHA-7BD982E9AA8D2E939D06B21F180450E75446AD7E",
                MsgType: "QuoteRequest",
                QuoteType: 2,
                Symbol: "BTCUSD"
            						})
	
								}else{
									console.log('error')
								}
	wss.onopen = () => wss.send(msg);

							}


function jsonify(name,prices){
	if(name == 'Okcoin'){
       		return prices[0]["data"]["last"]
       }else if(name == 'bitFinnex'){
       		// return prices[1][6]
       }else if (name == 'coinApi'){
       		return prices.Last
       }else {
       	console.log('I sure hope you know what you are doing')
       }
}	

exchanges.forEach(function(exchange){
 		fetchPrices(exchange.url, exchange.name)
 	})

 
