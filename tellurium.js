Module('Tellurium')({
    children          : [],
    completedChildren : [],
    isCompleted       : false,
    reporter          : null,
    suite             : function (description) {
        var factory = function (code) {
            var suite = new Tellurium.Suite(description, code);
            suite.setParent(Tellurium);
            Tellurium.children.push(suite);
            return suite;
        };

        return factory;
    },
    run               : function (ids) {
        var i, j, id;
        
        this.completedChildren = [];
        this.isCompleted       = false;
        
        if (typeof ids == 'string') {
            ids = [ids];
        }
        
        if (ids) {
            for (var j=0; j < ids.length; j++) {
                id = ids[j];
                for (i = 0; i < this.children.length; i++) {
                    if (this.children[i].description == id) {
                        console.time('run ' + this.children[i].description);
                        this.children[i].run();
                    }
                }
            }
        }
        else {
            console.time('run all');
            for (i = 0; i < this.children.length; i++) {
                Tellurium.children[i].run();
            }
        }

        return this;
    },
    childCompleted    : function (child) {
        this.completedChildren.push(child);
        
        if (this.reporter === null) {
            this.reporter = new Tellurium.Reporter.Firebug();
        }
        console.timeEnd('run ' + child.description);
        this.reporter.run(child);
        
        if (this.children.length === this.completedChildren.length) {
            this.completed();
        }

        return this;
    },
    completed         : function () {
        this.isCompleted = true;
        console.timeEnd('run all');
        return this;
    }
});
Te = Tellurium;

Class(Tellurium, 'Stub')({
    prototype : {
        targetObject   : null,
        methodName     : null,
        newMethod      : null,
        originalMethod : null,
        init           : function (config) {
            config = config || {};
            
            this.targetObject   = config.targetObject;
            this.methodName     = config.methodName;
            this.newMethod      = config.newMethod;
        },
        applyStub      : function () {
            this.originalMethod = this.targetObject[this.methodName];
            this.targetObject[this.methodName] = this.newMethod;
            return this;
        },
        removeStub     : function () {
            this.targetObject[this.methodName] = this.originalMethod;
            return this;
        },
        on             : function (targetObject) {
            this.targetObject = targetObject;
            return this;
        },
        method         : function (methodName) {
            this.methodName = methodName;
            return this;
        },
        using          : function (newMethod) {
            this.newMethod = newMethod;
            this.applyStub();
            return this;
        }
    }
});

Module(Tellurium.Stub, 'Factory')({
    prototype : {
        stubs      : null,
        stub       : function () {
            var stub = new Tellurium.Stub();
            this.stubs = this.stubs || [];
            this.stubs.push(stub);
            return stub;
        },
        cleanStubs : function () {
            var i;
            
            for (i = 0; i < this.stubs.length; i++) {
                this.stubs[i].removeStub();
            }
            
            return this;
        }
    }
});

Class(Tellurium, 'Spy')({
    prototype : {
        targetObject   : null,
        methodName     : null,
        spyMethod      : null,
        originalMethod : null,
        called         : null,
        init           : function (config) {
            config = config || {};
            
            this.called         = [];
            this.targetObject   = config.targetObject;
            this.methodName     = config.methodName;
        },
        applySpy       : function () {
            var spy;
            
            spy = this;
            this.originalMethod = this.targetObject[this.methodName];
            this.targetObject[this.methodName] = function () {
                var args, result;
                args = Array.prototype.slice.call(arguments, 0, arguments.length);
                result = spy.originalMethod.apply(spy.targetObject, args);
                spy.called.push({arguments : args, returned : result});
                return result;
            };
            return this;
        },
        removeSpy      : function () {
            this.targetObject[this.methodName] = this.originalMethod;
            return this;
        },
        on             : function (targetObject) {
            this.targetObject = targetObject;
            return this;
        },
        method         : function (methodName) {
            this.methodName = methodName;
            this.applySpy();
            return this;
        }
    }
});

Module(Tellurium.Spy, 'Factory')({
    prototype : {
        spies      : null,
        spy        : function () {
            var spy = new Tellurium.Spy();
            this.spies = this.spies || [];
            this.spies.push(spy);
            return spy;
        },
        cleanSpies : function () {
            var i;
            
            for (i = 0; i < this.spies.length; i++) {
                this.spies[i].removeSpy();
            }
            
            return this;
        }
    }
});

Class(Tellurium, 'Assertion')({
    includeAssertions : function (assertions) {
        var assertion;
        for (assertion in assertions) {
            if (assertions.hasOwnProperty(assertion)) {
                this.prototype.addAssert(assertion, assertions[assertion]);
            }
        }
        
        return this;
    },
    prototype : {
        TYPE_TRUE         : 'TYPE_TRUE',
        TYPE_FALSE        : 'TYPE_FALSE',
        STATUS_FAIL       : 'STATUS_FAIL',
        STATUS_SUCCESS    : 'STATUS_SUCCESS',
        actual            : null,
        expected          : null,
        spec              : null,
        status            : null,
        type              : null,
        init              : function (actual, spec) {
            this.type   = this.TYPE_TRUE;
            this.actual = actual;
            this.spec   = spec;
        },
        not               : function () {
            this.type = this.TYPE_FALSE;
            return this;
        },
        notify            : function (assertResult) {
            if( assertResult === true) {
                if (this.type === this.TYPE_FALSE) {
                    this.status = this.STATUS_FAIL;
                    this.spec.assertionFailed(this);
                }
                else {
                    this.status = this.STATUS_SUCCESS;
                    this.spec.assertionPassed(this);
                }
            } else {
                if (this.type === this.TYPE_FALSE) {
                    this.status = this.STATUS_SUCCESS;
                    this.spec.assertionPassed(this);
                }
                else {
                    this.status = this.STATUS_FAIL;
                    this.spec.assertionFailed(this);
                }
            }
            
            return this;
        },
        addAssert         : function (name, assertFn) {
            this[name] = function () {
                var args;
                
                args = Array.prototype.slice.call(arguments, 0, arguments.length);
                this.invoqued = name;
                this.expected = args;
                this.notify(assertFn.apply(this, args));
                return null;
            };
            
            return this;
        }
    }
});

Tellurium.Assertion.includeAssertions({
    toBe            : function (expected) {
        return (this.actual === expected);
    },
    toEqual         : function (expected) {
        return (this.actual == expected);
    },
    toMatch         : function (expected) {
        return (expected.test(this.actual) === true);
    },
    toBeDefined     : function () {
        return (typeof this.actual !== 'undefined');
    },
    toBeNull        : function () {
        return (this.actual === null);
    },
    toBeTruthy      : function () {
        return ((this.actual) ? true : false);
    },
    toBeCalled      : function () {
        return (this.actual.called.length > 0);
    },
    toBeCalledWith  : function (expected) {
        return (this.actual.called[0].arguments === expected);
    },
    toReturn        : function (expected) {
        return (this.actual.called[0].returned === expected);
    },
    toBeGreaterThan : function (expected) {
        return (this.actual > expected);
    },
    toBeLessThan    : function (expected) {
        return (this.actual < expected);
    },
    toBeInstanceOf  : function (expected) {
        return (this.actual.constructor === expected);
    },
    toThrowError    : function (expected) {
        try {
          this.actual();
        } catch (e) {
            if (e === expected || e.name === expected) {
                return true;
            }
        }
        return false;
    },
    toNotThrowError : function () {
        try {
            this.actual();
            return true;
        } catch (e) {
            return false;
        }
    }
});

Module(Tellurium, 'Context')({
    prototype : {
        registry            : null,
        description         : null,
        code                : null,
        parent              : null,
        children            : null,
        completedChildren   : null,
        setupCode           : null,
        tearDownCode        : null,
        beforeEachPool      : null,
        completedBeforeEach : null,
        afterEachPool       : null,
        completedAfterEach  : null,
        isCompleted         : null,
        init                : function (description, code) {
            this.registry            = [];
            this.description         = description;
            this.code                = code;
            this.children            = [];
            this.completedChildren   = [];
            this.beforeEachPool      = [];
            this.completedBeforeEach = [];
            this.completedAfterEach  = [];
            this.afterEachPool       = [];
            this.isCompleted         = false;
        },
        appendChild         : function (child) {
            if (child.parent) {
                child.parent.removeChild(child);
            }

            this.children.push(child);
            child.setParent(this);

            return child;
        },
        setParent           : function (parent) {
            this.parent = parent;

            return this;
        },
        setup               : function (code) {
            var description = 'setup code';
            this.setupCode = new Tellurium.Description(description, code);
            return this;
        }, 
        tearDown            : function (code) {
            var description = 'tear down code';
            this.tearDownCode = new Tellurium.Description(description, code);
            return this;
        },
        describe            : function (description) {
            var current, fn, guided;
            
            current = this;
            
            fn = function (code) {
                var describe = new Tellurium.Description(description, code);
                
                if (guided === true) {
                    describe.guided = true;
                    var index = 0;
                    describe.run = function(){
                        this.code.call(this, this);

                        if (this.children.length === 0) {
                            this.completed();
                        }

                        if (this.setupCode) {
                            this.setupCode.run();
                        }
                        
                        if (this.children[index] instanceof Tellurium.Specification) {
                            this.runBeforeEach(this, this.children[index]);
                        }
                        
                        this.children[index].run();

                        return this;
                    };
                    
                    describe.childCompleted = function(child){
                        this.completedChildren.push(child);

                        if (child instanceof Tellurium.Specification) {
                            this.runAfterEach(child);
                        }
                        
                        if (this.children.length === this.completedChildren.length) {
                            this.completed();
                        }
                        else {
                            index = index + 1;
                            if (this.children[index] instanceof Tellurium.Specification) {
                                this.runBeforeEach(this, this.children[index]);
                            }
                            this.children[index].run();
                        }

                        return this;
                    };
                }
                else {
                    describe.guided = false;
                }
                
                current.appendChild(describe);
                
                return current;
            };
            
            fn.guided = function(){
                guided = true;
                return fn;
            };
            
            return fn;
        },
        specify             : function (description) {
            var current = this;
            var sync    = false;
            var fn      = function (code) {
                var specification = new Tellurium.Specification(description, code);
                specification.sync = sync;
                current.appendChild(specification);
            };
            
            fn.sync = function(){
                sync = true;
                return fn;
            };
            
            return fn;
        },
        beforeEach          : function (code) {
            this.beforeEachPool.push(code);

            return this;
        },
        afterEach           : function (code) {
            this.afterEachPool.push(code);

            return this;
        },
        run                 : function () {
            var i;
            
            this.children = [];
            this.completedChildren = [];

            this.code.call(this, this);

            if (this.children.length === 0) {
                this.completed();
            }
            
            if (this.setupCode) {
                this.setupCode.run();
            }
            
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i] instanceof Tellurium.Specification) {
                    this.runBeforeEach(this, this.children[i]);
                }
                this.children[i].run();
            }

            return this;
        },
        runBeforeEach       : function (specification, context) {
            var i;
            
            context = context || this
            
            if (this.parent && this.parent.runBeforeEach) {
                this.parent.runBeforeEach(specification, context);
            }

            for (i = 0; i < this.beforeEachPool.length; i++) {
                this.beforeEachPool[i].call(context, specification, context);
            }

            return this;
        },
        runAfterEach        : function (context) {
            var i;
            
            context = context || this;

            if (this.parent && this.parent.runAfterEach) {
                this.parent.runAfterEach(context);
            }

            for (i = 0; i < this.afterEachPool.length; i++) {
                this.afterEachPool[i].call(context, context);
            }

            return this;
        },
        childCompleted      : function (child) {
            this.completedChildren.push(child);

            if (child instanceof Tellurium.Specification) {
                this.runAfterEach(child);
            }

            if (this.children.length === this.completedChildren.length) {
                this.completed();
            }

            return this;
        },
        completed           : function () {
            this.isCompleted = true;
            
            if (this.spies) {
                this.cleanSpies();
            }
            
            if (this.stubs) {
                this.cleanStubs();
            }
            
            if (this.tearDownCode) {
                this.tearDownCode.run();
            }
            
            if (this.parent) {
                this.parent.childCompleted(this);
            }

            return this;
        }
    }
});

Class(Tellurium, 'Suite').includes(Tellurium.Context, Tellurium.Stub.Factory, Tellurium.Spy.Factory)({});

Class(Tellurium, 'Description').includes(Tellurium.Context, Tellurium.Stub.Factory, Tellurium.Spy.Factory)({
    prototype : {
        guided : false
    }
});

Class(Tellurium, 'Specification').includes(Tellurium.Stub.Factory, Tellurium.Spy.Factory)({
    prototype : {
        STATUS_PENDING  : 'STATUS_PENDING',
        STATUS_FAIL     : 'STATUS_FAIL',
        STATUS_SUCCESS  : 'STATUS_SUCCESS',
        description     : null,
        code            : null,
        parent          : null,
        assertions      : null,
        registry        : null,
        status          : null,
        isCompleted     : null,
        sync            : false,
        init            : function (description, code) {
            this.description = description;
            this.code        = code;
            this.registry    = {};
            this.assertions  = [];
            this.spies       = [];
            this.stubs       = [];
            this.isCompleted = false;
        },
        setParent       : function (parent) {
            this.parent = parent;
            return this;
        },
        run             : function () {
            if (this.code) {
                this.code.call(this, this);
                if(this.sync === true){
                    this.completed();
                }
            }
            else {
                this.pending();
            }
        },
        pending         : function () {
            this.status = this.STATUS_PENDING;
            this.completed();  
        },
        assertionPassed : function (assertion) {
            if (this.status !== this.STATUS_FAIL) {
                this.status = this.STATUS_SUCCESS;
            }

            return this;
        },
        assertionFailed : function (assertion) {
            this.status = this.STATUS_FAIL;

            return this;
        },
        assert          : function (actual) {
            var assertion = new Tellurium.Assertion(actual, this);
            this.assertions.push(assertion);
            return assertion;
        },
        mock            : function () {
            return {};
        },
        completed       : function () {
            
            this.isCompleted = true;
            
            if (this.spies) {
                this.cleanSpies();
            }
            
            if (this.stubs) {
                this.cleanStubs();
            }
            
            if(this.status === null){
                this.status = this.STATUS_SUCCESS;
            }
            
            this.parent.childCompleted(this);

            return this;
        }
    }
});

Tellurium.Reporter = {};

Class(Tellurium.Reporter, 'Firebug')({
    prototype : {
        totalSpecs    : null,
        failedSpecs   : null,
        passedSpecs   : null,
        pendingSpecs  : null,
        init          : function () {
            this.totalSpecs   = 0;
            this.failedSpecs  = 0;
            this.passedSpecs  = 0;
            this.pendingSpecs = 0;
        },
        run           : function (suite) {
            console.log('Tellurium Test Results for ' + suite.description);
            this.totalSpecs   = 0;
            this.passedSpecs  = 0;
            this.failedSpecs  = 0;
            this.pendingSpecs = 0;
            
            this.suite(suite);
            console.info('Total: ', this.totalSpecs);
            console.info('Passed: ', this.passedSpecs);
            console.info('%cFailed: ' + this.failedSpecs, 'background-color:#FFEBEB; color : #FF2424');
            console.warn('Pending: ', this.pendingSpecs);
            console.log('End')
        },
        suite         : function (suite) {
            console.group(suite.description);
            
            for (var i=0; i < suite.children.length; i++) {
                if(suite.children[i] instanceof Tellurium.Description){
                    this.description(suite.children[i]);
                }
                else if(suite.children[i] instanceof Tellurium.Specification){
                    this.specification(suite.children[i]);
                }
            }
            
            console.groupEnd(suite.description);
        },
        description   : function (description) {
            console.group(description.description);
            
            for (var i=0; i < description.children.length; i++) {
                if(description.children[i] instanceof Tellurium.Description){
                    this.description(description.children[i]);
                }
                else if(description.children[i] instanceof Tellurium.Specification){
                    this.specification(description.children[i]);
                }
            };
            
            console.groupEnd(description.description);
        },
        specification : function (specification) {
            this.totalSpecs = this.totalSpecs + 1;
            if(specification.status == specification.STATUS_FAIL) {
                this.failedSpecs = this.failedSpecs + 1;
                console.error(specification.description, '');
            }
            else if( specification.status == specification.STATUS_SUCCESS ){
                this.passedSpecs = this.passedSpecs + 1;
                console.info(specification.description, '');
            }
            else if( specification.status == specification.STATUS_PENDING ){
                this.pendingSpecs = this.pendingSpecs + 1;
                console.warn(specification.description, '');
            }
            
            console.groupCollapsed('assertions');
            for (var i=0; i < specification.assertions.length; i++) {
                this.assertion(specification.assertions[i]);
            };
            console.groupEnd('assertions');
            
        },
        assertion     : function (assertion) {
            var not = (assertion.type == Tellurium.Assertion.prototype.TYPE_FALSE) ? ' not ' : ' ';
            if(assertion.status == assertion.STATUS_SUCCESS){
                console.info(assertion.actual, not, assertion.invoqued, ' ', (assertion.expected) ? assertion.expected : '')
            }
            else if(assertion.status == assertion.STATUS_FAIL){
                console.error(assertion.actual, not, assertion.invoqued, ' ', (assertion.expected) ? assertion.expected : '')
            }
        }
    }
});