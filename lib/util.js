import _ from "lodash";
import uuidv1 from "uuid/v1";
import Hashes from "jshashes";
const util = {};

const sha1 = new Hashes.SHA1().setUTF8(true);

util.uuid = function() {
	return uuidv1().replace(/-/g, "");
}

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

util.timespan = function(datestr) {
	const dateTime = new Date(datestr).getTime();
	const curTime = new Date().getTime();
	const count = curTime - dateTime;
	const secordTime = 1000;
	const minuteTime = secordTime * 60;
	const hourTime = minuteTime * 60;
	const dayTime = hourTime * 24;
	const monthTime = dateTime * 30;
	const yearTime = monthTime * 12; 
	const times=[yearTime, monthTime, dayTime, hourTime, minuteTime, secordTime];
	const timestrs=["年", "月", "天", "小时", "分钟", "秒"];
	for (let i = 0; i < times.length; i++) {
		const index = Math.floor(count / times[i]);
		if (index > 0) {
			return index + timestrs[i] + "前";
		}
	}

	return "刚刚";
}

util.getDate = function(str) {
	const date = new Date(str);
	const year = _.padStart(date.getFullYear(), 4, "0");
	const month =  _.padStart(date.getMonth() + 1, 2, "0");
    const day = _.padStart(date.getDate(), 2, "0");
    const hour = _.padStart(date.getHours(), 2, "0");
    const minute = _.padStart(date.getMinutes(), 2, "0");
	const second = _.padStart(date.getSeconds(), 2, "0");
	
	const datetime = year + month + day + hour + minute + second;
	const datestr = year + month + day;
	const timestr = hour + minute + second;
	return {year, month, day, hour, minute, second, datetime, datestr, timestr};
}

util.getFileType = function(filename) {
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
	if (_.endsWith(filename, "/")) return "folders";
	const ext = _.toLower(filename.substring(filename.lastIndexOf(".")));
	return filetypes[ext] || "files";
}

util.lcs = function(str1, str2) {
	let c = {};
    let len1 = str1.length;  
    let len2 = str2.length;  
	
    for (let i = 0; i <= len1; i++) {  
        for( let j = 0; j <= len2; j++) {  
            if(i == 0 || j == 0) {  
                c[i + "-" + j] = 0;  
            } else if (str1[i-1] == str2[j-1]) {  
                c[i + "-" + j] = c[(i-1) + "-" + (j-1)] + 1;  
            } else {  
                c[i + "-" + j] = _.max([c[(i-1) + "-" + j], c[i + "-" + (j - 1)]]);  
            }  
        }  
    }  

    return c[len1 + "-" + len2];  
}

export default util;
