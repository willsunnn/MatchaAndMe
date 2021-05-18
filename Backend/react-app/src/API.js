function get_plant_list(handler) {
	const Http = new XMLHttpRequest();
	const url = 'http://127.0.0.1:5000/get-plants';
	Http.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

export default get_plant_list