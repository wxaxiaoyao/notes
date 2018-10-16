import _ from "lodash";
import uuidv1 from "uuid/v1";

function isEmptyObject(obj) {
	for (var key in obj) {
		return false;
	}

	return true;
}

export const Tag = function(tagName) {
	this.tagName = tagName || "div";
	this.__flag__ = true; // 用来识别是tag
	this.__key__ = undefined;
	this.children = [];
	this.attrs = {};
	this.styles = {};
	this.classes = {};
	this.varsPrefix = "tag.vars";
	this.vars = {}; // 变量集 未自定义则不配置更改
	this.$vars = {};       // var 描述
	this.tagId = uuidv1();
}

Tag.prototype.setStyle = function(key, value) {

}

Tag.prototype.getAttrsHtml = function(tagName){
	var self = this;
	var str = '';
	var attrs = _.cloneDeep(self.attrs);
	var vars = self.vars;
	var $vars = self.$vars;

	if (tagName && tagName.indexOf("el-") == 0) {

	} else {
		str += ' :tag="tag"';
	}
	// 具体指定参数到属性
	for (var key in vars) {
		var value = vars[key];
		var $data = $vars[key];
		if (!$data || !$data.attrName) {
			if (!attrs[":" + key])
				str += " :" + key + '="tag.vars.' + key + '"';
			continue;
		}
		var attrName = $data.attrName;
		var attrNamePrefix = $data.attrNamePrefix || "";
		var defaultValue = attrs[attrName];
		attrs[attrName] = undefined;

		defaultValue = defaultValue ? (" || '" + defaultValue + "'") : "";
		str += ' ' + attrNamePrefix + attrName + '="tag.vars.' + key + ($data.key || '') + defaultValue + '"';
	}

	//console.log(str);

	for (var key in attrs) {
		var value = attrs[key];
		if (!value) continue;

		const isNumber = /^\d*$/.test(_.toString(value));
		
		if ((key.indexOf(":") == 0 || key.indexOf("v-") == 0) && !isNumber) {
			value = "tag.vars." + value;
		}

		if (isNumber) key = ":" + key;

		str += " " + key + '="' + value + '"';
	}

	return str;
}

Tag.prototype.getContentHtml = function() {
	var self = this;

	var content = "";

	// 获取字标签值
	for (var i = 0; i < self.children.length; i++) {
		var childTag = self.children[i];
		content += childTag.html();
	}

	// 获取内容变量值
	//for (var i = 0; i < self.vars.length; i++){
		//var v = self.vars[i];
		//if (v.$data.type == "text") {
			//content += v.text;
		//}
	//}

	return content;
}

Tag.prototype.html = function(opt){
	var self = this;
	var htmlStr = "";

	opt = opt || {};
	// br img  input
	if (self.tagName == "br" || self.tagName == "img" || self.tagName == "input") {
		htmlStr = "<" + self.tagName + self.getAttrsHtml() + "/>";
	} else {
		htmlStr = "<" + self.tagName + self.getAttrsHtml() + ">" + (opt.innerHtml || self.getContentHtml()) + "</" + self.tagName + ">";
	}

	return htmlStr;
}

Tag.prototype.each = function(callback) {
	callback && callback(this);
	
	for (var i = 0; i < this.children.length; i++){
		this.children[i].each(callback);
	}	
}

Tag.prototype.findById = function(tagId) {
	var self = this;

	if (self.tagId == tagId) {
		return self;
	}

	for (var i = 0; i < self.children.length; i++) {
		var subTag = self.children[i];
		var result = subTag.findById(tagId);
		if (result){
			return result;
		}
	}

	return undefined;
}

Tag.prototype.getPaths = function() {
	const self = this;
	
	const _getPaths = function(obj, prefix = ""){
		if (!_.isObject(obj) || _.isEmpty(obj)) {
			return [];
		}
		if (obj instanceof Tag) {
			obj = _.pick(obj, ["styles", "classes", "attrs", "vars",]);
			//obj = _.omitBy(obj, _.isFunction);
		}
		const isArray = _.isArray(obj);
		const keyWrap = (key) => prefix + (isArray ? ('[' + key + ']') : key);
		let keys = _.map(obj, (val, key) => keyWrap(key));

		_.each(obj, (val, key) =>  keys = keys.concat(_getPaths(val, keyWrap(key) + ".")));
		return keys;
	}

	return _getPaths(self);
}
	

Tag.prototype.findByPath = function(path, srcTag) {
	if (!path) {
		return undefined;
	}

	path = path.split("-");

	var	rootTag = srcTag || this;
	while(rootTag.parentTag) {
		rootTag = rootTag.parentTag;
	}

	var dstTag = rootTag;
	path.forEach(function(v) {
		dstTag = dstTag.children[_.toNumber(v)];	
	});

	return dstTag;
}

Tag.prototype.getTagPath = function() {
	var path = [];
	var curTag = this;
	var parentTag = curTag.parentTag;

	while(parentTag) {
		var index = parentTag.children.findIndex(t => t.tagId == curTag.tagId);
		path.push(index);
		curTag = parentTag;
		parentTag = curTag.parentTag;
	}

	_.reverse(path);

	path = path.join("-");

	return path;
}

Tag.prototype.setChildrenTag = function(index, tag) {
	var self = this;
	if (!tag || typeof(tag) != "object") {
		return;
	}

	//if (index == self.children.length) {
		//self.children.push(tag);
	//} else {
		//self.children.splice(index, 1, tag);
	//}
	self.children.splice(index, 1, tag);
	tag.parentTag = self;

	return
}

Tag.prototype.addTag = function(t) {
	var self = this;

	if (!t || typeof(t) != "object") {
		return;
	}

	for (var i = 0; i < self.children.length; i++) {
		if (self.children[i].tagId == t.tagId) {
			return;
		}
	}

	self.children.push(t);
	t.parentTag = self;

	return t;
}

Tag.prototype.deleteTag = function(tagId) {
	tagId = tagId || this.tagId;	
	var parentTag = this.parentTag;

	if (!parentTag && tagId == this.tagId){
		return;
	}

	if (tagId == this.tagId){
		parentTag.deleteTag(tagId);
	} else {
		for (var i = 0; i < this.children.length; i++){
			var childTag = this.children[i];
			if (childTag.tagId == tagId) {
				this.children.splice(i,1);
			} else {
				this.children[i].deleteTag(tagId);
			}
		}
	}
}

Tag.prototype.getParams = function(params) {
	var self = this;

	params = params || {};
	if (!isEmptyObject(self.vars)) {
		if (self.varKey) {
			params[self.varKey] = self.vars;
		} else {
			_.merge(params, self.vars);
		}
	}

	for(var i = 0; i < self.children.length; i++) {
		var _tag = self.children[i];
		_tag.getParams(params);
	}

	return params;
}

Tag.prototype.clone = function() {
	var _tag = _.cloneDeep(this);

	_tag.tagId = "tagId_" + (new Date()).getTime() + "_" + tagId++;
	_tag.varKey = _tag.tagId;

	return _tag;
}

Tag.prototype.getNextTag = function() {
	var self = this;
	var parentTag = self.parentTag;
	if (!parentTag) {
		return undefined;
	}

	var index = parentTag.children.findIndex(t => t.tagId === self.tagId);

	if (index < 0 || (index + 1) >= parentTag.children.length) {
		return undefined;
	}

	return parentTag.children[index + 1];
}

Tag.prototype.setTagName = function(tagName){
	this.tagName = tagName;
}

Tag.prototype.setVars = function(vars) {
	this.vars = vars;
}

Tag.prototype.getVars = function() {
	return this.vars;
}

Tag.prototype.getTagByKey = function(key) {
	if (this.key == key) {
		return this;
	}

	for (var i = 0; i < this.children.length; i++) {
		let t = this.children[i].getTagByKey(key);
		if (t) {
			return t;
		}
	}

	return ;
}

Tag.prototype.setVarsByKey = function(data) {
	data = data || {};
	
	const _setVarsByKey = function(tag) {
		if (tag.key && data[tag.key]) {
			tag.vars = _.merge(tag.vars || {}, data[tag.key]);
		}

		_.each(tag.children, _setVarsByKey);
	}

	_setVarsByKey(this);

	this.vars = _.merge(this.vars, data);
}

Tag.prototype.getVarsByKey = function(keys) {
	var data = {};
	const _getVarsBykey = function(tag) {
		if (tag.key && (!keys || keys[tag.key])) {
			data[tag.key] = _.cloneDeep(tag.vars);
		}

		_.each(tag.children, _getVarsBykey);
	}	

	_getVarsBykey(this);
	return data;
}

Tag.prototype.clean = function() {
	const _clean = function(tag) {
		delete tag.parentTag;
		delete tag.$vars;
		for (var i = 0; i < tag.children.length; i++) {
			_clean(tag.children[i]);
		}
	}

	_clean(this);

	return this;
}

Tag.prototype.isContainerTag = function() {
	const containerTag = {
		"div": true,
	}

	if (this.isContainer || containerTag[this.tagName]) {
		return true;
	}

	return false;
}

Tag.prototype.getContainerTag = function() {
	var t = this;

	while(t && !t.isContainerTag()) {
		t = t.parentTag;
	}

	return t;
}

Tag.prototype.json = function() {
	const jsontag = function(tag) {
		const _tag = _.omitBy(_.clone(tag), _.isFunction);
		delete _tag.parentTag;
		delete _tag.tagId;
		delete _tag.varsPrefix;

		_tag.children = [];
		_.each(tag.children,t =>  _tag.children.push(jsontag(t)));

		return _tag;
	}

	return jsontag(this);
}

export const tagFactory = function(tagName) {
	return new Tag(tagName);
}

export default Tag;
