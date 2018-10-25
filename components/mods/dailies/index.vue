

<template>
	<div class="dailies-index-container container">
		<el-table :data="dailies">
			<el-table-column prop="date" label="日期" width="100px">
			</el-table-column>
			<el-table-column prop="content" label="内容">
			</el-table-column>
			<el-table-column prop="tags" label="标签" fixed="right" width="150px">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="100px">
				<template slot-scope="{row, $index}">
					<i @click="clickEditBtn(row)" class="oper-icon el-icon-edit" data-toggle="tooltip" title="编辑"></i>
					<!--i disabled @click="clickDeleteBtn(row, $index)" class="oper-icon el-icon-delete"></i-->
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
			dailies:[],

			head: {
				title:"日报",
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
		const result = await this.api.dailies.get({"x-order":"date-desc"});
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
