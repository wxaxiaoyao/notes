import _ from "lodash";

export const Err = function(code, message, data) {
	this.code = code || 0;
	this.message = message || "OK";
	this.data = data; // 请求数据
}

Err.prototype.setMessage = function(message = "OK"){
	this.message = message;
	return this;
}

Err.prototype.setCode = function(code = 0){
	this.code = code; 
	return this;
}

Err.prototype.setData = function(data){
	this.data = data;
	return this;
}

Err.prototype.isErr = function() {
	return this.code != 0;
}

Err.prototype.isOk = function() {
	return this.code == 0;
}

Err.prototype.getData = function() {
	return this.data;
}

Err.prototype.getMessage = function() {
	return this.message;
}

Err.prototype.getCode = function() {
	return this.code;
}

Err.prototype.clone = function(err) {
	return _.cloneDeep(err || this);
}
export const ERR = (data, message) => new Err(-1, message || "内部错误", data);
export const ERR_OK = (data, message) => new Err(0, message || "OK", data);
export const ERR_PARAMS = (data, message) => new Err(1, message || "参数错误", data);
export const ERR_UNATUH = (data, message) => new Err(2, message || "未认证", data);
export const ERR_NOT_FOUND = (data, message) => new Err(3, message || "未找到记录", data);
export const ERR_NO_PERMISSION = (data, message) => new Err(4, message || "没有权限", data);
export const ERR_USER_EXCEPTION = (data, message) => new Err(5, message || "账号被封", data)

export default {
	ERR,
	ERR_OK,
	ERR_PARAMS,
	ERR_UNATUH,
	ERR_NOT_FOUND,
	ERR_NO_PERMISSION,
};



