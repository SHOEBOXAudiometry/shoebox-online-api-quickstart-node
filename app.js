require('dotenv').config();

var express = require("express");
var url = require('url')
var app = express();
var port = 3000;
const https = require('https');
const querystring = require('querystring');

// NOTE: We recommend not deploying applications with API keys in the code.
const SHOEBOX_API_KEY = 'YOUR-API-KEY'
const SHOEBOX_API_URL = url.parse('YOUR-API-URL')

console.log(process.env.SHOEBOX_API_URL)
// ---------- Notification Webhook ---------- //

/**
 * Endpoint to receive SHOEBOX Online notification when a test is completed.
 * Configured in the SHOEBOX portal.
 *
 * Query Parameters:
 * uuid: Unique identifier of the SHOEBOX Online test completed
 * eventType: ['create', 'update']
 */
app.get('/shoeboxonline/testcomplete', function (req, res) {
  //Upon receiving a notificaiton of a test completion, 
  //fetch the test details by going to the SHOEBOX Online API
  
  var testUUID = req.query.uuid;
  console.log(`Received test completion notification for Test UUID: ${testUUID}`);

  fetchResults();
})

// ---------- SHOEBOX Online API ---------- //

function fetchResults() {
	console.log("Fetching Results from SHOEBOX Online API")

	const parsedAPIURL = url.parse(process.env.SHOEBOX_API_URL);

	const requestOptions = {
		hostname: parsedAPIURL.hostname,
		path: parsedAPIURL.path,
		headers: {
			'x-api-key': process.env.SHOEBOX_API_KEY
		}
	}

	https.get(requestOptions, (response) => {
		var result = ''
		response.on('data', function (chunk) {
			result += chunk;
		});

		response.on('end', function () {
			var shoeboxResponse = JSON.parse(result);
			console.log("Response Received: " + JSON.stringify(shoeboxResponse))

			/**
			 * Save the data received!
			 *
			 * Retrieved SHOEBOX Online Results are
			 * only available once!
			 */
		});

	});

}

// ---------- Node Application Setup ---------- //

app.listen(port, () => {
 console.log("Server listening on port " + port);
});