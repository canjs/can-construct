@module {function} can-construct can-construct
@parent can-core
@package ../package.json

@description

Provides a way to easily use the power of prototypal inheritance
without worrying about hooking up all the particulars yourself. Use
[can-construct.extend can-construct.extend] to create an inheritable
constructor function of your own.

@body

## Use

THIS IS ITIn the example below, `Animal` is a constructor function returned by [can-construct.extend can-construct.extend]. All instances of `Animal` will have a `speak`
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


You can make instances of your object by calling your constructor function with the `new` keyword. When an object is created, the [can-construct::init init]
method gets called (if you supplied one):

    var panther = new Animal('growl');
    panther.speak(); // "growl"
    panther instanceof Animal; // true

## Plugins

There are two plugins available to help make using `can-construct` even simpler.

-   [can-construct-super] allows you to easily call base methods by making `this._super` available in inherited methods.
-   [can-construct-proxy] creates a static callback function that sets the value of `this` to an instance of the constructor function.
