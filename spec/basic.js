Te.run(function(){
    
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
            
            this.spec('must pass if passed the same array')(function(){
                this.expect(this.registry.arr).toBe(this.registry.arr);
                this.completed();
            });
            
            this.spec('must pass if passed the same obj')(function(){
                this.expect(this.registry.obj).toBe(this.registry.obj);
                this.completed();
            });
            
            this.spec('must pass if passed the same function')(function(){
                this.expect(this.registry.fn).toBe(this.registry.fn);
                this.completed();
            });
            
            this.spec('must pass if passed the same number')(function(){
                this.expect(this.registry.num).toBe(this.registry.num);
                this.completed();
            });
            
            this.spec('must pass if passed different number with same value')(function(){
                this.expect(this.registry.num).toBe(this.registry.num2);
                this.completed();
            });
            
            this.spec('must pass if passed the same string')(function(){
                this.expect(this.registry.str).toBe(this.registry.str);
                this.completed();
            });
            
            this.spec('must pass if passed different string with same value')(function(){
                this.expect(this.registry.str).toBe(this.registry.str2);
                this.completed();
            });
            
            this.spec('must pass if passed the same regexp')(function(){
                this.expect(this.registry.reg).toBe(this.registry.reg);
                this.completed();
            });
            
        });
        
        this.describe('toNBe Matcher')(function(){
            
            this.spec('must pass if passed different array with the same values')(function(){
                this.expect(this.registry.arr).toNotBe(this.registry.arr2);
                this.completed();
            });
            
            this.spec('must pass if passed the different Object with same attributes')(function(){
                this.expect(this.registry.obj).toNotBe(this.registry.obj2);
                this.completed();
            });
            
            this.spec('must pass if passed different Function with same source')(function(){
                this.expect(this.registry.fn).toNotBe(this.registry.fn2);
                this.completed();
            });
            
            this.spec('must pass if passed different regexp with same content')(function(){
                this.expect(this.registry.reg).toNotBe(this.registry.reg2);
                this.completed();
            });
            
        });
        
    });
    
});