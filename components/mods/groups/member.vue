
<template>
	<div>
		<el-dialog :visible.sync="isShowNewMember" title="新增组成员" width="500px">
			<el-form :model="member" label-width="80px" label-position="right" style="width:300px;">
				<el-form-item label="类型">
					<el-select v-model="member.groupId" filterable placeholder="请选择站点">
						<el-option v-for="(x, index) in groups" :key="index" :label="x.groupname" :value="x.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="成员名">
					<el-input clearable v-model="member.memberName" placeholder="成员名"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" v-loading="member.isLoading">
		        <el-button @click="isShowNewMember = false">取 消</el-button>
				<el-button type="primary" @click="clickNewMemberBtn">确 定</el-button>
			</div>
		</el-dialog>

		<el-form :inline="true" :model="search" class="demo-form-inline">
			<el-form-item label="组名">
				<el-select v-model="search.groupId" filterable placeholder="请选择站点">
					<el-option v-for="(x, index) in groups" :key="index" :label="x.groupname" :value="x.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="成员名">
				<el-input clearable v-model="search.memberName" placeholder="成员名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="clickSearchBtn">查询</el-button>
				<el-button type="primary" @click="clickNewBtn">新增</el-button>
			</el-form-item>
		</el-form>
		
		<el-table :data="members">
			<el-table-column fixed prop="userId" label="成员ID"></el-table-column>
			<el-table-column fixed prop="username" label="成员名"></el-table-column>
			<el-table-column fixed prop="groupname" label="组名"></el-table-column>
			<el-table-column fixed="right" label="操作">
				<template slot-scope="{row, $index}">
					<el-button type="text" @click="clickDeleteBtn(row, $index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>

import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins: [mod],
	components: {
	},

	data: function() {
		return {
			isShowNewMember: false,
			member: {
				groupId: null,
			},
			search: {
				groupId: null,
			},
			groups: [],
			members: [],
		}
	},

	methods: {
		async clickSearchBtn() {
			const self = this;
			let result = await this.api.groups.members({
				id: this.search.groupId,
				memberName: this.search.memberName,
			})
			this.members = result.getData() || [];

			const group = self.groups.find(x => x.id == self.search.groupId);
			if (group){
				_.each(this.members, val => val.groupname = group.groupname)
			}
		},

		clickNewBtn() {
			this.member.groupId = this.search.groupId;
			this.isShowNewMember = true;
		},

		async clickDeleteBtn(data, index) {
			let result = await this.api.groups.deleteMember({
				id: this.search.groupId,
				memberName: data.username,
			});
			if (result.isErr()) {
				Message("删除成员失败");
				return;
			}

			this.members.splice(index, 1);
		},

		async clickNewMemberBtn() {
			const memberName = this.member.memberName;
			if (!memberName) {
				Message.warning("成员名不能为空");
				this.isShowNewMember = false;
				return;
			}

			const params = {
				id: this.member.groupId,
				memberName:memberName,
			};

			let result = await this.api.groups.createMember(params);

			if (result.isErr()) {
				Message("添加成员失败, 确保用户存在");
				this.isShowNewMember = false;
				return;
			}

			Message("添加成功成功");
			this.clickSearchBtn();
			this.isShowNewMember = false;
		},
	},

	async mounted() {
		this.member.userId = this.user.id;
		let result = await this.api.groups.get();
		this.groups = result.getData();
		this.search.groupId = this.groups[0] && this.groups[0].id;
		this.clickSearchBtn();
	}
}
</script>
