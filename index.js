var chalk = require('chalk');
var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(lingon, config) {
  config.branch = config.branch || 'master';

  var gitDeploy = function() {
    if(!config.remote) {
      lingon.log(chalk.red("Error: git:deploy - missing git remote"));
      return;
    }
    var command = __dirname + "/lib/./deploy.sh";

    lingon.log(
      'Deploying via git to remote:',
      chalk.green(config.remote),
      'branch:',
      chalk.green(config.branch)
    );

    var deploy = spawn(command, [
      path.join(process.cwd(), lingon.config.buildPath),
      config.branch, 
      config.remote
    ],{
      stdio: 'inherit'
    });
  };

  lingon.registerTask('git:deploy', gitDeploy, {
    message: "Deploy the build folder using git"
  });

};