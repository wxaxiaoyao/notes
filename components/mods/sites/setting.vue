
<template>
	<div>
		<el-collapse>
			<el-collapse-item title="基本信息">
				<el-form ref="form" :model="site" label-width="80px">
					<el-form-item label="描述">
						<el-input v-model="site.description" placeholder="描述"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="clickSubmitBaseInfoBtn">提交</el-button>
					</el-form-item>
				</el-form>
			</el-collapse-item>
			<el-collapse-item title="站点组">
				<el-form :inline="true" ref="form" :model="siteGroup" class="demo-form-inline">
					<el-form-item label="组名">
						<el-select v-model="siteGroup.groupId" filterable placeholder="请选择组">
							<el-option v-for="(x, index) in groups" :key="index" :label="x.groupname" :value="x.id"></el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item label="权限">
						<el-select v-model="siteGroup.level" filterable placeholder="请选权限">
							<el-option v-for="(x, index) in levels" :key="index" :label="x.label" :value="x.value"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="clickSubmitSiteGroupBtn">提交</el-button>
					</el-form-item>
				</el-form>
				<el-table ref="groupTableCmp":data="siteGroups">
					<el-table-column fixed prop="id" label="ID"></el-table-column>
					<el-table-column fixed prop="groupname" label="组名"></el-table-column>
					<el-table-column fixed prop="levelName" label="权限"></el-table-column>
					<el-table-column fixed="right" label="操作">
						<template slot-scope="{row, $index}">
							<el-button type="text" @click="clickSiteGroupModifyBtn(row, $index)">修改</el-button>
							<el-button type="text" @click="clickSiteGroupDeleteBtn(row, $index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-collapse-item>
			<el-collapse-item title="站点成员">
				<el-form :inline="true" ref="form" :model="siteMember" class="demo-form-inline">
					<el-form-item label="成员ID">
						<el-input clearable v-model="siteMember.memberId" placeholder="成员ID"></el-input>
					</el-form-item>
					
					<el-form-item label="权限">
						<el-select v-model="siteMember.level" filterable placeholder="请选权限">
							<el-option v-for="(x, index) in levels" :key="index" :label="x.label" :value="x.value"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="clickSubmitSiteMemberBtn">提交</el-button>
					</el-form-item>
				</el-form>
				<el-table :data="siteMembers">
					<el-table-column fixed prop="id" label="ID"></el-table-column>
					<el-table-column fixed prop="memberId" label="成员ID"></el-table-column>
					<el-table-column fixed prop="levelName" label="权限"></el-table-column>
					<el-table-column fixed="right" label="操作">
						<template slot-scope="{row, $index}">
							<el-button type="text" @click="clickSiteMemberModifyBtn(row, $index)">修改</el-button>
							<el-button type="text" @click="clickSiteMemberDeleteBtn(row, $index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>

import {
	Collapse,
	CollapseItem,
	Form,
	FormItem,
	Table,
	TableColumn,
	Button,
	Input,
	Select,
	Option,
	Message,
} from "element-ui";

import _ from "lodash";
import mod from "@/components/mods/common/mod.vue";

export default {
	mixins: [mod],
	components: {
		[Collapse.name]: Collapse,
		[CollapseItem.name]: CollapseItem,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
		[Select.name]: Select,
		[Option.name]: Option,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},

	data: function() {
		return {
			sitename: "",
			site: {},
			sites: [],
			groups: [],
			siteGroup: {
				id: undefined,
				level: undefined,
				groupId: undefined,
			},
			siteGroups: [],
			siteMember: {
				level: undefined,
				memberId: undefined,
			},
			siteMembers: [],
			levels: [{
				value: 0,
				label: "禁止访问",
			}, {
				value: 32,
				label: "访问",
			}, {
				value: 64,
				label: "编辑",
			}],
			levelMap: {0:"禁止访问", 32: "访问", 64: "编辑"},
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					site: {},
				}
			}
		}
	},

	watch: {
		"__data__.site": function(site) {
			this.parseData();
		}
	},

	methods: {
		async parseData() {
			this.site = this.__data__.site;
			await this.getSiteGroups();
		},

		async getSiteGroups() {
			const self = this;
			// 获取站点组
			let siteGroups = await this.api.sites.groups({id: this.site.id});
			this.siteGroups = siteGroups.getData() || [];
			_.each(self.siteGroups, val => val.levelName = self.levelMap[val.level]);
		},

		async getSiteMembers() {
			const self = this;
			let siteMembers = await this.api.siteMembers.get();
			this.siteMembers = siteMembers.getData() || [];
			_.each(self.siteMembers, val => val.levelName = self.levelMap[val.level]);
		},

		clickSiteMemberModifyBtn(data) {
			this.siteMember.memberId = data.memberId;
			this.siteMember.level = data.level;
		},

		async clickSiteMemberDeleteBtn(data, index) {
			const result = await this.api.siteMembers.delete(data);
			if (result.isErr()) {
				return Message(result.getMessage());
			}

			this.siteMembers.splice(index,1);
		},

		clickSiteGroupModifyBtn(data, index) {
			this.siteGroup.id = data.id;
			this.siteGroup.groupId = data.groupId;
			this.siteGroup.level = data.level;
		},

		async clickSiteGroupDeleteBtn(data, index) {
			const result = await this.api.sites.deleteGroup({
				id: this.site.id, 
				groupId: data.groupId,
			});
			if (result.isErr()) {
				return Message(result.getMessage());
			}

			this.siteGroups.splice(index,1);
		},

		async clickSubmitSiteMemberBtn() {
			const siteMember = this.siteMember;
			siteMember.siteId = this.site.id;
			
			if (!siteMember.memberId) return Message("成员Id为空");

			const result = await this.api.siteMembers.upsert(siteMember);
			if (result.isErr()) return Message(result.getMessage());

			this.getSiteMembers();
		},

		async clickSubmitBaseInfoBtn() {
			const result = await this.api.sites.update(this.site);
			if (result.isErr()) {
				return Message(result.getMessage());
			}

			return Message("站点信息更新成功");
		},

		async clickSubmitSiteGroupBtn() {
			const siteGroup = this.siteGroup;
			siteGroup.siteId = this.site.id;
			//console.log(this.siteGroup);
			let oper = "createGroup";
			if (siteGroup.id) oper = "updateGroup";

			const result = await this.api.sites[oper]({id: this.site.id, groupId: siteGroup.groupId, level: siteGroup.level});
			if (result.isErr()) {
				Message(result.getMessage());
				return;
			}
			this.getSiteGroups();
			this.siteGroup = {};
		},
	},

	async mounted() {
		// 获取用户组
		let result = await this.api.groups.get();
		this.groups = result.data || [];
	},
}
</script>
