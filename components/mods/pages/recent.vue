
<template>
	<div>
		<dialogs __style__="pageSetting" :__default_data__="pageSettingData"></dialogs>
		<el-tree ref="tree" :data="treedata"  node-key="url" :default-expand-all="true" :highlight-current="true" @node-click="clickSelectPage">
			<span class="custom-tree-node" slot-scope="{node, data}">
				<span v-if="isFolder(data.url)" class="custom-tree-node">
					<span>
						<!--<i class="iconfont icon-folder"></i>-->
						<span>{{data.label}}</span>
					</span>
					<span class="tree-node-btn-group">
						<i @click.stop="clickCloseAllBtn()" class="iconfont icon-close" aria-hidden="true" data-toggle="tooltip" title="关闭全部"></i>
					</span>
				</span>
				<span v-else class="custom-tree-node" data-toggle="tooltip" :title="data.url">
					<span class="tree-node-text">
						<i v-show="data.isConflict" @click="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
						<i v-show="!data.isConflict" :class='data.isRefresh ? "el-icon-loading" : data.isModify ? "iconfont icon-edit" : "iconfont icon-file"'></i>
						<span>{{data.label || data.url}}</span>
					</span>
					<span class="tree-node-btn-group">
						<i @click.stop="clickOpenBtn(data)"class="iconfont icon-open" aria-hidden="true" data-toggle="tooltip" title="访问"></i>
						<i @click.stop="clickPageSettingBtn(data)"class="iconfont icon-setting" aria-hidden="true" data-toggle="tooltip" title="设置"></i>
						<!--<i @click.stop="clickGitBtn(data)" class="fa fa-git" aria-hidden="true" data-toggle="tooltip" title="git"></i>-->
						<i @click.stop="clickCloseBtn(data)" class="iconfont icon-close" aria-hidden="true" data-toggle="tooltip" title="关闭"></i>
					</span>
				</span>
			</span>
		</el-tree>
	</div>
</template>

<script>
import {
	Tree,
} from "element-ui";
import vue from "vue";
import _ from "lodash";
import config from "@/config.js";
import util from "@/lib/util.js";

import common from "./common.js";

export default {
	mixins:[common],

	components:{
		[Tree.name]: Tree,
	},

	data: function() {
		return {
			openedPages:{},
		}
	},

	props: {
	},

	computed: {
		treedata() {
			const tree = {label:"已打开页面", url:"/",children:[]};
			_.each(this.openedPages, page => tree.children.push(page));
			//console.log(tree);
			return [tree];
		},
	},

	watch: {
		currentUrl: function(url) {
			const self = this;
			if (!url || _.endsWith(url, "/")) return;
			const page = self.pages[url] || self.pageToNode({url});
			if (!self.openedPages[url] && page) {
				self.$set(self.openedPages, page.url, page);
				//self.openedPages[url] = self.pages[url];
				self.saveOpenedPages();
			}

			setTimeout(function(){
				self.$refs.tree && self.$refs.tree.setCurrentKey(url);
			}, 100);	
		},
		mode: function(newVal, oldVal) {
			this.saveOpenedPages(oldVal);
			this.loadOpenedPages(newVal);
		},
	},
	
	methods: {
		saveOpenedPages(mode) {
			const key = this.user.username + "-" + (mode || this.mode) + "-openedPageList";
			const openedFileList = [];
			_.each(this.openedPages, val => {
				openedFileList.push({
					id: val.id,
					url: val.url,
					hash: val.hash,
				});
			});
			g_app.storage.sessionStorageSetItem(key, openedFileList);
		},
		
		loadOpenedPages(mode) {
			const self = this;
			const key = this.user.username + "-" + (mode || this.mode) + "-openedPageList";
			const openedFileList = g_app.storage.sessionStorageGetItem(key) || [];

			self.openedPages = {};
			_.each(openedFileList, page => {
				const node = self.pageToNode(page);
				self.openedPages[page.url] = node;
				self.pages[page.url] = node;
			});
		},

		clickCloseBtn({url}) {
			this.$delete(this.openedPages, url);
			if (url == this.currentUrl) {
				this.setCurrentUrl("");
				window.location.hash = "";
		    } else {
				this.setCurrentUrl(this.currentUrl);
		    }
			this.saveOpenedPages();
		},

		clickCloseAllBtn() {
			this.openedPages = {};
			this.setCurrentUrl("");
			window.location.hash = "";
			this.saveOpenedPages();
		},

	},

	mounted() {
		const self = this;
		this.loadOpenedPages();
		this.on("__page_operate__", ({url, operate, mode}) => {
			if (self.mode != mode) return;
			if (operate == "hide" || operate == "delete") {
				self.$delete(this.openedPages, url);
				self.saveOpenedPages();
			}
		});
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
