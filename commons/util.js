import jwt from "jwt-simple";
import _ from "lodash";
import Hashes from "jshashes";
import config from "@/config.js";

const sha1 = new Hashes.SHA1().setUTF8(true);

export const util = {};

const getStringByteLength = function(str) {
	var totalLength = 0;     
	var charCode;  
	for (var i = 0; i < str.length; i++) {  
		charCode = str.charCodeAt(i);  
		if (charCode < 0x007f)  {     
			totalLength++;     
		} else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {     
			totalLength += 2;     
		} else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {     
			totalLength += 3;   
		} else{  
			totalLength += 4;   
		}          
	}  
	return totalLength;   
}
// 与gitlab sha一致
util.hash = function(content) {
	var header = "blob " + getStringByteLength(content) + "\0";
	var text = header + content;
	return sha1.hex(text);
}

const filetypes = {
	"/": "folders",

	".md": "pages",

	".jpg": "images",
	".jpeg": "images",
	".png": "images",
	".svg": "images",

	".mp4": "videos",
	".webm": "videos",

	".mp3": "audios",
	".ogg": "audios",
	".wav": "audios",

	".json": "datas",
	".yml": "datas",

	//unknow: "files",
}

util.jwt_encode = function(payload, key, expire = 3600 * 24 * 100) {
	payload = payload || {};
	key = key || config.secret;
	payload.exp = Date.now() / 1000 + expire;

	return jwt.encode(payload, key);
}

util.jwt_decode = function(token, key, noVerify) {
	return jwt.decode(token, key, noVerify);
}

util.getTypeByKey = function(key) {
	for (let ext in filetypes) {
		if (_.endsWith(key, ext)) return filetypes[ext];
	}

	return "files";
}

util.isPage = function(key) {
	return this.getTypeByKey(key) == "pages";
}

util.getUsernameByKey = function(key) {
	return key.substring(0, key.indexOf("/"));
}
// 获取目录
util.getFolderByKey = function(key) {
	return key.substring(0, key.lastIndexOf("/", key.length-2) + 1);
}

util.getKeyByPath = function(path, filetype) {
	const paths = path.split("/");

	filetype = filetype || this.getTypeByKey(path);

	paths.splice(1, 0, filetype);

	return paths.join("/");
}

util.getPathByKey = function(key) {
	const paths = key.split("/");
	//if (paths.length < 3) return key;
	paths.splice(1, 1);

	return paths.join('/');
}

util.parseKey = function(key) {
	const obj = {key};
	obj.path = this.getPathByKey(key);
	obj.type = this.getTypeByKey(key);
	obj.url = key.substring(0, key.lastIndexOf("."));

	const paths = obj.path.split("/");
	obj.username = paths[0];
	obj.sitename = paths[1];

	return obj;
}

util.getDate = function() {
	const date = new Date();
	const year = _.padStart(date.getFullYear(), 4, "0");
	const month =  _.padStart(date.getMonth() + 1, 2, "0");
    const day = _.padStart(date.getDate(), 2, "0");
    const hour = _.padStart(date.getHours(), 2, "0");
    const minute = _.padStart(date.getMinutes(), 2, "0");
	const second = _.padStart(date.getSeconds(), 2, "0");
	
	const datetime = year + month + day + hour + minute + second;
	return {year, month, day, hour, minute, second, datetime};
}

export default util;
