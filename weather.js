// To access the STATUS_CODE property
const http = require('http');
// To get the data from the API
const https = require('https');
// The key
const api = require('./api.json');

// Print out temp details
function printWeather(weather) {
    const message = weather;
    console.log(message);
}

// Print out error message
function printError(error) {
    console.error(error.message);
}

function get(query) {
    // Take out underscores for readability. This already done in app.js, so I'm not sure why it's here.
    const readableQuery = query.replace('_', ' ');
    // try...catch to catch malformed urls
    try {
        // request stores the data fetched with https.get(url, cb). The url is our API endpoint with both the api key and query string interpolated. 
        const theUrl = `https://api.weather.com/v3/wx/forecast/daily/5day?postalKey=${query}:US&format=json&units=e&language=en-US&apiKey=${api.key}`
        const request = https.get(theUrl, response => {
            //console.log(theUrl)
            // If the server sends back 'ok', then continue
            if (response.statusCode === 200) {
                let body = "";
                // Read the data chunk by chunk, adding it to 'body'
                response.on('data', chunk => {
                    body += chunk;
                });
                // On end, process the data
                response.on('end', () => {
                    // try... catch to catch parse errors
                    try {
                        // Parse the data
                        const weather = JSON.parse(body);
                        // Check if the location was found before printing
                        if (weather.narrative) {
                            // Print the data
                            printWeather(weather.narrative[0]);
                        } else {
                            const queryError = new Error(`The location "${readableQuery}" was not found.`);
                            printError(queryError);
                        }
                    } catch (error) {
                        // Parse Error
                        printError(error);
                    }
                });
            } else {
                // Status Code Error
                const statusCodeError = new Error(`There was an error getting the message for ${readableQuery}. (${http.STATUS_CODES[response.statusCode]})`);
                printError(statusCodeError);
            }

        });
        // On error, print error
        request.on("error", printError);
    } catch (error) {
        //Malformed URL Error
        printError(error);
    }
}

module.exports.get = get;