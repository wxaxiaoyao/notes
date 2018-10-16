
let storage = null;

if (process.client) {
	storage = require("")
}

function getUserInfo() {
	if (process.server) {

	}

}

const user = {
};


app.setUser = function(user) {
	this.user = user;
	storage.localStorageSetItem("userinfo", user);
	
}

app.getUser = function() {
	this.user = this.user || storage.localStorageGetItem("userinfo") || {};

	if (this.isAuthenticated()){
		return this.user;
	}

	return {};
}

app.isAuthenticated = function() {
	if (!this.user || !this.user.token) return false;
	const payload = jwt.decode(this.user.token, null, true);
	//console.log(payload);

	if (payload.nbf && Date.now() < payload.nbf*1000) {
		return false;
	}
	if (payload.exp && Date.now() > payload.exp*1000) {
		return false;
	}

	return true;
}

export default user;
