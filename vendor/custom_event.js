Class('CustomEvent')({
	type      : '',
	target    : null,
	_stop     : false,
	prototype : {
		init : function(type, data){
			var property;
			this.type = type;
			for(property in data){
			    if(data.hasOwnProperty(property)){
			        this[property] = data[property];
			    }
			}
		},
		stopPropagation : function(){
			this._stop = true;
		},
		preventDefault : function(){
			this._preventDefault = true;
		}
	}
});
