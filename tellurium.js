Module('Tellurium')({
    children          : [],
    completedChildren : [],
    isCompleted       : false,
    suite             : function (description) {
        var factory = function (code) {
            var suite = new Tellurium.Suite(description, code);
            suite.setParent(Tellurium);
            Tellurium.children.push(suite);
            return suite;
        };

        return factory;
    },
    run               : function () {
        var i;

        for (i = 0; i < this.children.length; i++) {
            this.children[i].run();
        }

        return this;
    },
    childCompleted    : function (child) {
        this.completedChildren.push(child);

        if (this.children.length === this.completedChildren.length) {
            this.completed();
        }

        return this;
    },
    completed         : function () {
        this.isCompleted = true;
        return this;
    }
});

Module(Tellurium, 'Context')({
    prototype : {
        description       : null,
        code              : null,
        parent            : null,
        children          : null,
        completedChildren : null,
        beforeEachPool    : null,
        afterEachPool     : null,
        isCompleted       : null,
        init              : function (description, code) {
            this.description       = description;
            this.code              = code;
            this.children          = [];
            this.completedChildren = [];
            this.beforeEachPool    = [];
            this.afterEachPool     = [];
            this.isCompleted       = false;
        },
        appendChild       : function (child) {
            if (child.parent) {
                child.parent.removeChild(child);
            }

            this.children.push(child);
            child.setParent(this);

            return child;
        },
        setParent         : function (parent) {
            this.parent = parent;

            return this;
        },
        describe          : function (description) {
            var current = this;

            return function (code) {
                var description = new Tellurium.Description(description, code);
                current.appendChild(description);
            };
        },
        specify           : function (description) {
            var current = this;

            return function (code) {
                var specification = new Tellurium.Specification(description, code);
                current.appendChild(specification);
            };
        },
        beforeEach        : function (code) {
            this.beforeEachPool.push(code);

            return this;
        },
        afterEach         : function (code) {
            this.afterEachPool.push(code);

            return this;
        },
        run               : function () {
            var i;

            this.code.call(this, this);

            if (this.children.length === 0) {
                this.completed();
            }

            for (i = 0; i < this.children.length; i++) {
                if (this.children[i] instanceof Tellurium.Specification) {
                    this.runBeforeEach(this.children[i]);
                }
                this.children[i].run();
            }

            return this;
        },
        runBeforeEach     : function (context) {
            var i;
            
            context = context || this;

            if (this.parent && this.parent.runBeforeEach) {
                this.parent.runBeforeEach(context);
            }

            for (i = 0; i < this.beforeEachPool.length; i++) {
                this.beforeEachPool[i].call(context, context);
            }

            return this;
        },
        runAfterEach      : function (context) {
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
        childCompleted    : function (child) {
            this.completedChildren.push(child);

            if (child instanceof Tellurium.Specification) {
                this.runAfterEach(child);
            }

            if (this.children.length === this.completedChildren.length) {
                this.completed();
            }

            return this;
        },
        completed         : function () {
            this.isCompleted = true;

            if (this.parent) {
                this.parent.childCompleted(this);
            }

            return this;
        }
    }
});

Class(Tellurium, 'Suite').includes(Tellurium.Context)({});

Class(Tellurium, 'Description').includes(Tellurium.Context)({});

Class(Tellurium, 'Specification')({
    prototype : {
        STATUS_PENDANT  : 'STATUS_PENDANT',
        STATUS_FAIL     : 'STATUS_FAIL',
        STATUS_SUCCESS  : 'STATUS_SUCCESS',
        description     : null,
        code            : null,
        parent          : null,
        assertions      : null,
        registry        : null,
        status          : null,
        isCompleted     : null,
        init            : function (description, code) {
            this.description = description;
            this.code        = code;
            this.registry    = {};
            this.assertions  = [];
            this.isCompleted = false;
        },
        setParent       : function (parent) {
            this.parent = parent;
            return this;
        },
        run             : function () {
            if (this.code) {
                this.code.call(this, this);
            }
            else {
                this.pendant();
            }
        },
        pendant         : function () {
            this.status = this.STATUS_PENDANT;
            this.completed();  
        },
        assertionPassed : function (assertion) {
            if (this.status !== this.STATUS_FAIL) {
                this.status = this.STATUS_SUCCESS;
            }

            this.assertions.push(assertion);

            return this;
        },
        assertionFailed : function (assertion) {
            this.status = this.STATUS_FAIL;
            this.assertions.push(assertion);

            return this;
        },
        assert          : function (actual) {
            return new Tellurium.Assertion(actual, this);
        },
        completed       : function () {
            this.isCompleted = true;
            this.parent.childCompleted(this);

            return this;
        }
    }
});

Class(Tellurium, 'Mock')({
    create : function(obj){
        return obj;
    }
});

Class(Tellurium, 'Stub')({
    
});

Class(Tellurium, 'Spy')({
    on        : function (targetObject, spyedFunction) {
        return (new Tellurium.Spy(targetObject, spyedFunction));
    },
    prototype : {
        called            : [],
        targetObject      : null,
        spyedFunctionName : null,
        spyedFunction     : null,
        init              : function (targetObject, spyedFunction) {
            this.targetObject      = targetObject;
            this.spyedFunctionName = spyedFunction;
            this.spyedFunction     = targetObject[spyedFunction];

            var spy = this;

            this.targetObject[this.spyedFunctionName] = function () {
                var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                spy.called.push({
                    args : args
                });
                return spy.spyedFunction.apply(spy.targetObject, args);
            };
        }
    }
});

Class(Tellurium, 'Assertion')({
    prototype : {
        actual            : null,
        spec              : null,
        init              : function (actual, spec) {
            this.actual = actual;
            this.spec = spec;
        },
        notify            : function (assertResult, actual, assertName, expected) {
            if (assertResult === true) {
                this.spec.assertionPassed(this, actual, assertName, expected);
            }
            else {
                this.spec.notifyFailure(this, actual, assertName, expected);
            }
        },
        addAssert         : function (name, assertFn) {
            this[name] = function () {
                this.notify(assertFn.apply(this, arguments));  
            };
        },
        toBe              : function (expected) {
            var result = (this.actual === expected);
            this.notify(result, this.actual, 'toBe', expected);
        },                                      
        toNotBe           : function (expected) {
            var result = (this.actual !== expected);
            this.notify(result, this.actual, 'toNotBe', expected);
        },                                      
        toEqual           : function (expected) {
            var result = (this.actual == expected);
            this.notify(result, this.actual, 'toEqual', expected);
        },                                      
        toNotEqual        : function (expected) {
            var result = (this.actual != expected);
            this.notify(result, this.actual, 'toNotEqual', expected);
        },                                      
        toMatch           : function (expected) {
            var result = (expected.test(this.actual) === true);
            this.notify(result, this.actual, 'toMatch', expected);
        },                                      
        toNotMatch        : function (expected) {
            var result = (expected.test(this.actual) === false);
            this.notify(result, this.actual, 'toNotMatch', expected);
        },
        toBeDefined       : function () {
            var result = (typeof this.actual !== 'undefined'); 
            this.notify(result, this.actual, 'toBeDefined');
        },                              
        toBeUndefined     : function () {
            var result = (typeof this.actual === 'undefined');
            this.notify(result, this.actual, 'toBeUndefined');
        },                              
        toBeNull          : function () {
            var result = (this.actual === null);
            this.notify(result, this.actual, 'toBeNull');
        },                              
        toBeTruthy        : function () {
            var result = ((this.actual) ? true : false);
            this.notify(result, this.actual, 'toBeTruthy');
        },                              
        toBeFalsy         : function () {
            var result = ((this.actual) ? false : true);
            this.notify(result, this.actual, 'toBeFalsy');
        },                              
        toBeCalled        : function () {
            var result = (this.actual.called.length > 0);
            this.notify(result, this.actual.spyedFunctionName, 'toBeCalled');
        },                              
        toNotBeCalled     : function () {
            var result = (this.actual.called.length === 0);
            this.notify(result, this.actual.name, 'toNotBeCalled');
        },
        toBeCalledWith    : function (expected) {
            var result = (this.actual.called[0] === expected);
            this.notify(result, this.actual.name, 'toBeCalledWith', expected);
        },                                      
        toNotBeCalledWith : function (expected) {
            var result = (this.actual.called[0] !== expected);
            this.notify(result, this.actual.name, 'toNotBeCalledWith', expected);
        },                                     
        toBeLessThan      : function (expected) {
            var result = (this.actual < expected);
            this.notify(result, this.actual, 'toBeLessThan', expected);
        },                                      
        toBeGreaterThan   : function (expected) {
            var result = (this.actual > expected);
            this.notify(result, this.actual, 'toBeGreaterThan', expected);
        },                                      
        toBeInstanceOf    : function (expected) {
            var result = (this.actual.constructor === expected);
            this.notify(result, this.actual, 'toBeInstanceOf', expected);
        }
    }
});