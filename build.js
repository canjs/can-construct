var stealTools = require('steal-tools');

stealTools.export({
  steal: {
    config: __dirname + '/package.json!npm'
  },
  outputs: {
    '+amd': {
    },
    '+standalone': {
      exports: {
        'can-namespace': 'can'
      }
    }
  }
}).catch(function catchError(err) {
  setTimeout(function throwError() {
    throw err;
  }, 1);
});
