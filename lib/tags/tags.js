import _ from 'lodash';

import {tagFactory} from "./tag.js";
import factory from "./factory.js";

var tags = {
	tagFactory:{},
};

tags.registerTagFactory = function(key, factory) {
	this.tagFactory[_.camelCase(key)] = factory;
}

_.each(factory, (val, key) => tags.registerTagFactory(key, val));

tags.registerTagFactory("tag", function(tag) {
	return tags.getTagByTag(tag);
});

tags.getTagByTag = function(tag) {
	if (!tag) {
		return ;
	}
	const self = this;
	const _cloneTag = function(tag) {
		let _tag = self.getTag(tag.tagName);
		let tmpTag = _.omit(tag, ["tagId", "children"]);
		tmpTag = _.omitBy(tmpTag, _.isFunction);
		_.merge(_tag, tmpTag);
		_tag.children = [];
		for (let i = 0; i < tag.children.length; i++) {
			var _subtag = _cloneTag(tag.children[i]);
			_tag.addTag(_subtag);
		}

		return _tag;
	}
	
	return _cloneTag(tag);
}

tags.getTagByVNode = function(vnode) {
	const _vnodeToTag = function(vnode) {
		if (!vnode) return;
		if (vnode.tag == undefined) return vnode.text;

		let tag = null;
		if (vnode.componentOptions) {  // vue component
			const options = vnode.componentOptions;
			tag = tags.getTag(options.tag);
			_.merge(tag.attrs, options.propsData);					
		} else { // html 
			tag = tags.getTag(vnode.tag);	
		}
		const data = vnode.data || {};
		_.merge(tag.attrs, data.attrs);					
		_.merge(tag.styles, data.staticStyle);					
		let classes = data.staticClass || "";
		classes.split(" ").forEach(val => {
			val = val.trim();
			if (val) tag.classes[val] = true;
		})
		tag.key = data.key;

		if (!vnode.children) return tag;

		vnode.children.forEach(vn => {
			let subtag = _vnodeToTag(vn);
			if (subtag == undefined) return;
	
			if (typeof(subtag) == "string") tag.text = subtag;

			tag.addTag(subtag);
		})

		return tag;
	}
	
	return _vnodeToTag(vnode);
}

tags.getTag = function(key, data) {
	key = key || "div";
	const factory = this.tagFactory[_.camelCase(key)];
	if (factory) return factory(data);
	
	return tagFactory(_.kebabCase(key));
}


export default tags;
