export default function get_plant_list(handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-plants';
	Http.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

export default function get_plant(id, handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-plant/'+id;
	Http.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

export default function get_plant_data(id, handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-data/'+id;
	Http.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}
