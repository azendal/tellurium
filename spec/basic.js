Te.suite('Language default behaviour testing')(function(){
    
    this.describe('specs')(function(){
        this.spec('come up as pendant')();

        this.spec('do nothing but not break')(function(){
            this.completed();
        }); 
    });
    
    this.describe('basic matchers')(function(){
        
        this.beforeEach(function(spec){
            
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
            
            this.spec('Array1 is identical to Array1')(function(){
                this.expect(this.registry.arr).toBe(this.registry.arr);
                this.completed();
            });
            
            this.spec('Object1 is identical to Object1')(function(){
                this.expect(this.registry.obj).toBe(this.registry.obj);
                this.completed();
            });
            
            this.spec('Function1 is identical to Object1')(function(){
                this.expect(this.registry.fn).toBe(this.registry.fn);
                this.completed();
            });
            
            this.spec('Number1 is identical to Number1')(function(){
                this.expect(this.registry.num).toBe(this.registry.num);
                this.completed();
            });
            
            this.spec('Number1 is identical to Number2 if both have the same value')(function(){
                this.expect(this.registry.num).toBe(this.registry.num2);
                this.completed();
            });
            
            this.spec('String1 is identical to String1')(function(){
                this.expect(this.registry.str).toBe(this.registry.str);
                this.completed();
            });
            
            this.spec('String1 is identical to String2 if both have the same value')(function(){
                this.expect(this.registry.str).toBe(this.registry.str2);
                this.completed();
            });
            
            this.spec('RegExp1 is identical to RegExp1')(function(){
                this.expect(this.registry.reg).toBe(this.registry.reg);
                this.completed();
            });
            
            this.spec('Boolean is identical to Boolean if both have the same value')(function(){
                this.expect(true).toBe(true);
                this.expect(false).toBe(false);
                this.completed();
            });
            
            this.spec('undefined is identical to undefined no matter how you get it')(function(){
                this.expect(window.undefined1).toBe(window.undefined2);
                this.completed();
            });
            
        });
        
        this.describe('toNotBe Matcher')(function(){
            
            this.spec('Array1 is not identical to Object2')(function(){
                this.expect(this.registry.arr).toNotBe(this.registry.arr2);
                this.completed();
            });
            
            this.spec('Object1 is not identical to Object2')(function(){
                this.expect(this.registry.obj).toNotBe(this.registry.obj2);
                this.completed();
            });
            
            this.spec('Function1 is not identical to Function2')(function(){
                this.expect(this.registry.fn).toNotBe(this.registry.fn2);
                this.completed();
            });
            
            this.spec('RegExp1 is not identical to RegExp2 even if have the same source')(function(){
                this.expect(this.registry.reg).toNotBe(this.registry.reg2);
                this.completed();
            });
            
            this.spec('NaN is not identical to NaN')(function(){
                this.expect(Number('aa')).toNotBe(Number('aa'));
                this.completed();
            });
            
        });
        
        this.describe('toEqual Matcher')(function(){
            
            this.spec('Array')(function(){
                this.expect(this.registry.arr).toEqual(this.registry.arr);
                this.completed();
            });
            
            
            this.spec('an object must be equal to the same object')(function(){
                this.expect(this.registry.obj).toEqual(this.registry.obj);
                this.completed();
            });
            
            this.spec('must pass if passed the same function')(function(){
                this.expect(this.registry.fn).toEqual(this.registry.fn);
                this.completed();
            });
            
            this.spec('must pass if passed the same number')(function(){
                this.expect(this.registry.num).toEqual(this.registry.num);
                this.completed();
            });
            
            this.spec('must pass if passed different number with same value')(function(){
                this.expect(this.registry.num).toEqual(this.registry.num2);
                this.completed();
            });
            
            this.spec('must pass if passed the same string')(function(){
                this.expect(this.registry.str).toEqual(this.registry.str);
                this.completed();
            });
            
            this.spec('must pass if passed different string with same value')(function(){
                this.expect(this.registry.str).toEqual(this.registry.str2);
                this.completed();
            });
            
            this.spec('must pass if passed the same regexp')(function(){
                this.expect(this.registry.reg).toEqual(this.registry.reg);
                this.completed();
            });
            
        });
        
        
        this.describe('toNotEqual Matcher')(function(){
            
            this.spec('must pass if passed different array with the same values')(function(){
                this.expect(this.registry.arr).toNotEqual(this.registry.arr2);
                this.completed();
            });
            
            this.spec('must pass if passed the different Object with same attributes')(function(){
                this.expect(this.registry.obj).toNotEqual(this.registry.obj2);
                this.completed();
            });
            
            this.spec('must pass if passed different Function with same source')(function(){
                this.expect(this.registry.fn).toNotEqual(this.registry.fn2);
                this.completed();
            });
            
            this.spec('must pass if passed different regexp with same content')(function(){
                this.expect(this.registry.reg).toNotEqual(this.registry.reg2);
                this.completed();
            });
            
        });
        
    });
    
});