var profile = (function(){
	var testResourceRe = /^mijit\/tests\//,

		copyOnly = function(filename, mid){
			var list = {
				"mijit/package":1,
				"mijit/package.json":1
			};
			return (mid in list);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid);
			},

			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) && !copyOnly(filename, mid) && /\.js$/.test(filename);
			},

			miniExclude: function(filename, mid){
				return false;
			}
		}
	};
})();



