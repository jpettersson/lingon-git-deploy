var chalk = require('chalk');
var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(oj, config) {
  config.branch = config.branch || 'master';

  oj.registerTask('git:deploy', function() {
    if(!config.remote) {
      oj.log(chalk.red("Error: git:deploy - missing git remote"));
      return;
    }
    var command = __dirname + "/lib/./deploy.sh";

    oj.log(
      'Deploying via git to remote:',
      chalk.green(config.remote),
      'branch:',
      chalk.green(config.branch)
    );

    var deploy = spawn(command, [
      path.join(process.cwd(), oj.buildPath),
      config.branch, 
      config.remote
    ],{
      stdio: 'inherit'
    });
  });

};