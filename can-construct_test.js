var QUnit = require('steal-qunit');
var Construct = require('can-construct');
var dev = require('can-util/js/dev/');
var makeArray = require('can-util/js/make-array/');

QUnit.module('can-construct', {
  setup: function setup() {
    var Animal;
    var Dog;

    this.Animal = Construct.extend({
      count: 0,
      test: function test() {
        return !!this.match;
      }
    }, {
      init: function init() {
        this.constructor.count++;
        this.eyes = false;
      }
    });
    this.Dog = this.Animal.extend({
      match: /abc/
    }, {
      init: function init() {
        Animal.prototype.init.apply(this, arguments);
      },
      talk: function talk() {
        return 'Woof';
      }
    });

    Animal = this.Animal;
    Dog = this.Dog;

    this.Ajax = this.Dog.extend({
      count: 0
    }, {
      init: function init(hairs) {
        Dog.prototype.init.apply(this, arguments);
        this.hairs = hairs;
        this.setEyes();
      },
      setEyes: function setEyes() {
        this.eyes = true;
      }
    });
  }
});
/* eslint-disable */
test('inherit', function inheritTest() {
  var Base = Construct({
  });

  ok(new Base() instanceof Construct);
  var Inherit = Base({
  });

  ok(new Inherit() instanceof Base);
});
/* eslint-enable */
test('Creating', function creatingTest() {
  var dog = new this.Dog(),
    a1 = new this.Animal(),
    animal = new this.Animal(),
    ajax = new this.Ajax(1000);

  equal(2, this.Animal.count, 'right number of animals');
  equal(1, this.Dog.count, 'right number of animals');
  ok(this.Dog.match, 'right number of animals');
  ok(!this.Animal.match, 'right number of animals');
  ok(this.Dog.test(), 'right number of animals');
  ok(!this.Animal.test(), 'right number of animals');
  equal(1, this.Ajax.count, 'right number of animals');
  equal(2, this.Animal.count, 'right number of animals');
  equal(true, ajax.eyes, 'right number of animals');
  equal(1000, ajax.hairs, 'right number of animals');
  ok(a1 instanceof this.Animal);
  ok(a1 instanceof Construct);
});
test('new instance', function newInstanceTest() {
  var num = 6;
  var newInstance = this.Ajax.newInstance(num);

  equal(num, newInstance.hairs);
});
test('namespaces', function namespacesTest() {
  var fb = Construct.extend('Bar');

  ok(!window.Bar, 'not added to global namespace');


  equal(fb.shortName, 'Bar', 'short name is right');
});
test('setups', function setupsTest() {
  var order = 0,
    staticSetup, staticSetupArgs, staticInit, staticInitArgs, protoSetup, protoInitArgs, protoInit,
    staticProps = {
      setup: function setup() {
        staticSetup = ++order;
        staticSetupArgs = arguments;

        return ['something'];
      },
      init: function init() {
        staticInit = ++order;
        staticInitArgs = arguments;
      }
    },
    protoProps = {
      setup: function setup(name) {
        protoSetup = ++order;

        return ['Ford: ' + name];
      },
      init: function init() {
        protoInit = ++order;
        protoInitArgs = arguments;
      }
    };
  var Car = Construct.extend('Car', staticProps, protoProps);

  new Car('geo');
  equal(staticSetup, 1);
  equal(staticInit, 2);
  equal(protoSetup, 3);
  equal(protoInit, 4);
  deepEqual(makeArray(staticInitArgs), ['something']);
  deepEqual(makeArray(protoInitArgs), ['Ford: geo']);
  deepEqual(makeArray(staticSetupArgs), [
    Construct,
    'Car',
    staticProps,
    protoProps
  ], 'static construct');
  // now see if staticSetup gets called again ...
  Car.extend('Truck');
  equal(staticSetup, 5, 'Static setup is called if overwriting');
});
/* eslint-disable */
test('Creating without extend', function withoutExtendTest() {
  var Bar = Construct('Bar', {
    ok: function barOk() {
      ok(true, 'ok called');
    }
  });

  new Bar().ok();
  var Foo = Bar('Foo', {
    dude: function fooDude() {
      ok(true, 'dude called');
    }
  });

  new Foo().dude(true);
});

// !steal-remove-start
if (dev) {
  test('console warning if extend is not used without new (#932)', function warningTest() {
    var oldlog = dev.warn;

    dev.warn = function warn(text) {
      ok(text, 'got a message');
      dev.warn = oldlog;
    };
    var K1 = Construct({
    });

    K1({
    });
  });
}
// !steal-remove-end
/* eslint-enable */

test('setup called with original arguments', function originalArgumentsTest() {
  var o2 = {
  };
  var o1 = {
    setup: function setup(base, arg1, arg2) {
      equal(o1, arg1, 'first argument is correct');
      equal(o2, arg2, 'second argument is correct');
    }
  };

  Construct.extend(o1, o2);
});

test('legacy namespace strings (A.B.C) accepted', function legacyNamespaceTest() {
  var Type = Construct.extend('Foo.Bar.Baz');
  var expectedValue = steal.config('env').indexOf('production') !== -1 ? '' : 'Foo_Bar_Baz';

  ok(new Type() instanceof Construct, 'No unexpected behavior in the prototype chain');
  if (Function.prototype.name) {
    equal(Type.name, expectedValue, 'Name becomes underscored');
  }
});

test('reserved words accepted', function reservedWordsTest() {
  var Type = Construct.extend('const');
  var expectedValue = steal.config('env').indexOf('production') !== -1 ? '' : 'Const';

  ok(new Type() instanceof Construct, 'No unexpected behavior in the prototype chain');
  if (Function.prototype.name) {
    equal(Type.name, expectedValue, 'Name becomes capitalized');
  }
});


test('basic injection attacks thwarted', function basicInjectionTest() {
  var rootToken = typeof window === 'undefined' ? 'global' : 'window';
  var rootObject = typeof window === 'undefined' ? global : window;

  // check for injection
  var expando = 'foo' + Math.random().toString(10).slice(2);
  var MalignantType;

  try {
    MalignantType = Construct.extend('(){};' + rootToken + '.' + expando + '=\'bar\';var f=function');
  } catch (e) { // ok if it fails
  } finally {
    equal(rootObject[expando], undefined, 'Injected code doesn\'t run');
  }
  delete rootObject[expando];
  try {
    MalignantType = Construct.extend('(){},' + rootToken + '.' + expando + '=\'baz\',function');
  } catch (e) {
  } finally {
    equal(rootObject[expando], undefined, 'Injected code doesn\'t run');
  }
});

QUnit.test('setters not invoked on extension (#28)', function settersTest() {
  var extending = true;
  var Base = Construct.extend('Base', {
    set something(value) {
      QUnit.ok(!extending, 'called when not extending');
    },
    get something() {
      // empty
    }
  });

  Base.extend('Extended', {
    something: 'value'
  });
  extending = false;
  new Base().something = 'foo';
});

QUnit.test('return alternative value simple', function returnAltSimpleTest() {
  var Alternative = function Alternative() {};
  var Base = Construct.extend({
    setup: function setup() {
      return new Construct.ReturnValue(new Alternative());
    }
  });

  QUnit.ok(new Base() instanceof Alternative, 'Should create an instance of Alternative');
});

QUnit.test('return alternative value on setup (full case)', function returnAltFullTest() {
  var Student = function Student(name, school) {
    this.name = name;
    this.school = school;
    this.isStudent = true;
  };
  var Person = Construct.extend({
    setup: function setup(opts) {
      if (opts.age >= 16) {
        return new Construct.ReturnValue(new Student(opts.name, opts.school));
      }
      opts.isStudent = false;

      return [opts];
    },
    init: function init(params) {
      this.age = params.age;
      this.name = params.name;
      this.isStudent = params.isStudent;
    }
  });

  QUnit.equal(new Person({
    age: 12
  }).isStudent, false, 'Age 12 cannot be a student');
  QUnit.equal(new Person({
    age: 30
  }).isStudent, true, 'Age 20 can be a student');
  QUnit.ok(new Person({
    age: 30
  }) instanceof Student, 'Should return an instance of Student');
});
