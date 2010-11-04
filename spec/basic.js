Tellurium.suite('Tellurium')(function(){
    
    this.describe('not taking any action')(function () {
        
    });
    
    this.describe('specs')(function(){
        this.specify('come up as pending')();
        
        this.specify('a failing test')(function(){
            this.assert(1).toBe(2);
            this.completed();
        });
        
        this.specify('an async test')(function(){
            var spec = this;
            setTimeout(function(){
                spec.assert(1).toBe(1);
                spec.completed();
            }, 1000);
        });
        
        this.specify('another async test')(function(){
            var spec = this;
            setTimeout(function(){
                spec.assert(1).toBe(1);
                spec.completed();
            }, 1000);
        });
        
        this.specify('usage of not')(function(){
            this.assert(1).not().toBe(2);
            this.completed();
        });
        
        this.specify('spy on an object syntax')(function () {
            var object = {
                spied : function(){
                    return 'spied';
                }
            };
            
            var spy    = this.spy().on(object).method('spied');
            var result = object.spied();
            
            this.assert(spy).toBeCalled();
            this.assert(result).toEqual('spied');
            this.completed();
        });
        
        this.specify('spec assertions must be equal to assertion run')(function(){
            this.assert(this.assertions.length).toBe(0);
            this.assert(this.assertions.length).toBe(1);
            this.completed();
        });
        
        this.specify('stub a method on an object')(function(){
            var x = {
                stubed : function(){
                    return 'original';
                }
            };
            
            this.stub().method('stubed').on(x).using(function(){
                return 'stubed'
            });
            
            var result = x.stubed();
            
            this.assert(result).toBe('stubed');
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
        
        this.describe('beTruthy matcher')(function(){
            this.specify('must work')(function(){
                this.assert(1).toBeTruthy();
                this.completed();
            });
        });
        
        this.describe('be Matcher')(function(){
            
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
        
    });
    
});