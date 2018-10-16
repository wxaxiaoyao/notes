<template>
	<div style="height:100%; width:100%; display:flex; flex-direction:column;">
		<div style="border:1px solid gray">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item v-for="(x, index) in navTagList" :key="index" @click.native="clickSelectTag(x)"><span style="cursor:pointer">{{x.name || x.tagName}}</span></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div style="display:flex; height:100%;">
		   	<el-tabs type="border-card" style="overflow-y:auto">
				<el-tab-pane label="样式">
				   	<div>
						<el-autocomplete class="inline-input" v-model="styleKey" :fetch-suggestions="queryStyleKeySearch" placeholder="请输入样式名">
						</el-autocomplete>
						<el-autocomplete class="inline-input" v-model="styleValue" :fetch-suggestions="queryStyleValueSearch" placeholder="请输入样式值" @keyup.native.enter="clickAddStyle">
						</el-autocomplete>
						<el-button @click="clickAddStyle">添加</el-button>
					</div>
					<el-tag 
						closable
						class="style-item-container"
					   	v-for="(value, key) in tag.styles"
						@close="clickDeleteStyleBtn(key)"
					   	:key="key">
						<span>{{key + ":" + value}}</span>
					</el-tag>
				</el-tab-pane>
				<el-tab-pane label="属性">
					<div style="display:flex">
						<el-input placeholder="标签别名" v-model="tag.aliasname">
							<template slot="prepend">标签别名</template>
						</el-input>
						<el-input placeholder="字母组合" v-model="tag.key">
							<template slot="prepend">标签KEY</template>
						</el-input>
					</div>
					<div>
						<el-autocomplete class="inline-input" v-model="attrKey" :fetch-suggestions="queryAttrKeySearch" placeholder="请输入属性名">
						</el-autocomplete>
						<el-autocomplete class="inline-input" v-model="attrValue" :fetch-suggestions="queryAttrValueSearch" placeholder="请输入属性值" @keyup.native.enter="clickAddAttr">
						</el-autocomplete>
						<el-button @click="clickAddAttr">添加</el-button>
					</div>
					<el-tag 
						closable
						class="style-item-container"
					   	v-for="(value, key) in tag.attrs"
						@close="clickDeleteAttrBtn(key)"
					   	:key="key">
						<span>{{key + ":" + value}}</span>
					</el-tag>
				</el-tab-pane>
				<el-tab-pane label="类名">
					<div>
						<el-autocomplete class="inline-input" v-model="className" :fetch-suggestions="queryClassNameSearch" placeholder="请输入类名" @keyup.native.enter="clickAddClass">
						</el-autocomplete>
						<el-button @click="clickAddClass">添加</el-button>
					</div>
					<el-tag 
						closable
						 class="style-item-container"
  						v-for="(value, key) in tag.classes"
						@close="clickDeleteClassBtn(key)"
					   	:key="key">
						<span>{{key}}</span>
					</el-tag>
				</el-tab-pane>
				<el-tab-pane label="数据">
					<objectEditor :__data_type__="tag.$vars" :__data__="tag.vars"></objectEditor>
				</el-tab-pane>
				<el-tab-pane label="导出">
					<el-form ref="form" :model="module" label-width="80px">
						<el-form-item label="名称">
							<el-input v-model="module.modulename" placeholder="名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitModule">提交</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
			//<div style="display:flex; flex-direction:column; width:40%">
				//<el-autocomplete class="inline-input" @select="tagKeyBlur" @blur="tagKeyBlur" v-model="tagKey" :fetch-suggestions="queryKeySearch" placeholder="请输入KEY">
					//<template slot="prepend">KEY</template>
				//</el-autocomplete>
				//<div style="overflow-y:auto; flex:1">
					//<codemirror v-if="isClient" ref="cm" :value="tagValue" :options="codemirrorOptions" style="height:100%"></codemirror>
				//</div>
				//<el-button @click="clickUpdateTagValueBtn">更新</el-button>
			//</div>
import {
	Breadcrumb,
	BreadcrumbItem,
	Autocomplete,
	Button,
	Input,
	Tabs,
	TabPane,
	Message,
	Form,
	FormItem,
	Radio,
	RadioGroup,
	Tag,
} from "element-ui";
import vue from "vue";
import _ from "lodash";
import {mapActions, mapGetters} from "vuex";
import mdconf from "@/lib/markdown/mdconf.js";
import queryStyleKey from "./styleKey.js";
import queryStyleValue from "./styleValue.js"

import component from '@/components/component.js';
//import "@/lib/jsonEditor";

export default {
	mixins:[component],
	components: {
		[Breadcrumb.name]: Breadcrumb,
		[BreadcrumbItem.name]: BreadcrumbItem,
		[Autocomplete.name]: Autocomplete,
		[Button.name]: Button,
		[Input.name]: Input,
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Radio.name]: Radio,
		[RadioGroup.name]: RadioGroup,
		[Tag.name]:Tag,
	},

	data: function() {
		return {
			rootTag: g_app.getData("__ROOT_TAG__"),
			module: {},
			isClient: false,
			className:"",
			attrKey:"",
			attrValue:"",
			styleKey:"",
			styleValue:"",
			styles:{},
			attrs:{},
			classes:{},
			vars:{},
			attrList:[],
			tag:{},
			queryStyleKey: queryStyleKey,
			queryStyleValue: queryStyleValue,
			tagKey:"",
			tagValue:"",

			codemirrorOptions: {
			},
		}
	},
	computed: {
		tagId() {
			return this.getData("__TAG_ID__");
		},
		rootTagId() {
			return this.getData("__ROOT_TAG_ID__");
		},
		codemirror() {
			return this.$refs.cm && this.$refs.cm.codemirror;
		},
		navTagList() {
			if (!this.tag) {
				return [];
			}
			var navTagList = [];
			var tmpTag = this.tag;
			while(tmpTag) {
				navTagList.push(tmpTag);
				tmpTag = tmpTag.parentTag;
			}
			navTagList.reverse();
			return navTagList;
		},
	},
	watch:{
		rootTagId: function() {
			this.rootTag = g_app.getData("__ROOT_TAG__");
		},
		tagId: function(tagId) {
			const self = this;
			const tag = self.rootTag.findById(tagId);
			self.setTag(tag);
		}
	},
	methods: {
		setTagId(tagId) {
			this.setData("__TAG_ID__", tagId);
		},

		async submitModule() {
			if (!this.module.modulename) return this.$message("名称不能为空");
			if (!this.rootTag) return;

			this.module.tag = this.rootTag.json();
			this.module.userId = this.user.id;

			const result = await this.api.modules.upsert(this.module);
			if (result.isErr()) this.$message(result.getMessage());
			this.$message("模块导出成功");
		},

		setTag(tag) {
			if (!tag) return;

			if (this.tag.tagId != tag.tagId) {
				this.tagKeys = _.map(tag.getPaths(), path => ({value:path}));
				this.tagKey = "";
				this.tagValue = "";
			}
			this.tag = tag;
			this.styles = tag.styles || {};
			this.attrs = tag.attrs || {};
			this.classes = tag.classes || {};
			this.vars = tag.vars || {};	
			this.attrList = tag.attrList;
			this.queryAttrs = [];
			const attrs = tag.attrList || [];
			for (var i = 0; i < attrs.length; i++){
				let attr = attrs[i];
				this.queryAttrs.push({
					value:attr.attrName,
					desc:attr.desc,
				});
			}
			//console.log(this.tag);
		},
		tagKeyBlur() {
			const value = _.get(this.tag, this.tagKey, "");
			//console.log(value);
			this.tagValue = mdconf.jsonToMd(value);
		},
		clickUpdateTagValueBtn() {
			//console.log(this, this.tagKey);
			if (!this.tagKey) {
				return;
			}
			const text = this.$refs.cm.codemirror.getValue();
			const oldvalue = _.get(this.tag, this.tagKey, "");
			if (_.isObject(oldvalue)) {
				const value = mdconf.mdToJson(text);
				if (_.isObject(value)) {
					_.each(oldvalue, (val, key) => delete oldvalue[key]);
					_.each(value, (val, key) => vue.set(oldvalue, key, val));
				}
			} else if (_.isNumber(oldvalue)) {
				_.set(this.tag, this.tagKey, _.toNumber(text) || oldvalue);
			} else {
				_.set(this.tag, this.tagKey, text);
			}
			this.setTag(this.tag);
		},
		queryKeySearch(queryString, cb) {
			const list = this.tagKeys.filter(key => key.value.toLowerCase().indexOf(queryString) == 0);
			cb(list);
		},
		clickAddStyle() {
			if (!this.tag || !this.tag.styles || !this.styleKey || !this.styleValue) {
				return;
			}

			vue.set(this.tag.styles, this.styleKey, this.styleValue);
			//console.log(this.tag.styles);

			this.styleKey = "";
			this.styleValue = "";
		},
		clickDeleteStyleBtn(key) {
			vue.delete(this.tag.styles, key);
		},
		queryStyleKeySearch(queryString, cb) {
			const styles = this.queryStyleKey.filter(val => val.value.toLowerCase().indexOf(queryString) == 0);
			cb(styles);
		},
		queryStyleValueSearch(queryString, cb) {
			let list = this.queryStyleValue[this.styleKey] || [];
			list = list.filter(val => val.value.toLowerCase().indexOf(queryString) == 0)
			cb(list);
		},
		queryAttrKeySearch(queryString, cb) {
			cb([]);
		},
		queryAttrValueSearch(queryString, cb) {
			cb([]);
		},
		clickAddAttr() {
			if (!this.attrKey || !this.attrValue) {
				return;
			}
			vue.set(this.tag.attrs, this.attrKey, this.attrValue);
			this.attrKey = "";
			this.attrValue = "";
		},
		clickDeleteAttrBtn(key) {
			vue.delete(this.tag.attrs, key);
		},
		clickSelectTag(tag) {
			this.setTagId(tag.tagId);
		},

		queryClassNameSearch(queryString, cb) {
			cb([]);
		},

		clickAddClass() {
			if (!this.className) return;

			vue.set(this.tag.classes, this.className, true);
			this.className="";
		},

		clickDeleteClassBtn(key) {
			vue.delete(this.tag.classes, key);
		}

  	},
	created() {
	},
	mounted() {
	},
}
</script>

<style>
.CodeMirror {
	height:100%;
}
</style>
<style scoped>
.style-item-container { 
}
.el-tabs {
	flex:1;
	width: 100%;
	border: none;
}
</style>

