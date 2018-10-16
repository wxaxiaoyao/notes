import _ from "lodash";
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

import {tags} from "@/lib/tags";
import component from '@/components/component.js';

const EDITOR_MODE_EDITOR = "editor";

let compiler = null;
if (process.server) {
	compiler = require('vue-template-compiler');
}

export default {
	name: "tag",
	inheritAttrs: false,
	mixins:[component],
	data: function() {
		return {
			styles: {},
			classes:{
				tagActived:false,
				tagHover:false,
			},
		};
	},
	props:{
		tag: {
			type:Object,
			default: function() {
				return tags.getTag("div");
			}
		},
		mode: {
			type: String,
			default: "normal",
		},
		tagName: {
			type:String,
			default:"div",
		},
	},

	computed: {
		tagId() {
			return this.getData("__TAG_ID__");
		},
		isEditor() {
			return this.mode == EDITOR_MODE_EDITOR;
		},
		tagStyle() {
			return this.isEditor ? {...this.tag.styles, ...this.styles} : this.tag.styles;
		},
		tagClass() {
			return this.isEditor ? {...this.tag.classes, ...this.classes} : this.tag.classes;
		},
		isActive() {
			if (this.mode != EDITOR_MODE_EDITOR) {
				return false;
			}
			if (this.tag.tagId == this.tagId) {
				return true;
			}

			return false;
		},
		attrStr(){
			return this.tag.getAttrsHtml(this.tagName);
		},
		compileTemplate() {
			var tagName = this.tagName;
			var attrStr = this.attrStr;
			var editorModeAttrStr = ' @click.stop.prevent="click" @click.native.stop.prevent="click" @mouseover.stop.prevent="mouseover" @mouseout.stop.prevent="mouseout"';
			if (this.mode != EDITOR_MODE_EDITOR) {
				editorModeAttrStr = "";
			}
			var attrStr = editorModeAttrStr + attrStr + ' :style="tagStyle" :class="tagClass" v-bind="$attrs" v-on="$listeners"';
			var template = '<' + tagName + attrStr + '>{{tag.text ||""}}<tag v-for="(x,index) in tag.children" :key="index" :tag="x" :tagName="x.tagName" :mode="mode"></tag></' + tagName + '>';
			if (tagName == "img" || tagName == "br" || tagName == "input") {
				template = '<' + tagName + attrStr + '/>';
			}	

			if (vue.compile) {
				return vue.compile(template);
			}
			return compiler.compileToFunctions(template);
		},
	},

	watch:{
		tagId: function(tagId) {
		},
		isActive: function(val, oldVal) {
			this.classes.tagActived = val;
		},
		//hoverTagId: function(tagId, oldTagId) {
			//if (this.tag.tagId == tagId) {
				//this.classes.tagHover = true;
			//} else {
				//this.classes.tagHover = false;
			//}
			//this.oldHoverTagId = oldTagId;
		//},
	},

	methods: {
		setTagId(tagId) {
			this.setData("__TAG_ID__", tagId);
		},
		click() {
			this.setTagId(this.tag.tagId);
		},
		mouseover() {
			//this.setHoverTagId(this.tag.tagId);
		},
		mouseout() {
			//this.setHoverTagId(undefined);
		},
	},

	mounted() {
		this.classes.tagActived = this.mode == EDITOR_MODE_EDITOR && this.tag.tagId == this.tagId;
	},

	render(arg1, arg2, arg3, arg4) {
		var res = this.compileTemplate;
		this.compileRender = res.render;

		return this.compileRender(arg1,arg2,arg3,arg4);
	}, 
	staticRenderFns(arg1, arg2, arg3, arg4) {
		var res = this.compileTemplate;
		this.compileStaticRenderFns = res.staticRenderFns;

		return this.compileStaticRenderFns(arg1,arg2,arg3,arg4);
	},
	

	//created(){
		//var self = this;
		//self.tag = self.tag || tags.getTag("div");
		//var tag = this.tag;
		//var subtag = undefined;
		//var vnodes = this.$slots.default || [];

		//tag.setTagName(this.tagName);
		////console.log(vnodes, tag.tagId);
	
		//var _vnodeToTag = function(tag, vnodes) {
			//if (!vnodes) {
				//return;
			//}
			//for (var i = 0; i < vnodes.length; i++) {
				//var vnode = vnodes[i];
				//var options = vnode.componentOptions;

				//if (!options) {
					//tag.text = vnode.text;
					////var subtag = tags.spanTag(vnode.text);
					////subtag.isVnode = true;
					////tag.addTag(subtag);
					//continue;
				//}

				//var tagName = options.tag;
				//var subtag = tags.getTag(tagName);
				//_.merge(subtag.attrs, options.propsData);					
				//if (vnode.data && vnode.data.attrs) {
					//_.merge(subtag.attrs, vnode.data.attrs);					
				//}
				//subtag.isVnode = true;
				//tag.addTag(subtag);

				//_vnodeToTag(subtag, options.children);
			//}
		//}

		//if (!tag.isVnode) {
			//_vnodeToTag(tag, vnodes);
		//}
	//},
	components: {
		//...mods,
	},
}

