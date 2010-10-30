Te.run(function(basicTests){
    
    // this.beforeEach(function(spec){
    //     spec.registry.x = {
    //         x : function(){
    //             return true;
    //         }
    //     };
    // });
    
    this.spec('come up as pendant')();
    
    this.spec('do nothing but not break')(function(){
        this.end();
    });
    
    this.spec('toBe assert must behave as expected')(function(){
        var x = [];
        this.expect(x).toBe(x);
        this.end();
    });
    
    this.spec('toNotBe assert must behave as expected')(function(){
        var x = [];
        this.expect(x).toNotBe([]);
        this.expect([]).toNotBe([]);
        this.expect({}).toNotBe({});
        this.end();
    });
    
    this.spec('toEqual assert must behave as expected')(function(){
        this.expect(0.5).toEqual(0.5);
        this.expect([1].toString()).toEqual([1].toString());
        this.expect({}).toEqual({});
        this.end();
    });
    
    this.spec('toNotEqual assert must behave as expected')(function(){
        this.expect(0.5).toNotEqual(0.6);
        this.expect([]).toNotEqual([1]);
        this.expect({}).toNotEqual({ attr : 1});
        this.end();
    });
    
});