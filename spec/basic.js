Tellurium.suite('Tellurium')(function(){
    
    this.describe('not taking any action')(function(){
        
    });
    
    this.describe('specs')(function(){
        this.specify('come up as pendant')();

        this.specify('do nothing but not break')(function(){
            this.completed();
        }); 
    });
    
    this.describe('basic matchers')(function(){
        
        this.beforeEach(function(spec){
            console.log('...')
            
            spec.registry.arr = [];
            spec.registry.obj = {};
            spec.registry.fn = function(){};
            spec.registry.num = 1;
            spec.registry.str = 'x';
            spec.registry.reg = /x/;
            
            spec.registry.arr2 = [];
            spec.registry.obj2 = {};
            spec.registry.fn2 = function(){};
            spec.registry.num2 = 1;
            spec.registry.str2 = 'x';
            spec.registry.reg2 = /x/;
            
        });
        
        this.describe('toBe Matcher')(function(){
            
            this.specify('Array1 is identical to Array1')(function(){
                this.assert(this.registry.arr).toBe(this.registry.arr);
                this.completed();
            });
            
            this.specify('Object1 is identical to Object1')(function(){
                this.assert(this.registry.obj).toBe(this.registry.obj);
                this.completed();
            });
            
            this.specify('Function1 is identical to Object1')(function(){
                this.assert(this.registry.fn).toBe(this.registry.fn);
                this.completed();
            });
            
            this.specify('Number1 is identical to Number1')(function(){
                this.assert(this.registry.num).toBe(this.registry.num);
                this.completed();
            });
            
            this.specify('Number1 is identical to Number2 if both have the same value')(function(){
                this.assert(this.registry.num).toBe(this.registry.num2);
                this.completed();
            });
            
            this.specify('String1 is identical to String1')(function(){
                this.assert(this.registry.str).toBe(this.registry.str);
                this.completed();
            });
            
            this.specify('String1 is identical to String2 if both have the same value')(function(){
                this.assert(this.registry.str).toBe(this.registry.str2);
                this.completed();
            });
            
            this.specify('RegExp1 is identical to RegExp1')(function(){
                this.assert(this.registry.reg).toBe(this.registry.reg);
                this.completed();
            });
            
            this.specify('Boolean is identical to Boolean if both have the same value')(function(){
                this.assert(true).toBe(true);
                this.completed();
            });
            
            this.specify('undefined is identical to undefined no matter how you get it')(function(){
                this.assert(window.undefined1).toBe(window.undefined2);
                this.completed();
            });
            
        });
        
        this.describe('toNotBe Matcher')(function(){
            
            this.specify('Array1 is not identical to Array2')(function(){
                this.assert(this.registry.arr).toNotBe(this.registry.arr2);
                this.completed();
            });
            
            this.specify('Object1 is not identical to Object2')(function(){
                this.assert(this.registry.obj).toNotBe(this.registry.obj2);
                this.completed();
            });
            
            this.specify('Function1 is not identical to Function2')(function(){
                this.assert(this.registry.fn).toNotBe(this.registry.fn2);
                this.completed();
            });
            
            this.specify('RegExp1 is not identical to RegExp2 even if have the same source')(function(){
                this.assert(this.registry.reg).toNotBe(this.registry.reg2);
                this.completed();
            });
            
            this.specify('NaN is not identical to NaN')(function(){
                this.assert(Number('aa')).toNotBe(Number('aa'));
                this.completed();
            });
            
            this.specify('String 1 is not identical to Number 1')(function(){
                this.assert('1').toNotBe(1);
                this.completed();
            });
            
            this.specify('null is not identical to false')(function(){
                this.assert(null).toNotBe(false);
                this.completed();
            });
            
            this.specify('Empty string is not identical to false')(function(){
                this.assert('').toNotBe(false);
                this.completed();
            });
            
            this.specify('Empty string is not identical to null')(function(){
                this.assert('').toNotBe(null);
                this.completed();
            });
            
            this.specify('Empty string is not identical to Number 0')(function(){
                this.assert('').toNotBe(0);
                this.completed();
            });
            
            this.specify('A non empty string is not identical to true')(function(){
                this.assert('non empty').toNotBe(true);
                this.completed();
            });
            
            this.specify('A string filled up with blank characters is not identical to an empty string')(function(){
                this.assert('    ').toNotBe('');
                this.completed();
            });
            
            this.specify('NaN is not identical to false')(function(){
                this.assert(Number('abc')).toNotBe(false);
                this.completed();
            });
            
        });
        
        this.describe('toEqual Matcher')(function(){
            
            this.specify('Array')(function(){
                this.assert(this.registry.arr).toEqual(this.registry.arr);
                this.completed();
            });
            
            
            this.specify('an object must be equal to the same object')(function(){
                this.assert(this.registry.obj).toEqual(this.registry.obj);
                this.completed();
            });
            
            this.specify('must pass if passed the same function')(function(){
                this.assert(this.registry.fn).toEqual(this.registry.fn);
                this.completed();
            });
            
            this.specify('must pass if passed the same number')(function(){
                this.assert(this.registry.num).toEqual(this.registry.num);
                this.completed();
            });
            
            this.specify('must pass if passed different number with same value')(function(){
                this.assert(this.registry.num).toEqual(this.registry.num2);
                this.completed();
            });
            
            this.specify('must pass if passed the same string')(function(){
                this.assert(this.registry.str).toEqual(this.registry.str);
                this.completed();
            });
            
            this.specify('must pass if passed different string with same value')(function(){
                this.assert(this.registry.str).toEqual(this.registry.str2);
                this.completed();
            });
            
            this.specify('must pass if passed the same regexp')(function(){
                this.assert(this.registry.reg).toEqual(this.registry.reg);
                this.completed();
            });
            
        });
        
        
        this.describe('toNotEqual Matcher')(function(){
            
            this.specify('must pass if passed different array with the same values')(function(){
                this.assert(this.registry.arr).toNotEqual(this.registry.arr2);
                this.completed();
            });
            
            this.specify('must pass if passed the different Object with same attributes')(function(){
                this.assert(this.registry.obj).toNotEqual(this.registry.obj2);
                this.completed();
            });
            
            this.specify('must pass if passed different Function with same source')(function(){
                this.assert(this.registry.fn).toNotEqual(this.registry.fn2);
                this.completed();
            });
            
            this.specify('must pass if passed different regexp with same content')(function(){
                this.assert(this.registry.reg).toNotEqual(this.registry.reg2);
                this.completed();
            });
            
        });
        
    });
    
});