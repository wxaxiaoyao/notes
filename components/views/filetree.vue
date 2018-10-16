<template>
	<div class="kp_forbit_copy" style="margin-bottom:60px">
		<pages __style__="recent"></pages>
		<pages v-show="mode == 'normal'" mode="normal" __style__="tree"></pages>
		<pages v-show="mode == 'privacy'" mode="privacy" __style__="tree"></pages>
	</div>
</template>


<script>
import {
	Tag,
	Form,
	FormItem,
	Input,
	Button,
	Dialog,
	Select,
	Option,
	Tree,
	Loading,
	Message,
} from "element-ui";
import vue from "vue";
import _ from "lodash";
import config from "@/config.js";
import util from "@/lib/util.js";
import component from "@/components/component.js";

vue.use(Loading.directive);

export default {
	mixins: [component],
	components:{
		[Tag.name]: Tag,
		[Button.name]: Button,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Dialog.name]: Dialog,
		[Select.name]: Select,
		[Option.name]: Option,
		[Tree.name]: Tree,
		[Input.name]: Input,
	},
	data: function(){
		return {
			openedPages:{},
			isShowNewFile:false,
			isShowPageSetting: false,
			isShowInputTag: false,
			tag: "",
			pageSetting: {},
			newFileForm:{ type:"pages", isLoading:false },
			sites: {},
			pages: {},
			page: {}, // 当前页面
			trees:[],
			treeprops: {
				isLeaf: (data, node) => {
					return data.type == "pages";
				}
			}
		};
	},

	props: {
		__data__: {
			type: Object,
			default: function() {
				return {
					mode: "normal",
				}
			}
		}
	},

	watch: {
		"__data__.mode": function(){
			console.log('--------------');
			this.switchMode();
		},
	},

	computed: {
		mode() {return this.__data__.mode;},

		isPrivacyMode() {
			return this.__data__.mode == "privacy";
		},

		treedata() {
			return this.isPrivacyMode ? this.trees : [];
		},

		username() {
			return this.user.username;
		},

		openedPageTree() {
			let tree = {label:"已打开页面", type:"folders", path:"",children:[]};
			for (var key in this.openedPages) {
				if (!this.openedPages[key]) {
					continue;
				}
				tree.children.push(this.openedPages[key]);
			}
			if (this.page && this.page.path) this.setCurrentItem(this.page.path);
			return [tree];
		},

		__currentUrl__() {
			return this.getData("__currentUrl__");
		}
	},

	methods: {
		async switchMode() {
			this.loadOpenedPages();

			if (this.isPrivacyMode && !this.loadedPrivacyData) {
				await this.loadPrivacyData();
			}

			window.location.hash = "";
		},

		async loadPrivacyData() {
			const self = this;
			const urlPrefix = this.user.username + "/";
			const result = await this.api.pages.get({visibility:0, urlPrefix});
			const files = result.data || [];
			const rootnode = self.fileToPage({url: urlPrefix});
			const trees = [rootnode];
			rootnode.children = [];
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
						const page = self.fileToPage({url});
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
			console.log(trees);
		},

		getPageByPath(path) {
			return this.pages[path];
		},

		saveOpenedPages(mode) {
			const key = this.user.username + "-" + (mode || this.mode) + "-openedFileList";
			const openedFileList = [];
			_.each(this.openedPages, val => {
				openedFileList.push({
					id: val.id,
					url: val.url,
					//hash: "session",
					hash: val.hash,
				});
			});
			g_app.storage.sessionStorageSetItem(key, openedFileList);
		},

		showInputTag() {
			this.isShowInputTag = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		
		handleInputTagConfirm() {
			const index = _.findIndex(this.pageSetting.tags, tag => this.tag == tag);
			if (index < 0 && this.tag) this.pageSetting.tags.push(this.tag);

			this.isShowInputTag = false;
			this.tag = "";
		},

		handleCloseTag(index) {
			this.pageSetting.tags.splice(index,1);
		},	

		async clickSubmitPageSettingBtn() {
			console.log(this.pageSetting);
			await this.api.pages.setSetting(this.pageSetting);
			this.isShowPageSetting = false;
		},

		async clickPageSettingBtn(page) {
			const result = await this.api.pages.getSetting({id:page.id});
			const data = result.getData() || {};
			this.isShowPageSetting = true;
			this.pageSetting = {
				tags: data.tags || [], 
				key: data.key,
				title: data.title,
				description: data.description,
				keywords: data.keywords,
				id: data.id,
			};
		},

		async getSites() {
			const self = this;
			const result = await this.api.sites.get({owned: true});
			const sites = result.getData();
			sites.forEach(site => {
				site.name = site.sitename;
				site.type = "folders";
				site.path = self.user.username + "/" + site.sitename;
				this.sites[site.sitename] = site;
			});
			return sites;
		},

		fileToPage(file) {
			const self = this;
			const url = file.url;
			const path = _.endsWith(url, "/") ? url : url + ".md";
			const paths = path.split("/");
			const page = {};
			const type = _.endsWith(url, "/") ? "folders" : "pages";
			page.id = file.id;
			page.url = file.url;
			page.path = path;
			page.hash = file.hash;
			page.label = _.endsWith(url, "/") ? paths[paths.length-2] : paths[paths.length-1];
			page.type = type;
			page.username = paths[0];
			page.label = page.label.replace(/\..*$/, "");
			page.folder = util.getFolderByKey(url);

			page.setRefresh = function(x){
				const key = this.path;
				let node = self.$refs.filetree.getNode(key);
				vue.set(node || {}, "isRefresh", x);
				node = self.$refs.openedTreeComp.getNode(key);
				vue.set(node || {}, "isRefresh", x);

				vue.set(this, "isRefresh", x);
				//this.isRefresh = x;
			}
			page.setModify = function(x) {
				const key = this.path;
				let node = self.$refs.filetree.getNode(key);
				vue.set(node || {}, "isModify", x);
				node = self.$refs.openedTreeComp.getNode(key);
				vue.set(node || {}, "isModify", x);

				vue.set(this, "isModify", x);
				//this.isModify = x;
			}

			self.pages[path] = page;
			//console.log(page);
			return page;
		},

		async loadTreeNode(node, resolve) {
			const self = this;
			const username = self.user.username;
			const userId = self.user.id;
			//console.log(node);	
			if (node.level == 0) {
				return resolve([{
					label: "我的站点",
					path: username + "/",
					key: username + "/pages/",
					type: "folders",
					username,
				}, {
					label: "参与站点",
					path: "joins/",
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
					pages.push(self.fileToPage({url, hash:0}));
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
				nodes.push(self.fileToPage(files[i]));
			}

			resolve(nodes);
		},

		loadPage(page, cb, errcb) {
			const self = this;
			let _loadPageFromServer = async function() {
				console.log("服务器最新");
				const result = await self.api.pages.getById({id:page.id || page.url});
				const file = result.getData();
				if (!file && result.isErr()) {
					Message(result.getMessage());
					errcb && errcb();
					return;
				}
				page.id = file.id;
				page.hash = file.hash;
				if (typeof(file.content) != "string") {
					errcb && errcb();
					return;
				}
				page.content = file.content;
				cb && cb();
			}
			if (!g_app.pageDB) {
				page.setRefresh(false);
				return;
			}
			g_app.pageDB && g_app.pageDB.getItem(page.path).then(function(data){
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
					_.merge(page, data);
					cb && cb();
					return;
				} 

				_loadPageFromServer();
			}, function() {
				_loadPageFromServer();
			})
		},

		clickSelectPage(data, node) {
			var self = this;
			// 激活文件树项
			self.setCurrentItem(data.path);
			if (data.type == "folders") {
				return;
			}

			// 添加打开列表
			let page = this.getPageByPath(data.path);
			if (!page && data.url) {
				console.log("文件不存在:" + data.url);
				page = self.fileToPage({url: data.url});
				self.pages[page.path] = page;
			}

			self.$set(self.openedPages, page.path, page);

			const finish = function() {
				page.setRefresh(false);
				page.setModify(page.isModify);
				window.location.hash = "#" + page.url
				// 设置当前page
				self.emit(self.EVENTS.__EVENT__FILETREE__OUT__PAGE__, {
					namespace: self.namespace,
					page: page,
				});
				self.page = page;
				self.setData("__currentPage__", page);
				self.saveOpenedPages();
			}

			if (page.content == undefined) {
				page.setRefresh(true);
				this.loadPage(page, function() {
					finish();
				}, function(){
					finish();
				});
			} else {
				finish();
			}
		},

		clickCloseBtn(data) {
			const self = this;
			this.$delete(this.openedPages, data.path);
			if (data.path == this.page.path) {
				this.emit(this.EVENTS.__EVENT__FILETREE__OUT__PAGE__, {
					namespace: self.namespace,
					page: {},
				});
				let curKey = data.path.replace(/\/[^\/]*$/, "");
				this.setCurrentItem(curKey);

				this.page = {};
				this.setData("__currentPage__", this.page, true);
				window.location.hash = "";
		   } else {
				this.setCurrentItem(this.pagePath);
		   }
		},

		clickCloseAllBtn() {
			const self = this;
			this.openedPages = {};
			this.emit(this.EVENTS.__EVENT__FILETREE__OUT__PAGE__, {
				namespace: self.namespace,
				page: {},
			});
			this.page = {};
			this.setData("__currentPage__", this.page, true);
			window.location.hash = "";
		},

		setCurrentItem(path) {
			var self = this;
			setTimeout(function(){
				//console.log(path);
				self.$refs.filetree && self.$refs.filetree.setCurrentKey(path);
				self.$refs.openedTreeComp && self.$refs.openedTreeComp.setCurrentKey(path);
			}, 10);	
		},

		clickOpenBtn(data) {
			window.open(window.location.origin + "/" + data.url.replace(/\/$/, ""));
		},

		clickNewFileBtn(data, node) {
			this.isShowNewFile = true;
			this.newFileForm.data = data;
		},

		async clickSubmitNewFileBtn() {
			const self = this;
			const form = this.newFileForm;
			if (!form.filename) {
				this.$message("文件名不能为空");
				return;
			}
			const node = this.newFileForm.data;
			let url = node.path + form.filename + (form.type == "folders" ? "/" : "");
			let path = _.endsWith(url, "/") ? url : url + ".md";
			const page = this.getPageByPath(path);
			if (page && page.path) {
				this.$message("文件已存在");
				return;
			}
			let file = {
				url,
			    content:"",
			}
			let newpage = self.fileToPage(file);
			newpage.content = "";
			//console.log(newpage);
			self.pages[newpage.path] = newpage;
			form.isLoading = true;
			let result = await self.api.pages.create(newpage);
			const newfile = result.getData();
			newpage.id = newfile.id;
			newpage.hash = newfile.hash;

			self.$refs.filetree.append(newpage, node.path);
			this.isShowNewFile = false;
			form.isLoading = false;
			form.filename = "";
			setTimeout(function(){
				self.clickSelectPage({path});
			});
		},
		async clickDeleteBtn(data, node) {
			const self = this;
			const path = data.path;
			const filename = path.replace(".md", "");
			const confirmDelete = async () => {
				const page = self.getPageByPath(path);
				page.setRefresh(true);
				const result = await self.api.pages.delete({id:page.id});
				if (result.isErr()) {
					Message(result.getMessage());
				}
				g_app.pageDB.deleteItem(path);
				delete self.openedPages[path];
				delete self.pages[path];
				self.$refs.filetree.remove(path);
				self.$refs.openedTreeComp.remove(path);
				page.setRefresh(false);
			}
			this.$confirm(`此操作将删除该文件:${filename}, 是否继续?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				//center: true
			}).then(() => {
				confirmDelete();
			}).catch(() => {
			});
		},

		loadOpenedPages(mode) {
			const self = this;
			const key = this.user.username + "-" + (mode || this.mode) + "-openedFileList";
			const openedFileList = g_app.storage.sessionStorageGetItem(key) || [];

			self.openedPages = {};
			_.each(openedFileList, file => {
				const page = self.fileToPage(file);
				self.pages[page.path] = page;
				self.$set(self.openedPages, page.path, page);
			});
			//console.log(self.openedPages);
			setTimeout(function() {
				const hash = decodeURIComponent(window.location.hash || "");
				if (hash.indexOf("#") == 0) {
					const url = hash.substring(1);
					self.clickSelectPage({url});
				}
			});
		}
	},

	mounted() {
		this.switchMode();
	},

	created() {
	}
}
</script>

<style scoped>
.el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}

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
