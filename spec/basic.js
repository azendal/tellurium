Te.run(function(){
    
    // this.beforeEach(function(spec){
    //     spec.registry.x = {
    //         x : function(){
    //             return true;
    //         }
    //     };
    // });
    
    this.spec('come up as pendant')();
    
    this.spec('do nothing but not break')(function(){
        this.completed();
    });
    
    this.spec('toBe assert must behave as expected')(function(){
        var x = [];
        this.expect(x).toBe(x);
        this.completed();
    });
    
    this.spec('toNotBe assert must behave as expected')(function(){
        var x = [];
        this.expect(x).toNotBe([]);
        this.expect([]).toNotBe([]);
        this.expect({}).toNotBe({});
        this.completed();
    });
    
    this.spec('toEqual assert must behave as expected')(function(){
        this.expect(0.5).toEqual(0.5);
        this.expect([1][0]).toEqual([1][0]);
        this.expect(({attr : 5}).attr).toEqual(({attr : 5}).attr);
        this.completed();
    });
    
    this.spec('toNotEqual assert must behave as expected')(function(){
        this.expect(0.5).toNotEqual(0.6);
        this.expect([]).toNotEqual([]);
        this.expect({}).toNotEqual({});
        this.completed();
    });
    
});