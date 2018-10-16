
import _ from "lodash";

var mdconf = {};
var escapeChar = "@";
var escapeCharList = '@-';

function md_escape(text) {
	if (typeof(text) != "string") {
		return text;
	}

	text = text || "";

	var lines = text.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (escapeCharList.indexOf(line[0]) >=0) {
			lines[i] = escapeChar + line;
		} 
	}

	return lines.join("\n");
}

function md_unescape(text) {
	text = text || "";

	var lines = text.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line[0] == escapeChar && escapeCharList.indexOf(line[1]) >=0) {
			lines[i] = line.substring(1);
		} 
	}

	return lines.join("\n");
}

function getLines(text = "") {
	const temp_lines = text.trim().split("\n");
	const lines = [];
	let line = "";
	for (let i = 0; i < temp_lines.length; i++) {
		if (!_.startsWith(temp_lines[i], "-")) {
			line += "\n" + temp_lines[i];
			continue;
		}

		if (line) lines.push(line);

		line = temp_lines[i];
	}

	if (line) {
		lines.push(line);
	}

	return lines;
}

// md 转json对象
mdconf.mdToJson = function(text = "") {
	text = md_unescape(text);

	const lines =  getLines(text);
	const obj = {};

	if (lines.length == 0) return "";
	if (lines.length == 1 && lines[0] != "-") return lines[0];

	//console.log(lines);
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].substring(1);
		if (line.indexOf("=") < 0) continue;
		const key = line.substring(0, line.indexOf("=")).trim();
		const value = line.substring(line.indexOf("=") + 1).trim();
		//console.log(key,value, lines[i], line);
		_.set(obj, key, value);
	}

	return obj;
}

// json 转 md
mdconf.jsonToMd = function(obj) {
	let text = "";
	const keys = (o) => {
		const ks = [];
		if (!_.isObject(o)) return ks;

		_.each(o, (val, key) => {
			if (_.isObject(val)) {
				_.each(keys(val), subKey => {
					ks.push(key + "." + subKey);
				});
			} else {
				ks.push(key);
			}
		});

		return ks;
	}
	
	const ks = keys(obj);
	_.each(ks, val => text += `\n-${val}=` + md_escape(_.get(obj, val)));
	
	text = text.trim();
	return text;
}

export default mdconf;
