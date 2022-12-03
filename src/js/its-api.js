var itsApi = {
	apiKey: null,
	baseURI: 'https://dev.tssaltan.top/api/',
	apiVersion: 'v1',
	returnType: 'json',
	ajax: {
		xhr: function(){
			if (typeof XMLHttpRequest !== 'undefined') {
				return new XMLHttpRequest();  
			}

			var versions = [
				"MSXML2.XmlHttp.6.0",
				"MSXML2.XmlHttp.5.0",   
				"MSXML2.XmlHttp.4.0",  
				"MSXML2.XmlHttp.3.0",   
				"MSXML2.XmlHttp.2.0",  
				"Microsoft.XmlHttp"
			];

			var xhr;
			for(var i = 0; i < versions.length; i++) {  
				try {  
					xhr = new ActiveXObject(versions[i]);  
					break;  
				} catch (e) {
				}  
			}
			return xhr;
		},
		
		send: function(url, callback, method, data, sync){
			if(typeof(data) != 'string'){
				data = itsApi.ajax.formData(data);
			}
			
			var x = itsApi.ajax.xhr();
			if(method == 'GET'){
				url = url + (data.length ? '?' + data : '');
			}
			
			x.open(method, url, sync);
			x.onreadystatechange = function() {
				if (x.readyState == XMLHttpRequest.DONE) {
					callback(x);//.responseText)
				}
			};
			
			x.onerror = function(){
				throw new Error;
			};
			
			if (method == 'POST') {
				x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			}

			x.setRequestHeader('X-API-Key', itsApi.apiKey);
			x.send(data);
			return x;
		}, 
		
		formData: function(data){
			var query = [];
			for (var key in data) {
				query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			}
			return query.join('&');
		}
	}, 
	
	query: function(httpMethod, apiMethod, data, callback){
		let url = this.baseURI + this.apiVersion + '/' + apiMethod + '.' + itsApi.returnType;
		callback = callback || function(dt){ };
		data = JSON.stringify(data) || '';
		
		return itsApi.ajax.send(url, function(res){
			if(itsApi.returnType == 'json'){
				callback(JSON.parse(res.responseText), res.status);
			}
			else {
				callback(res.responseText, res.status);
			}
		}, httpMethod, data, true);
	},

	get: function(apiMethod, data, callback){
		return this.query('GET', apiMethod, data, callback);
	},

	post: function(apiMethod, data, callback){
		return this.query('POST', apiMethod, data, callback);
	},

	put: function(apiMethod, data, callback){
		return this.query('PUT', apiMethod, data, callback);
	},

	delete: function(apiMethod, data, callback){
		return this.query('DELETE', apiMethod, data, callback);
	}
}