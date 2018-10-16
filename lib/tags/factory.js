import _ from 'lodash';

import {tagFactory} from "./tag.js";

// 定义容器tag
export const divTag = function() {
	var tag = tagFactory("div");
	tag.name = "容器";
	tag.isContainer = true;

	return tag;
}

// 行容器
export const rowDivTag = function() {
	var tag = divTag();

	tag.name = "行容器";
	tag.isContainer = true;
	tag.styles["display"] = "flex";

	return tag;
}

// 列容器
export const colDivTag = function() {
	var tag = divTag();

	tag.name = "列容器";
	tag.isContainer = true;
	tag.styles["display"] = "flex";
	tag.styles["flex-direction"] = "column";

	return tag;
}

// 定义图片tag
export const imgTag = function() {
	var tag = tagFactory("img");
	tag.name = "图片";
	
	tag.attrs[":src"] = "src";
	tag.vars = {
		src: "http://www.runoob.com/try/bootstrap/layoutit/v3/default3.jpg",
	}
	tag.$vars = {
		label: "图片",
		type: "form",
		items: {
			src: {
				label: "图片地址",
				type: "text",
			}
		}
	}
	return tag;
}

// 文本
export const spanTag = function(text) {
	var tag = tagFactory("span");
	tag.name = "文本";

	tag.attrs["v-text"] = "text";

	tag.vars = {
		text: text || "文本",
	}

	return tag;
}
// 标题
export const hTag = function(hn, text) {
	var tag = tagFactory(hn);
	tag.name = "标题";

	tag.attrs["v-text"] = "text";

	tag.vars = {
		text: text ||  "这是一个标题",
	}

	return tag;
}

// 一级标题
export const h1Tag = function() {
	var tag = hTag("h1");
	tag.name = "一级标题";

	return tag;
}

// 二级标题
export const h2Tag = function() {
	var tag = hTag("h2");
	tag.name = "二级标题";

	return tag;
}

// 三级标题
export const h3Tag = function() {
	var tag = hTag("h3");
	tag.name = "三级标题";

	return tag;
}

// 段落
export const pTag = function(text) {
	var tag = tagFactory("p");
	tag.name = "段落";

	tag.attrs["v-text"] = "text";
	tag.vars = {
		text: text || "这是一个段落",
	}

	return tag;
}


// 链接
export const aTag = function() {
	var tag = tagFactory("a");
	tag.name = "链接";

	tag.attrs[":href"] = "href";
	tag.attrs["v-text"] = "text";
	tag.vars = {
		text: "这是一个链接",
		href: "#",
	}

	return tag;
}

// 图标
export const iTag = function(){
	var tag = tagFactory("i");
	tag.name = "图标";

	tag.attrs.class = "el-icon-info";

	return tag;
}

// element ui base on vue 组件
export const elRowTag = function() {
	var tag = tagFactory("el-row");
	tag.name = "布局行";
	tag.isContainer = true;

	tag.attrList = [
	{
		name: "栅格间隔",
		attrName: ":gutter",
		defaultValue:"",
		desc: "栅格间隔",
	},
	];

	return tag;
}

export const elColTag = function() {
	var tag = tagFactory("el-col");
	tag.name = "布局列";
	tag.isContainer = true;

	tag.styles["min-height"] = "1px";
	tag.attrList = [
	{
		name: "栅格列数",
		attrName: ":span",
		defaultValue:"",
		desc: "栅格占据的列数",
	},
	{
		name: "偏移列数",
		attrName: ":offset",
		defaultValue:"",
		desc: "栅格左侧的间隔格数",
	},
	{
		name: "右移格数",
		attrName: ":push",
		defaultValue:"",
		desc: "栅格向右移动格数",
	},
	{
		name: "左移格数",
		attrName: ":pull",
		defaultValue:"",
		desc: "栅格向左移动格数",
	},
	];
	//tag.vars = [
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":span",
				//key:"span", // 栅格间隔
			//},
		//},
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":offset",
				//key:"offset", 
			//},
		//},
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":push",
				//key:"push", 
			//},
		//},
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":pull",
				//key:"pull", 
			//},
		//},
	//];

	return tag;
}


export const elButtonTag = function() {
	var tag = tagFactory("el-button");
	tag.name = "按钮";
	
	tag.attrs["v-text"] =  "text";
	tag.vars = {
		text: "按钮",
	}

	return tag;
}

export default {
	div: divTag,
	rowDiv: rowDivTag,
	colDiv: colDivTag,
	img: imgTag,
	span: spanTag,
	h: hTag,
	h1: h1Tag,
	h2: h2Tag,
	h3: h3Tag,
	p: pTag,
	a: aTag,
	i: iTag,
	elRow: elRowTag,
	elCol: elColTag,
}

