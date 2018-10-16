import _ from "lodash";

class Error { 
	constructor(data, status = 200, headers = {}) {
		this.status = status;
		this.data = data;
		this.headers = headers;
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
