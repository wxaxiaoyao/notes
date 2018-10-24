
<template>
	<div class="dailies-index-container container">
		<el-table :data="dailies">
			<el-table-column prop="date" label="日期" width="100px">
			</el-table-column>
			<el-table-column prop="username" label="日期" width="150px">
				<template slot-scope="{row}">{{row.username + " " + (row.nickname ? `(${row.nickname})`: "")}}</template>
			</el-table-column>
			<el-table-column prop="content" label="内容">
			</el-table-column>
			<el-table-column prop="tags" label="标签" fixed="right" width="150px">
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
					//<tags :__default_data__="row"></tags>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			dailies:[],

			head: {
				title:"团队日报",
			}
		}
	},

	filters: {
	},

	methods: {
		async clickDeleteBtn(x, index) {
			//const reuslt = await this.api.dailies.delete({id:x.id});
			//if (result.isErr()) return this.$message({message:"删除失败"});
			this.dailies.splice(index, 1);
		},

		async clickEditBtn(x) {
			this.$router.push({path:"/note/dailies/upsert?id=" + x.id});
		}
	},

	async mounted() {
		if (!this.__data__.teamId) return;
		const teamId = this.__data__.teamId;
		const result = await this.api.teams.dailies({id:teamId});
		const dailies = result.data || [];
		_.each(dailies, daily => {
			daily.tags = daily.tags.split("|").filter(o => o).join(" ");
		});
		this.dailies = dailies;
	}
}
</script>

<style scoped>
.dailies-index-container {
	
}
.task-container {
	display: flex;
}
.oper-icon {
	margin:2px;
}
</style>
