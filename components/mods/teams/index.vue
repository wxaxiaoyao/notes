
<template>
	<div class="teams-index-container container">
		<el-tabs>
			<el-tab-pane label="我的团队">
				<el-table :data="teams">
					<el-table-column prop="id" label="ID" width="60px">	</el-table-column>
					<el-table-column prop="name" label="团队名" width="150px">
						<template slot-scope="{row, $index}">
							<a :href="'/note/teams/detail?id=' + row.id">{{row.name}}</a>
						</template>
					</el-table-column>
					<el-table-column prop="description" label="描述"></el-table-column>
					<el-table-column label="操作" fixed="right" width="100px">
						<template slot-scope="{row, $index}">
							<i @click="clickEditBtn(row)" class="oper-icon el-icon-edit" data-toggle="tooltip" title="编辑"></i>
							<i @click="clickTeamDailiesBtn(row)" class="oper-icon iconfont icon-report" data-toggle="tooltip" title="团队日报"></i>
							<i @click="clickDeleteBtn(row, $index)" class="oper-icon el-icon-delete" data-toggle="tooltip" title="删除"></i>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="加入的团队">
				<el-table :data="joinTeams">
					<el-table-column prop="id" label="ID" width="60px">	</el-table-column>
					<el-table-column prop="name" label="团队名" width="150px"></el-table-column>
					<el-table-column prop="description" label="描述"></el-table-column>
					<el-table-column label="操作" fixed="right" width="100px">
						<template slot-scope="{row, $index}">
							<i @click="clickTeamDailiesBtn(row)" class="oper-icon iconfont icon-report" data-toggle="tooltip" title="团队日报"></i>
							<i @click="clickExitTeamBtn(row, $index)" class="oper-icon el-icon-delete" data-toggle="tooltip" title="退出团队"></i>
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
			teams:[],
			joinTeams:[],
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

		clickTeamDailiesBtn(team) {
			this.$router.push({path:"/note/dailies/team?teamId=" + team.id});
		},

		async clickDeleteBtn(x, index) {
			const result = await this.api.teams.delete({id:x.id});
			if (result.isErr()) return this.$message({message:"团队删除失败"});
			this.teams.splice(index, 1);
		},

		async clickExitTeamBtn(team, index) {
			const result = await this.api.teams.exit({id: team.id});
			
			if (result.isErr()) return this.$message({message:"退出团队失败"});

			this.joinTeams.splice(index,1);
		}
	},

	async mounted() {
		let result = await this.api.teams.all();
		const teams = result.data || [];
		this.teams = [];
		this.joinTeams = [];
		_.each(teams, team => {
			if (team.userId == this.authUserId) {
				this.teams.push(team);
			} else {
				this.joinTeams.push(team);
			}
		});
	},
}
</script>

<style>
</style>

<style scoped>

</style>
