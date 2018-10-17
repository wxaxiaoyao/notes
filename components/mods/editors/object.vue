
<template>
	<div class="editors-object-container">
		<div class="vertical-container">
			<div class="vertical-data-nav-container">
				<el-tree 
					:data="datatrees" 
					:default-expand-all="true"
					@node-click="selectNode">
					<span class="custom-node" slot-scope="{node, data}">
						<span>{{node.label}}</span>
						<span class="node-btn-container" v-if="node.level > 1">
							<i @click.stop="clickAddListItem(data, node)" v-if="data.type == 'list'" class="el-icon-plus" data-toggle="tooltip" title="添加"></i>
							<i @click.stop="deleteNode(data, node)" v-if="node.parent.data.type == 'list'" class="el-icon-minus" data-toggle="tooltip" title="删除"></i>
						</span>
					</span>
				</el-tree>
			</div>
			<div class="vertical-data-editor-container">
				<editors v-if="currentDataItem.style" :__style__="currentDataItem.style" :__default_data__="currentDataItem"></editors>
			</div>
		</div>
	</div>
</template>

<script>
				//<dataEditor :data="dataItem || __data__"></dataEditor>
import _ from "lodash";
import {
	Tree,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";

import dataEditor from "./dataEditor.vue";

export default {
	mixins:[mod],
	components: {
		[Tree.name]: Tree,
		dataEditor,
	},

	data: function() {
		return {
			currentDataItem:{style:null, data:{}, type:{}},
			datatrees:[],
			typestyle: {
				"text":"text",
				"link":"link",
			},
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					style: "horizontal",
					data: {
						text: {
							text: "hello world",
						},
						link: {
							text: "link text",
							href: "link href",
						},
						list: [
						{
							text: "list item text",
						},
						{
							text: "list item text",
						},
						],
						objectlist: [
						{
							text:{
								text:"object list hello world"
							}
						}
						],
						"object": {
							text: {
								text:"object text",
							},

							link: {
								text:"object link text",
								href:"object link href",
							},
						}
					},
					type: {
						label:"object",
						type: "object",
						subtype: {
							text: {
								label:"文本",
								type:"text",
							},
							link: {
								label: "link",
								type: "link",
							},
							list: {
								label: "list",
								type: "list",
								subtype: {
									label:"listitem",
									type: "text",
								}
							},
							objectlist: {
								label: "list",
								type: "list",
								subtype: {
									label:"objectitem",
									type: "object",
									subtype: {
										text: {
											label:"text",
											type:"text",
										}
									}
								}
							},
							"object": {
								label:'object',
								type: "object", 
								subtype: {
									text: {
										label: "text",
										type:"text",
									},
									link: {
										label:"link",
										type: "link",
									}
								}
							}

						},
					},
				}

			}
		},
	},

	watch: {
	},

	filters: {
	},

	methods: {
		getTypeData(type) {
			if (type.type == "list") return [];

			const data = {};
			if (type.type == "object")for (let key in type.subtype) data[key] = this.getTypeData(type.subtype[key]);
	
			return data;
		},
		treenode(type, data) {
			const self = this;
			const node = {
				label: type.label,
				type: type.type,
				subtype: type.subtype,
				key: type.key,
				data: data,
			}

			if (node.type != "object" && node.type != "list") {
				return node;
			}

			const children = [];
			_.each(data, (val, key) => {
				let subtype = node.type == "list" ? type.subtype : type.subtype[key];
				if (!subtype) return;

				subtype = _.cloneDeep(subtype);
				subtype.key = (node.key ? (node.key + ".") : "") + key;
				children.push(self.treenode(subtype, val));
			});

			node.children = children;

			return node;
		},
		parseDataType() {
			const data = this.__data__.data;
			const datatype = this.__data__.type;

			const trees = [this.treenode(datatype, data)];
			this.$emit("selectDataItem", trees[0]);

			console.log(trees);
			return trees;
		},
		clickAddObjectItem() {

		},

		selectNode(data, node) {
			this.currentDataItem.data = data.data;
			this.currentDataItem.style =  this.typestyle[data.type];
			console.log(this.currentDataItem);
		},

		clickAddListItem(data, node) {
			const subtype = data.subtype;
			const subdata = this.getTypeData(subtype);

			subtype.key = data.key + "." + data.data.length;

			data.data.push(subdata);
			data.children.push(this.treenode(subtype, subdata));
		},
		deleteNode(data, node) {
			const parent = node.parent;
			const parentData = parent.data;
			const children = parentData.children || [];
			const index = children.findIndex(d => d.key === data.key);
			children.splice(index, 1);
			const key = data.key.substring(data.key.lastIndexOf(".") + 1);
			if (parentData.type == "list") {
				parentData.data.splice(index, 1);
			} else {
				vue.delete(parentData.data, key);
			}

		}
	},
	mounted() {
		this.datatrees = this.parseDataType();
		//console.log(this.trees);
	}
}
</script>

<style>
</style>

<style scoped>
.horizontal-container {
	display: flex;	
}
.horizontal-data-nav-container {
	min-width: 300px;	
}
.horizontal-data-editor-container {
	flex:1;
}
.vertical-container {

}
.vertical-data-nav-container {
}
.vertical-data-editor-container {

}
</style>
