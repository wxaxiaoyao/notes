import vue from "vue";
import vueClipboard from 'vue-clipboard2';
import VueLazyload from 'vue-lazyload';
import _ from "lodash";

import qiniuUpload from "@/api/qiniu.js";
import mod from "@/components/mods/common/mod.js";

vue.use(vueClipboard);
vue.use(VueLazyload);


export default {
	mixins: [mod],

	data: function() {
		return {
			query:{},
			fileSize:0,
			fileCount:0,
			filename:"",
			files:[],
			selections:[],
			dialogConfirmData: {},
			dialogRenameData:{},
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

	filters: {
		datetime(datestr) {
			return g_app.util.timespan(datestr);
		},
		typefilter(type) {
			if (type == "images") return "图片";
			if (type == "audios") return "音频";
			if (type == "videos") return "视屏";
			return "文件";
		},
		sizeFilter(size) {
			const K = 1024;
			const M = 1024 * K;
			const G = 1024 * M;
			if (size / G >= 1) return _.round(size/G, 2) + "G"; 
			if (size / M >= 1) return _.round(size/M, 2) + "M";
			if (size / K >= 1) return _.round(size/K, 2) + "K";

			return size + "B";
		}
	},

	methods: {
		nullfunc() {
		},

		getUrlByKey(key, filename) {
			let url = window.location.origin + "/" + key + "?" ;

			url += filename ? ("?" + filename) : "";

			return url;
		},

		clickTypeFilter(value, data) {
			return value == data.type;
		},

		search() {
			const self = this;
			this.files = _.filter(this.allfiles, file => file.key.indexOf(self.filename) >= 0);
		},

		clickCopyLinkBtn({key, filename}) {
			const self = this;
			const url = this.getUrlByKey(key);
			this.$copyText(url).then(function(e) {
				self.$message({message:"连接复制到剪切板成功", type:"success"});
			}, function(e){
				self.$message({message:"连接复制到剪切板失败", type:"error"});
			});
		},

		clickDownloadBtn({key, filename}) {
			window.open(this.getUrlByKey(key, filename));
		},
		
		clickDownloadSelectBtn() {
			const self = this;

			_.each(self.selections, o => {
				const url = window.location.origin + "/" + o.key + "?attname=test.jpg";
				window.open(url);
			});
		},

		async clickDeleteOperBtn(data) {
			const {key, filename} = data;
			const self = this;

			data.isShowPopoverOper = false;
			self.dialogConfirmData = {
				visible: true, 
				title:"文件删除",
				content: "确认删除文件" + filename + "?",
				success: async () => {
					const index = _.findIndex(self.files, f => f.key == key);
					if (index < 0) return;

					self.files.splice(index, 1);

					await self.api.files.batchDelete({keys:[key]});

					await self.statistics();
				}
			}
		},

		clickRenameOperBtn(data) {
			const {id, filename} = data;
			const self = this;

			data.isShowPopoverOper = false;
			self.dialogRenameData = {
				visible: true, 
				title:"重命名",
				name: filename,
				success: async (obj) => {
					const result = await self.api.files.rename({id, filename:obj.name});
					if (result.isErr()) {
						if (result.status == 409) {
							self.$message("文件名已存在");
							return;
						}
					}

					data.filename = obj.name;
				}
			}
		},

		async clickDeleteSelectBtn() {
			const self = this;
			self.dialogConfirmData = {
				visible: true, 
				title:"文件删除",
				content: "确认删除所选文件?",
				success: async () => {
					const keys = [];
					_.each(self.selections, o => {
						keys.push(o.key)
						const index = _.findIndex(self.files, f => f.key == o.key);
						if (index < 0) return;
						self.files.splice(index,1);
					});
					await self.api.files.batchDelete({keys});
					await self.statistics();
				}
			}
		},

		async getFiles() {
			const self = this;
			const result = await this.api.files.get(this.query);
			const list = result.data || [];

			_.each(list, file => {
				file.filename = file.key.substring(file.key.lastIndexOf("/") + 1);
				file.url = window.location.origin + "/" + file.key; 
				file.rename = async (filename) => {
					const result = await self.api.files.rename({id:file.id, filename});
					if (result.isErr()) return;
					file.filename = filename;
				}
				vue.set(file, "isShowPopoverOper", false);
			});

			this.allfiles = list;
			this.files = list;
		},

		async fileUpload(e) {
			//console.log(this.files, e.file);

			const filename = e.file.name;
			const type = g_app.util.getFileType(filename);
			const key = this.user.username + "/" + type + "/" + filename; 
			const file = {key, filename, type, size: e.file.size, percent: 0, status: null};

			if (_.findIndex(this.files, o => o.filename == filename) >= 0){
				return this.$message("文件已存在:" + filename);
			}

			this.files.splice(0, 0, file);
			const data = await qiniuUpload(key, e.file, null, file, {
				next(res) {
					file.percent = res.total.percent;
				},
				complete(data) {
					file.status = "success";
				},
				error() {
					file.status = "exception";
				}
			});
			if (!data) return file.status = "exception";

			const index = _.findIndex(this.files, file => file.key == key);
			if (index < 0) return;

			console.log(data);
			this.files.splice(index, 1, data);

			await this.statistics();
		},

		handleSelectionChange(selections) {
			this.selections = selections;
		},

		async statistics(){
			const result = await this.api.files.statistics();
			const data = result.data || {};

			this.fileSize = data.used || 0;
			this.fileCount = data.count || 0;
		}
	},

}
