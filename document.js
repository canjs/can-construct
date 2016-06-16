var bitDocs = require("bit-docs");
var path = require("path");

bitDocs(
	path.join(__dirname, "package.json"),
	{
		debug: true,
		readme: {
			apis: [
				"Construct.extend",
				"Construct.constructorExtends",
				"Construct.newInstance",
				"Construct.setup",
				"Construct.namespace",
				"Construct.shortName",
				"Construct.prototype.constructor",
				"Construct.prototype.setup",
				"Construct.prototype.init"
			]
		}
	}
).catch(function(e){
	setTimeout(function(){
		throw e;
	}, 1);
});
