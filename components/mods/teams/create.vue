
<template>
	<div class="teams-create-container container">
		<el-tabs v-model="activeItem">
			<el-tab-pane label="创建团队" name="create">
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
			</el-tab-pane>
			<el-tab-pane label="加入团队" name="join">
				<el-form :model="team" label-width="80px">
					<el-form-item label="团队名" >
						<el-input v-model="team.name" placeholder="请求团队名"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click.prevent="clickJoinTeamBtn">创建</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>

import axios from "axios";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data:function(){
		return {
			team:{},
			activeItem: "create",
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
		async getTeamByName(name) {
			const result = await this.api.teams.getById({id:name});
			if (result.isErr()) return ;

			return result.data;
		},

		async clickCreateTeamBtn() {
			const team = await this.getTeamByName(this.team.name);
			if (team) return this.$message({message:"团队已存在, 请更换团队名 ^-^"});

			const result = await this.api.teams.create(this.team);
			if (result.isErr()) return this.$message({message:"创建团队失败"});
			// 跳转至我的团队列表
			this.$router.push("/note/teams");
		},

		async clickJoinTeamBtn() {
			const team = await this.getTeamByName(this.team.name);
			if (!team) return this.$message({message:"团队不存在, 请检查团队名是否正确 ^-^"});
			
			const result = await this.api.teams.addMember({id:team.id, memberId:this.authUserId});
			if (result.isErr()) return this.$message({message:"加入团队失败, 请稍后重试...", type:'error'});

			this.$router.push("/note/teams");
		},
	},

	mounted() {
		this.authenticated();
	}
}
</script>

<style scoped>
.teams-create-container {
	margin-top: 20px;
}
</style>
