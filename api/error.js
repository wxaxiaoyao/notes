import _ from "lodash";

class Error { 
	constructor(data, status = 200, headers = {}) {
		this.status = status;
		this.headers = headers;
		if (status >= 200 && status < 300) 	this.data = data;
		else this.error = data;
	}

	isOk() {
		return 200 <= this.status && this.status < 300;
	}

	isErr() {
		return !this.isOk();
	}

	getData() {
		return this.data;
	}
}

export default Error;
