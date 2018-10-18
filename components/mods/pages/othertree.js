
<template>
	<div>
		<dialogs __style__="pageSetting" :__default_data__="pageSettingData"></dialogs>
		<dialogs __style__="newpage" :__default_data__="newpageData"></dialogs>
		<el-tree ref="tree" :data="trees" :lazy="!isPrivacyMode" :load="loadTreeNode" :props="treeprops"
			node-key="url" :highlight-current="true" @node-click="clickSelectPage">
			<span class="custom-tree-node" slot-scope="{node, data}">
				<span v-if="data.type == 'folders'" class="custom-tree-node">
					<span>
						<!--<i class="iconfont icon-folder"></i>-->
						<span>{{data.label}}</span>
					</span>
					<span v-if="node.level > 1" class="tree-node-btn-group">
						<i v-if="node.level == 2" class="iconfont icon-open" @click.stop="clickOpenBtn(data, node)"></i> 
						<i class="iconfont icon-plus" @click.stop="clickNewFileBtn(data, node)"></i> 
						<i v-if="node.level>2 && node.loaded && node.childNodes.length == 0" class="iconfont icon-delete" @click.stop="clickDeleteBtn(data, node)"></i> 
					</span>
				</span>
				<span v-if="data.type == 'pages'" class="custom-tree-node">
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
import util from "@@/common/util.js";

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

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					mode: "normal",
				};
			}
		},
	},

	computed: {
		mode() {
			return this.__data__.mode;
		},
		isPrivacyMode() {
			return this.mode == "privacy";
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
		setCurrentContent(content) {
			this.setData("__currentContent__", content);
		},
		async loadPrivacyData() {
			const self = this;
			const urlPrefix = this.user.username + "/";
			const result = await this.api.pages.get({visibility:1, urlPrefix});
			const files = result.data || [];
			const rootnode = self.pageToNode({url: urlPrefix});
			const trees = [rootnode];
			rootnode.children = [];
			rootnode.label = "我的站点";
			self.pages[rootnode.path] = rootnode;
			_.each(files, file => {
				let urls = file.url.split("/");
				let nodes = trees;
				_.each(urls, (t, i) => {
					if (!t) return;

					const url = urls.slice(0, i + 1).join("/") + (urls.length - 1 == i ? "" : "/");
					//console.log(urls, url, i);
					const index	= _.findIndex(nodes, o => o.url == url);
					if (index < 0) {
						const page = self.pageToNode(url == file.url ? file : {url});
						self.pages[page.path] = page;
						page.children = [];
						nodes.push(page);
						nodes = page.children;
					} else {
						nodes = nodes[index].children;
					}
				});
			});

			this.trees = trees;
			//console.log(trees);
		},
		

		async loadTreeNode(node, resolve) {
			const self = this;
			const username = self.user.username;
			const userId = self.user.id;
			//console.log(node);	
			if (node.level == 0) {
				return resolve([{
					label: "我的站点",
					url: username + "/",
					key: username + "/pages/",
					type: "folders",
					username,
				}, {
					label: "参与站点",
					url: "joins/",
					key: "joins/pages/",
					type: "folders",
				}]);
			} else if(node.level == 1){
				const data = node.data;
				let sites = undefined;
				const pages = [];
				if (data.username) {
					sites = await self.api.sites.get();
				} else {
					sites = await self.api.sites.get({owned:false, membership:true});
				}
				sites = sites.getData() || [];
				_.each(sites, site => {
					//console.log(username, site.username, site.userId, userId);
					const url = (site.userId == userId ? username : site.username) + "/" + site.sitename + "/"; 
					pages.push(self.pageToNode({url, hash:0}));
				});
				//console.log(sites);
				return resolve(pages);
			}

			const nodeData = node.data;
			const nodeKey = nodeData.url;

			const result = await this.api.pages.get({folder:nodeKey});
			const files = result.getData() || [];
			const nodes = [];

			for (let i = 0; i < files.length; i++) {
				nodes.push(self.pageToNode(files[i]));
			}

			resolve(nodes);
		},

		loadPage(page, cb, errcb) {
			const self = this;
			let _loadPageFromServer = async function() {
				console.log("服务器最新");
				const result = await self.api.pages.getById({id:page.id || page.url});
				const file = result.data;
				if (result.isErr()) return errcb && errcb();
				page.id = file.id;
				page.hash = file.hash;
				page.folder = file.folder;
				vue.set(page, "content", file.content || "");
				cb && cb();
			}
			if (!g_app.pageDB) {
				page.isRefresh = false;
				console.log("Index DB uninit");
				return;
			}
			g_app.pageDB && g_app.pageDB.getItem(page.url).then(function(data){
				if (!data) {
					_loadPageFromServer();
					return;
				}
				if (data.hash == page.hash || page.isModify || page.hash == "session") {
					if (page.hash == "session") {
						console.log("session");
					} else if (data.hash == page.hash) {
						console.log("本地最新");
					} else {
						console.log("冲突");
					}
					//console.log(data);
					_.merge(page, data);
					cb && cb();
					return;
				} 

				_loadPageFromServer();
			}, function() {
				_loadPageFromServer();
			})
		},

		clickSelectPage(data) {
			console.log("click select page: ", data.url);
			const self = this;

			if (data.type == "folders") return;
			if (!data.url) return;

			// 添加打开列表
			let page = self.pages[data.url];
			if (page && page.type == "folders") return;
			if (!page && data.url) {
				page = self.pageToNode({url: data.url});
			}

			const finish = function(succes) {
				page.isRefresh = false;
				page.loading = false;
				if (!succes) {
					self.setCurrentUrl("");
					self.$message("页面加载失败");
					window.location.hash = ""; 
					return;
				}
				self.setCurrentUrl(page.url);
				window.location.hash = "#" + page.url
				self.setCurrentContent(page.content);
			}

			if (page.loading) return;

			page.isRefresh = true;
			page.loading = true;
			if (!page.content) {
				this.loadPage(page, function() {
					finish(true);
				}, function(){
					finish(false);
				});
			} else {
				finish(true);
			}
		},

		clickOpenBtn(data) {
			window.open(window.location.origin + "/" + data.url.replace(/\/$/, ""));
		},

		clickNewFileBtn(data, node) {
			const self = this;
			this.newpageData = {
				visible: true,
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
				if (result.isErr()) {
					Message(result.getMessage());
				}
				g_app.pageDB.deleteItem(url);
				self.$refs.tree.remove(url);
				page.isRefresh = false;
				self.setPageOperate({url, operate:"delete"});
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
		console.log(this.mode);
		if (this.mode == "privacy") this.loadPrivacyData();
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
