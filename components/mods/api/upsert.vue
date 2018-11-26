
<template>
	<div class="apis-request-container container">
		<div class="header-container">
			<div class="title">API录入</div>
			<el-select size="mini" v-model="apiId" @change="changeApiId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="apiFilter" :loading="loading">
				<el-option v-for="(x, i) in options" :key="i" :label="x.label" :value="x.value"></el-option>
			</el-select>
			<div>
				<el-button v-if="!onlytest" @click="clickSubmitBtn" type="text">提交</el-button>
				<el-button @click="clickTestBtn" type="text">测试</el-button>
				<el-button v-if="!onlytest" @click="clickListBtn" type="text">列表</el-button>
			</div>
		</div>
		<el-form ref="form" :model="__data__" label-width="80px" size="small">
			<el-row>
				<el-col :span="16">
					<el-form-item label="标题">
						<el-input v-model="__data__.title" placeholder="链接标题"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="项目">
						<el-select style="width:100%" v-model="__data__.projectId" placeholder="项目">
							<el-option v-for="(x,i) in projects" :key="i" :label="x.label" :value="x.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
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
					<el-select style="width:245px" v-model="header" placeholder="KEY" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.headers" :key="i" :label="x.key" :value="x">
							<span style="float:left">{{x.key}}</span>
							<span style="float:right; color: #8492a6; font-size: 13px">{{x.description}}</span>
						</el-option>
					</el-select>
					<el-input v-model="header.value" placeholder="值" clearable></el-input>
					<el-input v-model="header.description" placeholder="备注" clearable></el-input>
					<el-button @click="headers.push({key:header.key, value:header.value, description:header.description})">添加</el-button>
				</div>
			</el-form-item>
			<el-form-item label="请求头" v-for="(h, i) in headers" :key="'header' + i">
				<div class="item-container">
					<el-select style="width:245px" v-model="h.key" placeholder="KEY" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.headers" :key="i" :label="x.key" :value="x.key"></el-option>
					</el-select>
					<el-input v-model="h.value" placeholder="值"></el-input>
					<el-input v-model="h.description" placeholder="备注"></el-input>
					<el-button @click="headers.splice(i, 1)">删除</el-button>
				</div>
			</el-form-item>
			<el-form-item label="参数">
				<div class="item-container">
					<el-select style="width:550px" v-model="paramKey" placeholder="字段名" @change="handleSelectChange('field')" clearable allow-create filterable default-first-option>
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
					<el-select style="width:330px" v-model="param.key" placeholder="字段名" @change="handleSelectChange('field')" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.fields" :key="i" :label="x.key" :value="x.key"></el-option>
					</el-select>
					<el-select style="width:150px" v-model="param.type" placeholder="数据类型">
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
				<el-tabs v-loading="testing">
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
			data:{
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
			apiId:"",
			options:[],
			loading: false,
			testing: false,
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		changeApiId() {
			window.location.href = "/note/apis/upsert?id=" + this.apiId + (this.onlytest ? "&oper=test" : "");
		},

		async apiFilter(str) {
			if (!str) return;
			if (this.loading) return console.log("数据加载中...");
			this.loading = true;
			const result = await this.api.apis.filter({
				attributes:["id", "title"],
				where: {
					"title-like": `%${str}%`,
				}
			});
			const options = [];
			const list = result.data || [];
			_.each(list, o => options.push({label:o.title, value:o.id}));
			this.options = options;
			this.loading = false;
		},

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
			//_.each(this.params, x => data[x.key] = x.value);
			_.each(this.params, x => {
				if (x.value == undefined || x.value == "") return ;
				try {
					const value = x.type == "string" ? x.value : JSON.parse(x.value);
					_.set(data, x.key, value);
				} catch(e) {
					console.log(e);
					this.$message("数据格式错误");
				}
			});
			if (method == "get" || method == "delete" || method == "head" || method == "options") config.params = data;
			else config.data = data;
			config.url = pathToRegexp.compile(config.url)(data);
			this.__data__.request = config;
			this.testing = true;
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
			this.testing = false;
		},
	},

	async mounted() {
		if (this.isAuthenticated) await this.loadConfig();

		await this.loadProjects();

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
