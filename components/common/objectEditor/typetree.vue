
<template>
	<div class="data-nav-container">
		<el-tree 
			:data="trees" 
			:default-expand-all="true"
			@node-click="selectNode">
			<span class="custom-note" slot-scope="{node, data}">
				<span>{{node.label}}</span>
				<span class="node-btn-container" v-if="node.level > 1">
					<i @click.stop="clickAddListItem(data, node)" v-if="data.type == 'list'" class="el-icon-plus" data-toggle="tooltip" title="添加"></i>
					<i @click.stop="deleteNode(data, node)" v-if="node.parent.data.type == 'list'" class="el-icon-minus" data-toggle="tooltip" title="删除"></i>
				</span>
			</span>
		</el-tree>
	</div>
</template>

<script>
import {
	Tree,
	Checkbox,
	Form,
	FormItem,
	Select,
	Option,
} from "element-ui";
import {mapActions, mapGetters} from "vuex";
import _ from "lodash";

export default {
	components: {
		[Tree.name]: Tree,
		[Checkbox.name]: Checkbox,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Select.name]: Select,
		[Option.name]: Option,
	},

	data: function() {
		return {
			listModel: {},
			objectModel: {},
			currentData: {},
			types: [
			{
				type: "text",
				label: "文本",
			},
			{
				type: "link",
				label: "链接",
			},
			{
				type: "list",
				label: "列表",
			},
			{
				type: "object",
				label: "对象",
			},
			],
			trees:[],
		}
	},

	props: {
		__data_type__: {
			type:Object,
			default: function() {
				return {};
			}
		},
		__data__: {
			type:Object,
			default: function() {
				return {};
			}
		},
	},

	watch: {
		__data_type__: function() {
			//this.trees = this.parseDataType();
		},
		__data__: function() {
			this.trees = this.parseDataType();
			//console.log(this.trees);
		}
	},

	methods: {
		treenode(type, data) {
			const self = this;
			const node = {
				label: type.label,
				type: type.type,
				subtype:type.item,
				items: type.items,
				key: type.key,
				data: data,
			}

			if (node.type != "object" && node.type != "list") {
				return node;
			}

			const children = [];
			_.each(data, (val, key) => {
				let item = node.type == "list" ? type.item : type.items && type.items[key];
				if (!item) return;

				item = _.cloneDeep(item);
				item.key = (node.key ? (node.key + ".") : "") + key;
				children.push(self.treenode(item, val));
			});

			node.children = children;

			return node;
		},
		parseDataType() {
			//console.log(this.__data_type__, this.__data__);
			const data = this.__data__;
			const datatype = this.__data_type__;

			const trees = [this.treenode(datatype, data)];
			this.$emit("selectDataItem", trees[0]);

			return trees;
		},
		clickAddObjectItem() {

		},

		selectNode(data, node) {
			//console.log(data);
			this.$emit("selectDataItem", data);
		},

		clickAddListItem(data, node) {
			const subdata = {};
			const subtype = data.subtype;

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
		this.trees = this.parseDataType();
		//console.log(this.trees);
	}
}
</script>

<style scoped>
.data-nav-container {
}
.custom-note {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
}

.node-btn-container {

}
</style>
