var querystring = require('querystring');
var http = require('http');

var http_get = function(url, data, callback) {
 
    var query = querystring.stringify(data);
    if (query !== '')
        url = url + '&' + query;
 
 
    http.get(url, function(res) {
            var body = '';
            res.setEncoding('utf8');
 
            res.on('readable', function() {
                var chunk = this.read() || '';
 
                body += chunk;
            });
 
            res.on('end', function() {
                callback(body);
                return body;
            });
 
            res.on('error', function(e) {
                console.log('error', e.message);
            });
        });
};