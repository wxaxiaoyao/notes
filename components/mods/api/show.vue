
<template>
	<div class="apis-show-container container">
		<el-tabs>
			<el-tab-pane label="基本信息">
				<h3>{{__data__.title}}</h3>
				<blockquote>{{__data__.description}}</blockquote>
				<el-input disabled v-model="__data__.url" placeholder="url" size="small">
					<el-select style="width:150px" v-model="__data__.method" slot="prepend" placeholder="方法">
						<el-option label="GET" value="get"></el-option>
						<el-option label="POST" value="post"></el-option>
						<el-option label="PUT" value="put"></el-option>
						<el-option label="DELETE" value="delete"></el-option>
					</el-select>
				</el-input>
				<h5 class="input-output">参数: {{__data__.params && __data__.params.length == 0 ? "无" : ""}}</h5>
				<el-table v-if="__data__.params.length" :data="__data__.params" size="small">
					<el-table-column prop="key" label="字段名">
					</el-table-column>
					<el-table-column prop="type" label="类型">
					</el-table-column>
					<el-table-column prop="description" label="备注">
					</el-table-column>
				</el-table>
				<h5 class="input-output">返回: {{__data__.datas && __data__.datas.length == 0 ? "无" : ""}}</h5>
				<el-table v-if="__data__.datas && __data__.datas.length" :data="__data__.datas" size="small">
					<el-table-column prop="key" label="字段名">
					</el-table-column>
					<el-table-column prop="type" label="类型">
					</el-table-column>
					<el-table-column prop="description" label="备注">
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="请求数据">
				<pre>{{__data__.request}}</pre>
			</el-tab-pane>
			<el-tab-pane label="响应数据">
				<pre>{{__data__.response}}</pre>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
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

	props: {
	},

	computed: {
	},

	mounted() {
	},
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
.input-output {
	margin: 6px 0px 0px;
}
</style>
