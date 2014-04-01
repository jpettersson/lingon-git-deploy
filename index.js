var chalk = require('chalk');
var gift = require('gift');
var when = require('when');


function Git() {
  var _this = this;
  this._queue = [];

  function queueWrap(fn) {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      _this.queue(function(){
        fn.apply(_this, args);
      });
      return _this;
    }
  };

  // this.init = queueWrap(this.init);
  this.create_branch = queueWrap(this.create_branch);
  this.checkout = queueWrap(this.checkout);
  this.add = queueWrap(this.add);
  this.commit = queueWrap(this.commit);
  this.remote_add = queueWrap(this.remote_add);
  this.push = queueWrap(this.push);

};

Git.prototype.queue = function(func){
  this._queue.push(func);
};

Git.prototype.next = function() {
  var func = this._queue.shift();

  if(func) {
    func.call(this);
  }
}

Git.prototype.init = function(path) {
  console.log('init');
  this.path = path;

  gift.init(path, function(err, repo) {
    if ( err ) {
      console.log(err);
    } else {
      this.repo = repo;
      this.next();
    }
  }.bind(this));

};

Git.prototype.create_branch = function(branch) {
  console.log('create', branch);

  this.repo.create_branch(branch, function (err) {
    if ( !err || err.code == 128 ) {
      console.log('created branch', branch);
      this.next();
    }else{
      console.log(err);
    }
  }.bind(this));
};

Git.prototype.checkout = function(branch) {
  console.log('checkout', branch);

  this.repo.checkout(branch, function (err) {
    if ( err ) {
      console.log(err);
    } else {
      console.log('checked out branch', branch);
      this.currentBranch = branch;
      this.next();
    }
  }.bind(this));
};

Git.prototype.add = function() {
  console.log('add');

  this.repo.add('.', function (err) {
      if ( err ) {
        console.log(err)
      } else {
        console.log('added')
        this.next();
      }
    }.bind(this));
};

Git.prototype.commit = function(message) {
  this.repo.commit(message || 'Automated commit', {
      all: true
    }, function (err) {
      if ( err ) {
        console.log('Nothing to commit', err);
        this.next();
      } else {
        console.log('Commit');
        this.next();
      }
    }.bind(this));
};

Git.prototype.remote_add = function(remote, url) {
  console.log('add remote');

  this.repo.remote_add(remote, url, function(err) {
    if(!err || err.code == 128) {
      this.next();
    }else{
      console.log(err);
    }
  }.bind(this));
};

Git.prototype.push = function() {
  console.log('push!');

  this.repo.git('push', {'set-upstream': true, 'force': true}, ['deploy', this.currentBranch], function (err) {
    if ( err ) {
      console.log(err);
    } else {
      console.log('pushed!')
      this.next();
    }
  }.bind(this));
};

module.exports = function(oj, config) {
  config.branch = config.branch || 'master';

  oj.registerTask('git:deploy', function() {
    if(!config.remote) {
      oj.log(chalk.red("Error: git:deploy - missing git remote"));
      return;
    }

    var git = new Git();

    git.init(oj.buildPath);
    git.add();
    git.commit('Automated deploy message');
    git.create_branch(config.branch);
    git.checkout(config.branch);
    git.remote_add('deploy', config.remote);
    git.push();

    // git.init().then(Git.checkout)


    //     .checkout(config.branch).then(function(repo) { 
    //       git.repo = repo }
    //     );


    //     .add()
    //     .commit('Automated commit message.')
    //     .push('deploy', config.branch)
    //     .then(function() {
    //       oj.log(chalk.green("git:deploy pushed to " + config.remote));
    //     })

    // Create & checkout branch

    // Commit with version?

    // Add remote

    // Force push

  });

};