
<template>
	<div class="data-editor-container">
		<div v-if="data.type == 'text'">
			<el-input v-model="data.data.text"></el-input>
		</div>
		<div v-else-if="data.type == 'link'">
			<el-input v-model="data.data.text"></el-input>
			<el-input v-model="data.data.link"></el-input>
			<el-checkbox v-model="data.data.target" true-label="_blank" false-label="_self">新窗口打开</el-checkbox>
		</div>
		<div v-else-if="data.type == 'form'">
			<el-form v-model="data.data" label-width="80px">
				<el-form-item v-for="(item, key) in data.items" :key="key" :label="item.label">
					<el-input v-model="data.data[key]"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<div v-else-if="data.type == 'list'"> 
			<!--<el-button @click="clickAddListItem">增加列表项</el-button>-->
		</div>
		<div v-else-if="data.type == 'object'" style="display:flex"> 
			<!--<el-input v-model="objectModel.key"></el-input>-->
			<!--<el-input v-model="objectModel.label"></el-input>-->
			<!--<el-select v-model="objectModel.type">-->
				<!--<el-option v-for="(x, index) in types" :key="index" :value="x.type" :label="x.label">-->
				<!--</el-option>-->
			<!--</el-select>-->
			<!--<el-button @click="clickAddObjectItem">增加列表项</el-button>-->
		</div>
	</div>
</template>

<script>
import vue from "vue";
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
			objectModel:{},
			types: [
			{
				type:"text",
				label:"文本",

			}
			]
		};
	},

	props: {
		data:{
			type: Object,
			default: function() {
				return {};
			}
		}
	},

	methods: {
		clickAddObjectItem() {
		}
	}
}
</script>

<style scoped>
</style>
