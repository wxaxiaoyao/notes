
<template>
	<el-form :model="team" label-width="80px">
		<el-form-item label="团队名" >
			<el-input v-model="team.name"></el-input>
		</el-form-item>
		<el-form-item label="介绍">
			<el-input type="textarea" v-model="team.description" resize="none"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button @click.prevent="clickCreateTeamBtn">创建</el-button>
		</el-form-item>
	</el-form>
</template>

<script>

import axios from "axios";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data:function(){
		return {
			team:{},
		}
	},
	props:{
		__default_data__: {
			type: Object,
			default: function() {
				return {
				};
			}
		}
	},
	methods: {
		async clickCreateTeamBtn() {
			const result = await this.api.teams.create(this.team);
			if (result.isErr()) return this.$message({message:"创建团队失败"});
			// 跳转至我的团队列表
		}
	},
}
</script>
