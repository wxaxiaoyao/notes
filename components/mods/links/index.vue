
<template>
	<div class="links-index-container container">
		<div class="header-container">
			<div class="title">链接管理</div>

			<el-input v-model="searchValue" clearable placeholder="请输入搜索内容" class="input-with-select" size="small">
				<el-select v-model="searchField" slot="prepend" @change="handleSelectField">
					<el-option v-for="(x, i) in fields" :key="i" :label="x.label" :value="x.value"></el-option>
				</el-select>
			</el-input>

			<el-button @click="clickNewBtn" type="text" round>新增<i class="el-icon-plus"></i></el-button>
		</div>
		<el-table :data="links" :default-sort="{prop:'title', order:'ascending'}">
			<el-table-column prop="title" label="链接" sortable width="350">
				<template slot-scope="{row}">
					<a :href="row.href" target="_blank">{{row.title || row.href}}</a>
				</template>
			</el-table-column>
			<el-table-column prop="tags" label="标签" width="150">
				<template slot-scope="{row}">
					<tags __style__="show" :__default_data__="row.tagsData"></tags>
				</template>
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
			fieldValues:[],
			searchField:"title",
			fields: [
			{label:"链接", value:"title"},
			{label:"标签", value:"tags"},
			{label:"备注", value:"description"},
			],

			links:[],
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
			this.links = [];
			_.each(this.linksBackUp, x => {
				const value = x[this.searchField];
				if (g_app.util.lcs(value, str) == str.length) {
					this.links.push(x);
				}
			});
		},

		setFieldValues() {
			_.each(this.linksBackUp, x => {
				const value = x[this.searchField];
				const exist = {};
				if (exist[value]) return;
				this.fieldValues.push({label:value, value});
			});
		},

		clickNewBtn() {
			this.$router.push({path:"/note/links/upsert"});
		},

		async clickDeleteBtn(x, index) {
			const result = await this.api.links.delete({id:x.id});
			if (result.isErr()) return this.$message({message:"删除失败"});
			this.links.splice(index, 1);
		},

		async clickEditBtn(x) {
			this.$router.push({path:"/note/links/upsert?id=" + x.id});
		}
	},

	async mounted() {
		const result = await this.api.links.get();
		const links = result.data || [];

		_.each(links, x => {
			const tags = x.tags.split("|").filter(o => o);
			x.tagsData = {tags};
		});

		this.links = links;
		this.linksBackUp = links;
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
