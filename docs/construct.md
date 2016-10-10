@module {function} can-construct can-construct
@parent can-infrastructure
@package ../package.json

@description

Provides a way to easily use the power of prototypal inheritance
without worrying about hooking up all the particulars yourself. Use
[can-construct.extend can-construct.extend] to create an inheritable
constructor function of your own.

@signature `Construct.extend([name,] [staticProperties,] instanceProperties)`

Extends Construct, or constructor functions derived from Construct, to create a new constructor function.

@param {String} [name] Adds a name to the constructor function so it is nicely labeled in the developer tools.
@param {Object} [staticProperties] Properties that are added the constructor function directly.
@param {Object} [instanceProperties] Properties that belong to instances made with the constructor. 
These properties are added to the constructor's `prototype` object.
@return {function} The constructor function.

@body

## Use

In the example below, `Animal` is a constructor function returned by [can-construct.extend can-construct.extend]. All instances of `Animal` will have a `speak`
method, and the `Animal` constructor has a `legs` property.


    var Construct = require("can-construct");
	var Animal = Construct.extend({
        legs: 4
    }, {
        init: function(sound) {
            this.sound = sound;
        },
        speak: function() {
            console.log(this.sound);
        }
    });

You can supply a [can-construct::setup setup] method and/or a [can-construct::init init] method when extending `can-construct`.

You can make instances of your object by calling your constructor function with the `new` keyword. When an object is created, the [can-construct::init init]
method gets called (if you supplied one):

    var panther = new Animal('growl');
    panther.speak(); // "growl"
    panther instanceof Animal; // true

## Plugins

There are two plugins available to help make using `can-construct` even simpler.

-   [can-construct-super] allows you to easily call base methods by making `this._super` available in inherited methods.
-   [can-construct-proxy] creates a static callback function that sets the value of `this` to an instance of the constructor function.
