
<template>
	<div class="apis-index-container container">
		<div class="header-container">
			<div class="title">API列表</div>
			<el-input v-model="searchValue" clearable placeholder="请输入搜索内容" class="input-with-select" size="small">
				<el-select v-model="searchField" slot="prepend" @change="handleSelectField">
					<el-option v-for="(x, i) in fields" :key="i" :label="x.label" :value="x.value"></el-option>
				</el-select>
			</el-input>
			<div>
				<el-button @click="clickNewBtn" type="text">新增</el-button>
				<el-button @click="clickConfigBtn" type="text">配置</el-button>
			</div>
		</div>
		<el-table :data="apis" :default-sort="{prop:'title', order:'ascending'}">
			<el-table-column type="expand">
				<template slot-scope="{row}">
					<apis __style__="show" :__default_data__="row | apiFilters"></apis>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题" sortable>
			</el-table-column>
			<el-table-column prop="method" label="方法" width="120px">
			</el-table-column>
			<el-table-column prop="url" label="URL" sortable>
			</el-table-column>
			<el-table-column prop="classify" label="分类" sortable>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="100px">
				<template slot-scope="{row, $index}">
					<i @click="clickTestBtn(row)" class="oper-icon iconfont icon-APIceshi" data-toggle="tooltip" title="API测试"></i>
					<i @click="clickNewBtn(row)" class="oper-icon el-icon-plus" data-toggle="tooltip" title="复制新增"></i>
					<i @click="clickEditBtn(row)" class="oper-icon el-icon-edit" data-toggle="tooltip" title="编辑"></i>
					<i @click="clickDeleteBtn(row, $index)" class="oper-icon el-icon-delete" data-toggle="tooltip" title="移除"></i>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

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
			searchValue:"",
			searchField:"name",
			fieldValues:[],
			searchField:"title",
			fields: [
			{label:"标题", value:"title"},
			{label:"备注", value:"description"},
			],
			types:[
			{label:"字符串", value:'string'},
			{label:"数字", value:"number"},
			{label:"布尔", value:"boolean"},
			{label:"对象", value:"object"},
			],
			apis:[],
			data:{
				baseUrls:[],
				headers:[],
				params:[],
			},
			head: {
				title:"API列表",
			},

		}
	},

	props: {
	},

	computed: {
	},

	watch: {
		searchValue(str) {
			this.handleSearchChange(str);
		}
	},

	filters: {
		apiFilters(api) {
			const data =  _.cloneDeep(api);
			data.loaded = true;
			return data;
		}	
	},

	methods: {
		handleSelectField() {
			this.searchValue = "";
		},

		handleSearchChange(str) {
			this.apis = [];
			_.each(this.apisBackUp, x => {
				const value = x[this.searchField];
				if (g_app.util.lcs(value, str) == str.length) {
					this.apis.push(x);
				}
			});
		},

		setFieldValues() {
			_.each(this.apisBackUp, x => {
				const value = x[this.searchField];
				const exist = {};
				if (exist[value]) return;
				this.fieldValues.push({label:value, value});
			});
		},

		clickConfigBtn() {
			this.push("/note/apis/config");
		},

		clickTestBtn(x) {
			this.$router.push({path:"/note/apis/request?id=" + x.id});
		},

		clickNewBtn(x) {
			if (x && x.id)  return 	this.$router.push({path:"/note/apis/upsert?id=" + x.id + "&oper=" + "create"});

			this.$router.push({path:"/note/apis/upsert"});
		},

		async clickDeleteBtn(x, index) {
			const reuslt = await this.api.apis.delete({id:x.id});
			if (result.isErr()) return this.$message({message:"删除失败"});
			this.apis.splice(index, 1);
		},

		async clickEditBtn(x) {
			this.$router.push({path:"/note/apis/upsert?id=" + x.id});
		}
	},

	async mounted() {
		const result = await this.api.apis.get();
		const apis = result.data || [];

		//_.each(apis, x => {
			//x.api = x;
		//});

		this.apis = apis;
		this.apisBackUp = apis;
		this.setFieldValues();
	},
}
</script>

<style>
</style>

<style lang="less" scoped>
.apis-index-container {

}
.item-container {
	display: flex;
}
.header-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 15px 40px 0px 10px;

	.input-with-select {
		width:400px;
		.el-select {
			width:100px;
		}
	}

	.title {
		font-weight: bold;
		font-size:20px;
	}
}
</style>
