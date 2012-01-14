var build;
build = function(oObj) {
  build.obj = oObj;
  return build;
}

build.property = function(spec) {
	var 
      self = this,
			value = spec.value || undefined,
			name = spec.name,
      oWritable = spec.hasOwnProperty("writable") ? spec.writable : false,
      oEnumerable = spec.enumerable,
      oConfigurable = spec.configurable;

	Object.defineProperty(self.obj, name, {
		get : function(){ return value; },  
		set : function(newValue){
      //Check for writability
      oWritable && (value = newValue);
      //even attempting to set a non writable object returns the attmepted value.  weird.
      return newValue;
     },  
		enumerable : oEnumerable,  
		configurable : oConfigurable
	});  	
	return true;
};

module.exports = build;
