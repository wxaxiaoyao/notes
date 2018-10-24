
<template>
	<div class="teams-detail-container container">
		<div class="team-container">
			<div class="team-name-container">
				<span>{{team.name}}	</span>
				<el-button type="text" @click="clickTeamDailyReportBtn">团队日报</el-button>
			</div>
			<div class="team-description-container">{{team.description}}</div>
		</div>

		<el-tabs>
			<el-tab-pane label="成员" name="member">
				<el-table :data="members">
					<el-table-column prop="userId" label="用户ID" width="60px">	</el-table-column>
					<el-table-column prop="username" label="用户名" width="150px"></el-table-column>
					<el-table-column prop="nickname" label="昵称"></el-table-column>
					<el-table-column label="操作" fixed="right" width="100px">
						<template slot-scope="{row, $index}">
							<el-button type="text" @click="clickRemoveMemberBtn(row, $index)">移除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			team:{},
			members:[],
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
				}
			}
		}
	},

	computed: {

	},

	methods: {
		clickEditBtn() {
			
		},

		async clickDeleteBtn(x, index) {
			const result = await this.api.teams.delete({id:x.id});
			if (result.isErr()) return this.$message({message:"团队删除失败"});
			this.teams.splice(index, 1);
		},

		async clickRemoveMemberBtn(user, index) {
			const result = await this.api.teams.removeMember({id:this.team.id, memberId:user.userId});
			if (result.isErr()) return this.$message({message:"移除成员失败"});

			this.members.splice(index, 1);
		},

		clickTeamDailyReportBtn() {
			this.$router.push({path:"/note/teams/dailies?teamId=" + this.team.id});
		},
	},

	async mounted() {
		if (!this.__data__.id) return this.$message({message:"团队不存在"});
		
		const teamId = this.__data__.id;
		let result = await this.api.teams.getById({id:teamId});
		const team = result.data || {};

		result = await this.api.teams.members({id:teamId});
		const members = result.data || [];
	
		this.team = team;
		this.members = members;
		return ;
	},
}
</script>

<style>
</style>

<style scoped>

</style>
