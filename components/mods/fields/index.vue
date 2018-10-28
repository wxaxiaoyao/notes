
<template>
	<div class="fields-index-container container">
		<div class="header-container">
			<div class="title">字段列表</div>
			<el-input v-model="searchValue" clearable placeholder="请输入搜索内容" class="input-with-select" size="small">
				<el-select v-model="searchField" slot="prepend" @change="handleSelectField">
					<el-option v-for="(x, i) in tablefields" :key="i" :label="x.label" :value="x.value"></el-option>
				</el-select>
			</el-input>
			<el-button @click="clickNewBtn" type="text" round>新增<i class="el-icon-plus"></i></el-button>
		</div>
		<el-table :data="fields" :default-sort="{prop:'name', order:'ascending'}">
			<el-table-column prop="name" label="名称" sortable>
			</el-table-column>
			<el-table-column prop="type" label="类型" sortable>
			</el-table-column>
			<el-table-column prop="description" label="备注">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="80px">
				<template slot-scope="{row, $index}">
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
			searchValue:"",
			searchField:"name",
			fieldValues:[],
			tablefields: [
			{label:"名称", value:"name"},
			{label:"类型", value:"type"},
			{label:"备注", value:"description"},
			],

			fields:[],
			head: {
				title:"链接管理",
			}
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

	methods: {
		handleSelectField() {
			this.searchValue = "";
		},

		handleSearchChange(str) {
			this.fields = [];
			_.each(this.fieldsBackUp, x => {
				const value = x[this.searchField];
				if (g_app.util.lcs(value, str) == str.length) {
					this.fields.push(x);
				}
			});
		},

		setFieldValues() {
			_.each(this.fieldsBackUp, x => {
				const value = x[this.searchField];
				const exist = {};
				if (exist[value]) return;
				this.fieldValues.push({label:value, value});
			});
		},

		clickNewBtn() {
			this.$router.push({path:"/note/fields/upsert"});
		},

		async clickDeleteBtn(x, index) {
			const reuslt = await this.api.fields.delete({id:x.id});
			if (result.isErr()) return this.$message({message:"删除失败"});
			this.fields.splice(index, 1);
		},

		async clickEditBtn(x) {
			this.$router.push({path:"/note/fields/upsert?id=" + x.id});
		}
	},

	async mounted() {
		const result = await this.api.fields.get();
		const fields = result.data || [];

		this.fields = fields;
		this.fieldsBackUp = fields;
		this.setFieldValues();
	}
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
.header-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 15px;

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

.oper-icon {
	margin:2px;
}
</style>
