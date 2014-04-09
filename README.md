# lingon-git-deploy

An [Lingon](https://github.com/jpettersson/lingon) plugin to deploy your static site using git. 

This plugin creates a temporary git repository in your build folder, commits all files, adds a git remote and pushes. This is useful if you want to automate the deployment of your static site build to heroku, dokku or similar.

## Usage

**install:** 

``
$ npm install lingon-git-deploy
``

**Configure in lingon.js:**

```JavaScript
#!/usr/bin/env node

var lingon = require('lingon'),
    gitDeploy = require('lingon-git-deploy');

gitDeploy(lingon, {
  branch: "gh-pages"
});

...
```

**deploy:**

``
$ ./lingon.js git:deploy
``

## Configuration Options

```JavaScript
gitDeploy(lingon, {
  remote: "git@server.com:project.git"    // The full git remote url
  branch: "master"                        // A branch name
});
```

## Contributions

We will be thrilled to receive your pull requests. Take a look at the issues if you are unsure what to work on, or if you want to suggest a feature. If you also include tests with your patch you will receive countless virtual high fives!

## License

Licensed under the MIT license.
