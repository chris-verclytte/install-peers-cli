// do it inline in sync way
// to make it work in non-npm environment
var npmModule
  , executioner
  , path = require('path')
  , node = process.argv[0]
  ;

if (process.env['npm_execpath'] && process.env['npm_execpath'].match(/\/node_modules\/npm\/bin\/npm-cli\.js$/)) {
  npmModule = require(path.resolve(process.env['npm_execpath'], '..', '..'));
}

// if no npm module found, don't expose any function
// to allow upstream modules find alternatives
module.exports = null;

if (npmModule) {
  executioner = require('executioner');

  module.exports = function(packages, done) {

    var options = {
      node    : node,
      npm     : npmModule,
      // escape package names@versions
      packages: packages.map((pkg) => '"' + pkg + '"').join(' ')
    };

    executioner('${node} ${npm} install --no-save --no-package-lock ${packages}', options, function(error, result) {
      if (error) {
        console.error('Unable to install peerDependencies', error);
        process.exit(1);
        return;
      }
      done();
    });

    // Looks like yarn shows last line from the output of sub-scripts
    console.log('Installing peerDependencies...');
  };
}
