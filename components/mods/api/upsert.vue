
<template>
	<div class="apis-request-container container">
		<div class="header-container">
			<div class="title">API录入</div>
			<div>
				<el-button v-if="!onlytest" @click="clickSubmitBtn" type="text">提交</el-button>
				<el-button @click="clickTestBtn" type="text">测试</el-button>
				<el-button v-if="!onlytest" @click="clickListBtn" type="text">API列表</el-button>
			</div>
		</div>
		<el-form ref="form" :model="__data__" label-width="80px" size="small">
			<el-form-item label="标题">
				<div class="item-container">
					<el-select style="width:245px" v-model="classify" placeholder="分类" @change="handleSelectChange('classify')" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.classify" :key="i" :label="x.classify" :value="x.classify"></el-option>
					</el-select>
					<el-input v-model="__data__.title" placeholder="链接标题"></el-input>
				</div>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="__data__.description" type="textarea" :autosize="{minRows:2, maxRows:4}"
					placeholder="链接内容备注 ^-^">
				</el-input>
			</el-form-item>
			<el-form-item label="请求">
				<div class="item-container">
					<el-select style="width:200px" v-model="method" placeholder="方法" @change="handleSelectChange('method')">
						<el-option label="GET" value="get"></el-option>
						<el-option label="POST" value="post"></el-option>
						<el-option label="PUT" value="put"></el-option>
						<el-option label="DELETE" value="delete"></el-option>
					</el-select>
					<el-select style="width:500px;" v-model="baseURL" placeholder="base URL" @change="handleSelectChange('baseurl')" clearableallow-create filterable default-first-option>
						<el-option v-for="(x, i) in config.baseUrls" :key="i" :label="x.baseUrl" :value="x.baseUrl"></el-option>
					</el-select>
					<el-input v-model="__data__.url" placeholder="url" class="input-with-select">
					</el-input>
				</div>
			</el-form-item>
			<el-form-item label="请求头">
				<div class="item-container">
					<el-select style="width:245px" v-model="headerKey" placeholder="KEY" @change="handleSelectChange('header')" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.headers" :key="i" :label="x.key" :value="x.key"></el-option>
					</el-select>
					<el-input v-model="headerValue" placeholder="值" clearable></el-input>
					<el-button @click="headers.push({key:headerKey, value:headerValue})">添加</el-button>
				</div>
			</el-form-item>
			<el-form-item label="请求头" v-for="(header, i) in headers" :key="'header' + i">
				<div class="item-container">
					<el-select disabled style="width:245px" v-model="header.key" placeholder="KEY" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.headers" :key="i" :label="x.key" :value="x.key"></el-option>
					</el-select>
					<el-input disabled v-model="header.value" placeholder="值"></el-input>
					<el-button @click="headers.splice(i, 1)">删除</el-button>
				</div>
			</el-form-item>
			<el-form-item label="参数">
				<div class="item-container">
					<el-select style="width:350px" v-model="paramKey" placeholder="字段名" @change="handleSelectChange('field')" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.fields" :key="i" :label="x.key" :value="x.key"></el-option>
					</el-select>
					<el-select style="width:250px" v-model="paramType" placeholder="数据类型">
						<el-option v-for="(x,i) in types" :key="i" :label="x.label" :value="x.value"></el-option>
					</el-select>
					<el-input clearable v-model="paramDescription" placeholder="字段描述"></el-input>
					<el-input clearable v-model="paramValue" placeholder="字段值"></el-input>
					<!--el-input clearable v-model="paramDescription" placeholder="备注"></el-input-->
					<el-button @click="params.push({key:paramKey, type:paramType, value:paramValue, description:paramDescription})">添加</el-button>
					</div>
			</el-form-item>
			<el-form-item v-for="(param, i) in params" :key="'param' + i">
				<div class="item-container">
					<el-select style="width:350px" v-model="param.key" placeholder="字段名" @change="handleSelectChange('field')" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.fields" :key="i" :label="x.key" :value="x.key"></el-option>
					</el-select>
					<el-select style="width:250px" v-model="param.type" placeholder="数据类型">
						<el-option v-for="(x,i) in types" :key="i" :label="x.label" :value="x.value"></el-option>
					</el-select>
					<!--el-input v-model="param.key" placeholder="字段名"></el-input-->
					<!--el-input v-model="param.type" placeholder="数据类型"></el-input-->
					<el-input v-model="param.description" placeholder="字段描述"></el-input>
					<el-input v-model="param.value" placeholder="字段值"></el-input>
					<el-button @click="params.splice(i, 1)">删除</el-button>
				</div>
			</el-form-item>
			<el-form-item label="返回">
				<div class="item-container">
					<el-select  style="width:300px" v-model="dataKey" placeholder="字段名" @change="handleSelectChange('data')" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.fields" :key="i" :label="x.key" :value="x.key"></el-option>
					</el-select>
					<el-select v-model="dataType" placeholder="数据类型">
						<el-option v-for="(x,i) in types" :key="i" :label="x.label" :value="x.value"></el-option>
					</el-select>
					<el-input clearable v-model="dataDescription" placeholder="备注"></el-input>
					<el-button @click="datas.push({key:dataKey, type:dataType, description: dataDescription})">添加</el-button>
				</div>
			</el-form-item>
			<el-form-item v-for="(data, i) in datas" :key="'data' + i">
				<div class="item-container">
					<el-input disabled v-model="data.key" placeholder="字段名"></el-input>
					<el-input disabled v-model="data.type" placeholder="数据类型"></el-input>
					<el-input disabled v-model="data.description" placeholder="备注"></el-input>
					<el-button @click="datas.splice(i, 1)">删除</el-button>
				</div>
			</el-form-item>
			<el-form-item>
				<el-tabs>
					<el-tab-pane label="响应体">
						<pre>{{response.data}}</pre>
					</el-tab-pane>
					<el-tab-pane label="响应头">
						<pre>{{"状态行: " + response.status + " "+ response.statusText}}</pre>
						<pre>{{response.headers}}</pre>
					</el-tab-pane>
				</el-tabs>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import pathToRegexp from 'path-to-regexp';

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			baseUrl:"",
			baseUrlDescription:"",
			headerKey:"",
			headerValue:"",
			paramKey:"",
			paramType:"string",
			paramDescription:"",
			paramValue:"",
			dataKey:"",
			dataType:"string",
			dataDescription:"",
			dataValue:"",
			status:"",
			head: {
				title:"API测试",
			},
			__data__:{
				//baseURL:"http://xiaoyao.com:3001/api/v0/",
				//baseUrls:[],
				//headers:[],
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
				//],
				//response:{},
			},
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		async clickTestBtn() {
			const config = {
				baseURL: this.__data__.baseURL,
				url: this.__data__.url,
				method: this.__data__.method, 
				headers:{}, 
				params:{}, 
				data:{},
			};
			//console.log(config);
			const data = {};
			const method = config.method;
			_.each(this.headers, x => config.headers[x.key] = x.value);
			_.each(this.params, x => data[x.key] = x.value);
			if (method == "get" || method == "delete" || method == "head" || method == "options") config.params = data;
			else config.data = data;
			config.url = pathToRegexp.compile(config.url)(data);
			this.__data__.request = config;
			await axios.request(config).then(res => {
				this.__data__.response = res;
				this.response.data = res.data;
				this.response.headers = res.headers;
				this.status = res.status;
				//console.log(res);
			}).catch(e => {
				if (e.response) {
					const res = e.response;
					this.__data__.response = res;
					this.response.data = res.data;
					this.response.headers = res.headers;
					this.status = res.status;
				} else if (e.request) {
					this.$message("网络异常, 请稍后尝试!!!");
				} else {
					this.$message("客户端内部错误!!!");
				}
			});
		},
	},

	async mounted() {
		if (this.isAuthenticated) await this.loadConfig();

		await this.loadData();
	}
}
</script>

<style lang="less">
.apis-request-container {
	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}
}
</style>

<style lang="less" scoped>
.item-container {
	display: flex;
}
.header-container {
	display: flex;
	justify-content: space-between;
	margin-top: 15px;

	.title {
		font-weight: bold;
		font-size:20px;
	}
}
</style>
