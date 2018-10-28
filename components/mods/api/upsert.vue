
<template>
	<div class="apis-upsert-container container">
		<div class="header-container">
			<div class="title">API录入</div>
			<div>
				<el-button @click="clickSubmitBtn" type="text">提交</el-button>
				<el-button @click="clickListBtn" type="text">API列表</el-button>
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
					<el-button @click="__data__.headers.push({key:headerKey, value:headerValue})">添加</el-button>
				</div>
			</el-form-item>
			<el-form-item label="请求头" v-for="(header, i) in __data__.headers" :key="'header' + i">
				<div class="item-container">
					<el-input disabled v-model="header.key" placeholder="KEY"></el-input>
					<el-input disabled v-model="header.value" placeholder="值"></el-input>
					<el-button @click="__data__.headers.splice(i, 1)">删除</el-button>
				</div>
			</el-form-item>
			<el-form-item label="参数">
				<div class="item-container">
					<el-select style="width:300px" v-model="paramKey" placeholder="字段名" @change="handleSelectChange('field')" clearable allow-create filterable default-first-option>
						<el-option v-for="(x,i) in config.fields" :key="i" :label="x.key" :value="x.key"></el-option>
					</el-select>
					<el-select v-model="paramType" placeholder="数据类型">
						<el-option v-for="(x,i) in types" :key="i" :label="x.label" :value="x.value"></el-option>
					</el-select>
					<el-input clearable v-model="paramDescription" placeholder="备注"></el-input>
					<el-button @click="__data__.params.push({key:paramKey, type:paramType, description:paramDescription})">添加</el-button>
					</div>
			</el-form-item>
			<el-form-item v-for="(param, i) in __data__.params" :key="'param' + i">
				<div class="item-container">
					<el-input disabled v-model="param.key" placeholder="字段名"></el-input>
					<el-input disabled v-model="param.type" placeholder="数据类型"></el-input>
					<el-input disabled v-model="param.description" placeholder="备注"></el-input>
					<el-button @click="__data__.params.splice(i, 1)">删除</el-button>
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
					<el-button @click="__data__.datas.push({key:dataKey, type:dataType, description: dataDescription})">添加</el-button>
				</div>
			</el-form-item>
			<el-form-item v-for="(data, i) in __data__.datas" :key="'data' + i">
				<div class="item-container">
					<el-input disabled v-model="data.key" placeholder="字段名"></el-input>
					<el-input disabled v-model="data.type" placeholder="数据类型"></el-input>
					<el-input disabled v-model="data.description" placeholder="备注"></el-input>
					<el-button @click="__data__.datas.splice(i, 1)">删除</el-button>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			baseUrl:"",
			baseUrlDescription:"",
			headerKey:"",
			headerValue:"",
			headerDecription:"",
			paramKey:"",
			paramType:"string",
			paramDescription:"",
			paramValue:"",
			dataKey:"",
			dataType:"string",
			dataDescription:"",
			dataValue:"",
			head: {
				title:"API录入",
			},

		}
	},

	props: {
	},

	computed: {
	},

	methods: {
	},

	async mounted() {
	},
}
</script>

<style>
</style>

<style lang="less" scoped>
.apis-upsert-container {

}
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
