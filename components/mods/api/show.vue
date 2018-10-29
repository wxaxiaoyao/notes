
<template>
	<div class="apis-show-container container markdown-body">
		<div class="demo-data">
			<el-popover trigger="hover" width="500">
				<pre>{{response}}</pre>
				<b slot="reference">请求示例</b>
			</el-popover>
		</div>
		<h3 style="margin-top:0px;">{{__data__.title}}</h3>
		<blockquote>{{__data__.description}}</blockquote>
		<pre>{{__data__.method.toUpperCase() + " " + __data__.url}}</pre>
		<b class="input-output">参数: {{__data__.params && __data__.params.length == 0 ? "无" : ""}}</b>
		<ul><li v-for="(x,i) in __data__.params" :key="i">{{x.key + " " + x.type + " " + x.description}}</li></ul>
		<b class="input-output">返回: {{__data__.datas && __data__.datas.length == 0 ? "无" : ""}}</b>
		<ul><li v-for="(x,i) in __data__.datas" :key="i">{{x.key + " " + x.type + " " + x.description}}</li></ul>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			activeItem:"baseinfo",
			defaultData: {
				//title:"获取用户列表",
				//description:"按表字段过滤检索用户列表",
				//url:"users",
				//method:"get",
				//params:[
				//{key:"username", type:"string", description:"用户名"},
				//{key:"nickname", type:"string", description:"昵称"},
				//],
				//datas: [
					//{key:"$", type: "array", description:"用户对象列表"},
				//]
			}
		}
	},

	filters: {
	
	},

	props: {
	},

	computed: {
	},

	methods: {
	},

	mounted() {
	},
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
.apis-show-container {
	position: relative;
}
.input-output {
	margin: 6px 0px 0px;
}
.demo-data {
	position: absolute;
	top: 10px;
	right: 10px;
	font-size:12px;
}
</style>
