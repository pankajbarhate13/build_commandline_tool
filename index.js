#!/usr/bin/env node
var fs = require('fs');
var ProgressBar = require('progress');
var chalk = require('chalk');
var superagent = require('superagent');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');

program
  .arguments('<file>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')
  .action(function(file) {
  	co(function *() {
  		var username = yield prompt('username: ');
  		var password = yield prompt.password('password: ');	
    	// console.log('user: %s pass: %s file: %s', username, password, file);

  	  var fileSize = fs.statSync(file).size;
		  var fileStream = fs.createReadStream(file);
		  var barOpts = {
		    width: 20,
		    total: fileSize,
		    clear: true
	 	  };
		  var bar = new ProgressBar(' uploading [:bar] :percent :etas', barOpts);
		
		  fileStream.on('data', function (chunk) {
		    bar.tick(chunk.length);
		  });
		  
    	superagent
			  .post('https://api.bitbucket.org/2.0/snippets/')
			  .auth(username, password)
			  .attach('file', fileStream)
			  .set('Accept', 'application/json')
			  .end(function (err, res) {
			  	if (!err && res.ok) {
		        var link = res.body.links.html.href;
		        console.log(chalk.bold.cyan('Snippet created: ') + link);
		       	process.exit(0);
		     	}

		      var errorMessage;
		      if (res && res.status === 401) {
		        errorMessage = "Authentication failed! Bad username/password?";
		      } else if (err) {
		        errorMessage = err;
		      } else {
		        errorMessage = res.text;
		      }
		      console.error(chalk.red(errorMessage));
		      process.exit(1);
		  	})
		})
  })
  .parse(process.argv);