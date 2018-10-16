
<template>
	<div>
		<dialogs __style__="pageSetting" :__default_data__="pageSettingData"></dialogs>
		<dialogs __style__="newpage" :__default_data__="newpageData"></dialogs>
		<el-tree ref="tree" :data="trees" node-key="url" :highlight-current="true" @node-click="clickSelectPage">
			<span class="custom-tree-node" slot-scope="{node, data}">
				<span v-if="isFolder(data.url)" class="custom-tree-node">
					<span>
						<!--<i class="iconfont icon-folder"></i>-->
						<span>{{data.label}}</span>
					</span>
					<span v-if="node.level > 1" class="tree-node-btn-group">
						<i v-if="node.level == 2" class="iconfont icon-open" @click.stop="clickOpenBtn(data, node)"></i> 
						<i class="iconfont icon-plus" @click.stop="clickNewFileBtn(data, node)"></i> 
						<i v-if="node.level>2 && node.childNodes.length == 0" class="iconfont icon-delete" @click.stop="clickDeleteBtn(data, node)"></i> 
					</span>
				</span>
				<span v-else class="custom-tree-node" data-toggle="tooltip" :title="data.url">
					<span class="tree-node-text">
						<i v-show="data.isConflict" @click="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
						<i v-show="!data.isConflict" :class='data.isRefresh ? "el-icon-loading" : data.isModify ? "iconfont icon-edit" : "iconfont icon-file"'></i>
						<span>{{data.label}}</span>
					</span>
					<span class="tree-node-btn-group">
						<i @click.stop="clickOpenBtn(data)"class="iconfont icon-open" aria-hidden="true" data-toggle="tooltip" title="访问"></i>
						<i @click.stop="clickPageSettingBtn(data)"class="iconfont icon-setting" aria-hidden="true" data-toggle="tooltip" title="设置"></i>
						<!--<i @click.stop="clickGitBtn(data)" class="fa fa-git" aria-hidden="true" data-toggle="tooltip" title="git"></i>-->
						<i @click.stop="clickDeleteBtn(data, node)" class="iconfont icon-delete" aria-hidden="true" data-toggle="tooltip" title="删除"></i>
					</span>
				</span>
			</span>
		</el-tree>
	</div>
</template>

<script>
import {
	Tag,
	Form,
	FormItem,
	Dialog,
	Select,
	Option,
	Switch,
	Loading,
	Tree,
} from "element-ui";
import vue from "vue";
import _ from "lodash";
import config from "@/config.js";

import common from "./common.js";
export default {
	mixins:[common],

	components:{
		[Tag.name]: Tag,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Dialog.name]: Dialog,
		[Select.name]: Select,
		[Option.name]: Option,
		[Tree.name]: Tree,
		[Switch.name]: Switch,
	},

	data: function() {
		return {
			treeprops: {
				isLeaf: (data, node) => {
					return !_.endsWith(data.url, "/");
				}
			},
			trees:[],
			newpageData: {visible: false},
		};
	},

	computed: {
		isPrivacyMode() {
			return this.mode == "privacy";
		},
		currentPage() {
			if (!this.currentUrl) return {};
			return this.pages[this.currentUrl] || {};
		},
	},

	watch: {
		currentUrl: function(url) {
			if (!url) return;

			const self = this;

			const page = self.pages[url] || {url};
			self.clickSelectPage(page);

			setTimeout(function(){
				self.$refs.tree && self.$refs.tree.setCurrentKey(url);
			}, 10);	
		}
	},

	methods: {
		clickNewFileBtn(data, node) {
			const self = this;
			this.newpageData = {
				visible: true,
				type: "0",
				folder: data.url,
				filename:"",
				succes: (page) => {
					const node = self.pageToNode(page);
					self.$refs.tree.append(node, data.url);
					setTimeout(function(){
						self.clickSelectPage(node);
					});
				}
			}
		},

		clickDeleteBtn(data) {
			console.log("click delete page");
			const self = this;
			const url = data.url;
			const confirmDelete = async () => {
				const page = self.pages[url];
				page.isRefresh = true;;
				const result = await self.api.pages.delete({id:page.id});
				if (result.isErr()) return Message(result.getMessage());
				page.isRefresh = false;
				g_app.pageDB.deleteItem(url);
				self.setPageOperate({url, operate:"delete", mode: self.mode});
			}
			this.$confirm(`此操作将删除该文件:${url}, 是否继续?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				confirmDelete();
			}).catch(() => {
			});
		},

		clickFixedConflict(data) {
			
		},
	},

	mounted() {
		this.loadPageTrees();
	}
}
</script>

<style scoped>
.custom-tree-node {
	flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.custom-tree-node i {
	margin-right:2px;
}
.tree-node-text {
	flex:8;
	text-overflow:ellipsis;
	overflow-x: hidden;
}
.tree-node-btn-group {
	flex:2;
	display:none;
}
.custom-tree-node:hover .tree-node-btn-group {
	display:flex;
	justify-content:flex-end;
}
</style>
