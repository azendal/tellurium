Class('Tellurium')({
    run : function (code) {
        var tellurium = new Tellurium();
        tellurium.run(code);
    },
    
    prototype : {
        _beforeEachPool : null,
        _afterEachPool  : null,
        _specs          : [],
        _completedSpecs : [],
        parent          : null,
        
        init : function(){
            this._beforeAllPool  = [];
            this._afterAllPool   = [];
            this._beforeEachPool = [];
            this._afterEachPool  = [];
        },
        run : function (fn) {
            if (this.parent === null) {
                console.time('time');
            }
            fn.call(this, this);
        },
        spec : function(description){
            var tellurium = this;
            var factory = function(fn){
                var spec;
                
                spec = new Tellurium.Spec(description, fn, tellurium);
                tellurium._specs.push(spec);
                
                tellurium._runBeforeEach(spec);
                
                spec.run();
                
                tellurium._runAfterEach(spec);
            };

            return factory;
        },
        specify : function(description){
            var tellurium = this;
            var factory = function(fn){
                var spec;
                
                spec = new Tellurium.Spec(description, fn, tellurium);
                tellurium._specs.push(spec);
                
                tellurium._runBeforeEach(spec);
                
                spec.run();
                
                tellurium._runAfterEach(spec);
            };

            return factory;
        },
        specCompleted : function(spec){
            this._completedSpecs.push(spec);
            if(this._specs.length == this._completedSpecs.length){
                this.completed();
            }
        },
        completed : function(){
            this._completed = true;
            //console.log('completed');
            // console.group('Test Results');
            // var columns = [
            //     {property : 'description', label : 'Description'},
            //     {property : 'status', label : 'Status'}
            // ];
            // console.log(this._specs);
            // console.groupEnd();
            //console.timeEnd('time');
        },
        beforeEach : function(code){
            this._beforeEachPool.push(code);
        },
        afterEach : function(code){
            this._afterEach.push(code);
        },
        describe : function(description){
            var parent = this;
            var factory = function(code){
                var tellurium = new Tellurium();
                tellurium.parent = parent;
                tellurium.run(code);
            };
            
            return factory;
        },
        _runBeforeEach : function(spec){
            if(this.parent){
                this.parent._runBeforeEach(spec);
            }
            
            for(var i = 0; i < this._beforeEachPool.length; i++){
                this._beforeEachPool[i](spec);
            }
        },
        _runAfterEach : function(spec){
            
            if(this.parent){
                this.parent._runAfterEach(spec);
            }
            
            for(var i = 0; i < this._afterEachPool.length; i++){
                this._afterEachPool[i](spec);
            }
        }
    }
});

var Te = Tellurium;

Class(Tellurium, 'Spec')({
    prototype : {
        description : '',
        registry    : undefined,
        status : undefined,
        init : function(description, fn, tellurium){
            this.registry = {};
            this.description = description;
            this.fn = fn;
            this.parent = tellurium;
        },
        run : function run(){
            if(this.fn){
                this.fn.call(this, this);
            }
            else {
                this.notifyPendant();
            }
        },
        expectations : function expectations(fn) {
            fn(this);
        },
        expect : function assert(value){
            return new Tellurium.Assertion(value, this);
        },
        notifyPendant : function notifyPendant(){
            this.status = 'pendant';
            console.warn(this.description);
            this.completed();
        },
        notifySuccess : function notifySuccess(testedValue, assertion, testValue) {
            if(this.status !== 'failed'){
                this.status = 'success';
            }
            console.info(this.description, ' passed: expected ', testedValue, ' ', assertion, ' ', testValue );
        },
        notifyError : function notifyError(testedValue, assertion, testValue) {
            console.error(this.description, ' failed: expected ', testedValue, ' ', assertion, ' ', testValue );
            this.status = 'failed';
        },
        completed : function(){
            this._completed = true;
            this.parent.specCompleted(this);
        }
    }
});

Class(Tellurium, 'Spy')({
    on : function(targetObject, spyedFunction){
        return (new this(targetObject, spyedFunction));
    },
    prototype : {
        called : [],
        targetObject : null,
        spyedFunctionName : null,
        spyedFunction : null,
        init : function(targetObject, spyedFunction){
            this.targetObject      = targetObject;
            this.spyedFunctionName = spyedFunction;
            this.spyedFunction     = targetObject[spyedFunction];
            
            var spy = this;
            
            this.targetObject[this.spyedFunctionName] = function(){
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
        actual : undefined,
        spec  : undefined,
        init : function init(actual, spec) {
            this.actual = actual;
            this.spec = spec;
        },
        notify : function (assertResult, actual, assertName, expected) {
            if (assertResult === true) {
                this.spec.notifySuccess(actual, assertName, expected);
            }
            else {
                this.spec.notifyError(actual, assertName, expected);
            }
        },
        addAssert : function(name, assertFn){
            this[name] = function(){
              this.notify(assertFn.apply(this, arguments));  
            };
        },
        toBe : function(expected){
            var result = (this.actual === expected);
            this.notify(result, this.actual, 'toBe', expected);
        },
        toNotBe : function(expected) {
            var result = (this.actual !== expected);
            this.notify(result, this.actual, 'toNotBe', expected);
        },
        toEqual : function(expected){
            var result = (this.actual == expected);
            this.notify(result, this.actual, 'toEqual', expected);
        },
        toNotEqual : function(expected){
            var result = (this.actual != expected);
            this.notify(result, this.actual, 'toNotEqual', expected);
        },
        toMatch : function(expected){
            var result = (expected.test(this.actual) === true);
            this.notify(result, this.actual, 'toMatch', expected);
        },
        toNotMatch : function(expected){
            var result = (expected.test(this.actual) === false);
            this.notify(result, this.actual, 'toNotMatch', expected);
        },
        toBeDefined : function(){
            var result = (typeof this.actual !== 'undefined'); 
            this.notify(result, this.actual, 'toBeDefined', expected);
        },
        toBeUndefined : function(){
            var result = (typeof this.actual === 'undefined');
            this.notify(result, this.actual, 'toBeUndefined', expected);
        },
        toBeNull : function(){
            var result = (this.actual === null);
            this.notify(result, this.actual, 'toBeNull', expected);
        },
        toBeTruthy : function(){
            var result = ((this.actual) ? true : false);
            this.notify(result, this.actual, 'toBeTruthy', expected);
        },
        toBeFalsy : function(){
            var result = ((this.actual) ? false : true);
            this.notify(result, this.actual, 'toBeFalsy', expected);
        },
        toBeCalled : function(){
            var result = (this.actual.called.length > 0);
            this.notify(result, this.actual.spyedFunctionName, 'toBeCalled');
        },
        toNotBeCalled : function(){
            var result = (this.actual.called.length === 0);
            this.notify(result, this.actual.name, 'toNotBeCalled');
        },
        toBeCalledWith : function(expected){
            var result = (this.actual.called[0] == expected);
            this.notify(result, this.actual.name, 'toBeCalledWith', expected);
        },
        toNotBeCalledWith : function(expected){
            var result = (this.actual.called[0] != expected);
            this.notify(result, this.actual.name, 'toNotBeCalledWith', expected);
        },
        toContain : function(expected){
            var result = (Tellurium.util.lang.iterable.contains(this.actual, expected)  === true);
            this.notify(result, this.actual, 'toContain', expected);
        },
        toNotContain : function(expected){
            var result = (Tellurium.util.lang.iterable.contains(this.actual, expected)  === false);
            this.notify(result, this.actual, 'toNotContain', expected);
        },
        toBeLessThan : function(expected){
            var result = (this.actual < expected);
            this.notify(result, this.actual, 'toBeLessThan', expected);
        },
        toBeGreaterThan : function(expected){
            var result = (this.actual > expected);
            this.notify(result, this.actual, 'toBeGreaterThan', expected);
        },
        toBeInstanceOf : function(expected){
            var result = (this.actual.constructor == expected);
            this.notify(result, this.actual, 'toBeInstanceOf', expected);
        }
    }
});