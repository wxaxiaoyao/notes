
<template>
	<div class="issues-container">
		<el-dialog title="新增问题" :visible.sync="isShowNewIssue">
			<issues __style__="new" :__default_data__="issuesData"></issues>
		</el-dialog>
		<div class="issue-list-container">
			<div class="issue-list-header">
				<div>
					<span @click="getOpenIssueList" class="issue-state-count" :class="{'issue-state-count-active': state == 0}"><i class="iconfont icon-warn"></i>{{" " + openCount + " 进行中"}}</span>
					<span @click="getClosedIssueList" class="issue-state-count" :class="{'issue-state-count-active': state == 1}"><i class="iconfont icon-ok"></i>{{" " + closedCount + " 完成"}}</span>
				</div>
				<div class="issue-list-header-right-container">
					<el-input @keyup.native.enter="search" placeholder="标题过滤" v-model="title" suffix-icon="el-icon-search" class="issue-search"></el-input>	
					<el-button type="text" icon="iconfont icon-plus" @click="clickNewIssueBtn" data-toggle="tooltip" title="新增"></el-button>
				</div>
			</div>
			<div class="issue-list-body">
				<el-collapse accordion v-model="activeName">
					<el-collapse-item v-for="(x, i) in __data__.issues" :key="i" :name="x.id">
						<template slot="title">
							<div class="issue-item-container">
								<div class="issue-item-left-container">
									<i class="iconfont" :class="[x.state ? 'icon-ok' : 'icon-warn']"></i>
									<div>
										<div class="issue-title">
											<span>{{x.title}}</span>
										</div>
										<div class="issue-subtitle">
											<span>{{subtitle(x)}}</span>
											<el-tag v-for="(tag, i) in x.tags" :key="i" color="#EEEEEE" size="mini" class="tag">{{tag}}</el-tag>
										</div>
									</div>
								</div>
								<div class="issue-item-right-container">
									<img v-for="(assign, i) in x.assigns" :key="i" :src="assign.portrait" class="portrait">
									<el-button class="issue-close-btn" type="text" @click.stop="clickIssueCloseBtn(x, i)">{{x.state ? "打开" : "关闭"}}</el-button>
								</div>
							</div>
						</template>
						<div v-if="activeName == x.id">
							<div>{{x.content}}</div>
							<comments :__default_data__='{objectId:x.id, objectType:objectType}'></comments>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
	</div>
</template>

<script>
import {
	Dialog,
	Collapse,
	CollapseItem,
	Tag,
} from "element-ui";
import _ from "lodash";
import mod from "@/components/mods/common/mod.vue";
export default {
	mixins: [mod],

	components: {
		[Dialog.name]: Dialog,
		[Collapse.name]: Collapse,
		[CollapseItem.name]: CollapseItem,
		[Tag.name]: Tag,
	},

	data: function() {
		const self = this;
		return {
			activeName:"",
			isShowNewIssue: false,
			issuesData: {
				cbNew: issue => self.newIssue(),
			},
			objectType: 4,
			openCount: 0,
			closedCount: 0,
			title:"",
			state: 0,
		}
	},
	
	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					objectId:1,
					objectType:1,

					issues: [
					{
						title:"hackcon代码节",
						id:1,
						user:{username:"xiaoyao"},
						tags:["程序", "开发"],
						createdAt: "2018-09-07",
						assigns:[{
							portrait:"",
							username:"",
						}],
					},
					]
				}
			}
		}
	},

	watch: {
		"__data__.objectId": function() {
			this.parseData();
		},
		"__data__.objectType": function() {
			this.parseData();
		},
	},

	methods: {
		subtitle(x) {
			const timestr = g_app.util.timespan(x.createdAt);
			return `#${x.id} ${timestr} ${x.user.username} 创建`;
		},

		async parseData(){
			await this.getStatistics();
			await this.getIssues({state:this.state});
		},

		clickNewIssueBtn() {
			const self = this;
			this.issuesData = {	cbNew: issue => self.newIssue()},
			this.isShowNewIssue = true;
		},

		async newIssue(issue) {
			this.isShowNewIssue = false;
			await this.getIssues({state:this.state}, {cache: false});
		},

		async clickIssueCloseBtn(issue, index){
			let state = issue.state;
			if (issue.state) {
				this.closedCount--;
				this.openCount++;
				state = 0;
			} else {
				this.closedCount++;
				this.openCount--;
				state = 1;
			}
			this.__data__.issues.splice(index, 1);
			await this.api.issues.update({id:issue.id, state});
		},

		async getStatistics() {
			const self = this;
			const {objectId, objectType} = this.__data__;
			if (!objectId || !objectType) return;
			const result = await this.api.issues.statistics({objectId, objectType});
			const list = result.data || [];
			_.each(list, o => {
				if (o.state == 0) self.openCount = o.count;
				if (o.state == 1) self.closedCount = o.count;
			});
		},

		async getOpenIssueList() {
			this.state = 0;
			await this.getIssues({state:0});
		},

		async getClosedIssueList() {
			this.state = 1;
			await this.getIssues({state:1});
		},

		async search() {
			this.state = undefined;
			await this.getIssues({"title-like": "%" + this.title + "%"});
		},

		async getIssues(query = {}, option = {}) {
			const {objectId, objectType} = this.__data__;
			if (!objectId || !objectType) return;
			query.objectId = objectId;
			query.objectType = objectType;

			const result = await this.api.issues.get(query, option);
			const list = result.data || [];

			_.each(list, o => o.tags = o.tags.split("|").filter(val => val));

			this.$set(this.__data__, "issues", list);
		},
	},

	async mounted() {
		await this.parseData();
	},
}
</script>

<style>
.issues-container .el-collapse-item__header {
	display:flex;
	position: relative;
	align-items: center;
	height: auto;
	line-height: normal;
}
.issues-container .el-collapse-item__arrow {
	position: absolute;
	right:8px;
	line-height: normal;
}
</style>
<style scoped>
.issue-list-container {

}

.issue-list-header {
	display:flex;
	justify-content: space-between;
	align-items: center;
	padding-right:16px;
}

.issue-list-body {

}
.issue-item-container {
	flex:1;
	display:flex;
	justify-content: space-between;
	align-items: center;
	padding: 6px 0px;
}
.issue-item-left-container {
	display:flex;
	justify-content: space-between;
	align-items: center;
}
.issue-item-left-container>i {
	margin-right:5px;
}
.issue-title {
	font-size:18px;
	font-weight: bold;
	padding:4px 0px;
}
.issue-state-count {
	margin-right:10px;
	cursor: pointer;
}
.issue-state-count-active {
	font-weight: bold;
}
.issue-list-header-right-container {
	display: flex;
}
.issue-search {
	margin-right: 10px;
}
.tag {
	color: RGB(171,174,179);
	margin-left: 4px;
}
.issue-item-right-container {
	display:flex;
	align-items: center;
	margin-right:40px;
}
.issue-close-btn {
	margin: 0px 10px;
}
.portrait {
	width: 30px;
	height: 30px;
	border-radius: 50%;
}
</style>
