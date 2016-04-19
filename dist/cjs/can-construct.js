/*can-construct@3.0.0-pre.0#can-construct*/
var assign = require('can-util/js/assign/assign');
var deepAssign = require('can-util/js/deep-extend/deep-extend');
var dev = require('can-util/js/dev/dev');
var makeArray = require('can-util/js/make-array/make-array');
var initializing = 0;
var Construct = function () {
    if (arguments.length) {
        return Construct.extend.apply(Construct, arguments);
    }
};
var canGetDescriptor;
try {
    Object.getOwnPropertyDescriptor({});
    canGetDescriptor = true;
} catch (e) {
    canGetDescriptor = false;
}
var getDescriptor = function (newProps, name) {
        var descriptor = Object.getOwnPropertyDescriptor(newProps, name);
        if (descriptor && (descriptor.get || descriptor.set)) {
            return descriptor;
        }
        return null;
    }, inheritGetterSetter = function (newProps, oldProps, addTo) {
        addTo = addTo || newProps;
        var descriptor;
        for (var name in newProps) {
            if (descriptor = getDescriptor(newProps, name)) {
                this._defineProperty(addTo, oldProps, name, descriptor);
            } else {
                Construct._overwrite(addTo, oldProps, name, newProps[name]);
            }
        }
    }, simpleInherit = function (newProps, oldProps, addTo) {
        addTo = addTo || newProps;
        for (var name in newProps) {
            Construct._overwrite(addTo, oldProps, name, newProps[name]);
        }
    };
assign(Construct, {
    constructorExtends: true,
    newInstance: function () {
        var inst = this.instance(), args;
        if (inst.setup) {
            inst.__inSetup = true;
            args = inst.setup.apply(inst, arguments);
            delete inst.__inSetup;
        }
        if (inst.init) {
            inst.init.apply(inst, args || arguments);
        }
        return inst;
    },
    _inherit: canGetDescriptor ? inheritGetterSetter : simpleInherit,
    _defineProperty: function (what, oldProps, propName, descriptor) {
        Object.defineProperty(what, propName, descriptor);
    },
    _overwrite: function (what, oldProps, propName, val) {
        what[propName] = val;
    },
    setup: function (base) {
        this.defaults = deepAssign(true, {}, base.defaults, this.defaults);
    },
    instance: function () {
        initializing = 1;
        var inst = new this();
        initializing = 0;
        return inst;
    },
    extend: function (name, staticProperties, instanceProperties) {
        var shortName = name, klass = staticProperties, proto = instanceProperties;
        if (typeof shortName !== 'string') {
            proto = klass;
            klass = shortName;
            shortName = null;
        }
        if (!proto) {
            proto = klass;
            klass = null;
        }
        proto = proto || {};
        var _super_class = this, _super = this.prototype, Constructor, namespace, prototype;
        prototype = this.instance();
        Construct._inherit(proto, _super, prototype);
        if (shortName) {
        } else if (klass && klass.shortName) {
            shortName = klass.shortName;
        } else if (this.shortName) {
            shortName = this.shortName;
        }
        function init() {
            if (!initializing) {
                return this.constructor !== Constructor && arguments.length && Constructor.constructorExtends ? Constructor.extend.apply(Constructor, arguments) : Constructor.newInstance.apply(Constructor, arguments);
            }
        }
        if (typeof constructorName === 'undefined') {
            Constructor = function () {
                return init.apply(this, arguments);
            };
        }
        for (var propName in _super_class) {
            if (_super_class.hasOwnProperty(propName)) {
                Constructor[propName] = _super_class[propName];
            }
        }
        Construct._inherit(klass, _super_class, Constructor);
        assign(Constructor, {
            constructor: Constructor,
            prototype: prototype,
            namespace: namespace
        });
        if (shortName !== undefined) {
            Constructor.shortName = shortName;
        }
        Constructor.prototype.constructor = Constructor;
        var t = [_super_class].concat(makeArray(arguments)), args = Constructor.setup.apply(Constructor, t);
        if (Constructor.init) {
            Constructor.init.apply(Constructor, args || t);
        }
        return Constructor;
    }
});
Construct.prototype.setup = function () {
};
Construct.prototype.init = function () {
};
module.exports = exports = Construct;