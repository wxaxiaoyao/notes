
<template>
	<div class="links-index-container container">
		<div class="header-container">
			<div class="title">链接管理</div>
			<el-button @click="clickNewBtn" type="text" round>新增<i class="el-icon-plus"></i></el-button>
		</div>
		<el-table :data="links">
			<el-table-column prop="username" label="链接">
				<template slot-scope="{row}">
					<a :href="row.href" target="_blank">{{row.title || row.href}}</a>
				</template>
			</el-table-column>
			<el-table-column prop="description" label="备注">
			</el-table-column>
			<el-table-column label="操作">
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

	methods: {
		clickNewBtn() {
			this.$router.push({path:"/note/links/upsert"});
		},

		async clickDeleteBtn(x, index) {
			const reuslt = await this.api.links.delete({id:x.id});
			if (result.isErr()) return this.$message({message:"删除失败"});
			this.dailies.splice(index, 1);
		},

		async clickEditBtn(x) {
			this.$router.push({path:"/note/links/upsert?id=" + x.id});
		}
	},

	async mounted() {
		const result = await this.api.links.get();
		const links = result.data || [];

		this.links = links;
	}
}
</script>

<style>
</style>

<style lang="less" scoped>
.links-index-container {

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

.oper-icon {
	margin:2px;
}
</style>
