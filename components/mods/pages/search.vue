
<template>
	<div>
		<el-select v-model="url" 
			style="width:400px"
			@change="switchPage"
			filterable 
			allow-create 
			default-first-option
			placeholder="页面url 如: username/dirname/filename">
			<el-option v-for="(page, i) in pagelist" :key="i" :value="page.url"></el-option>
		</el-select>
	</div>
</template>

<script>
import _ from "lodash";
import {
	Select,
	Option,
	Switch,
} from "element-ui";
import common from "./common.js";
export default {
	mixins:[common],

	components:{
		[Select.name]: Select,
		[Option.name]: Option,
		[Switch.name]: Switch,
	},

	data: function() {
		return {
			url:"",
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

	methods:{
		switchPage() {
		}
	},

	async mounted() {
		await this.loadPageTrees();
		console.log(this.pages);
	},
}
</script>

<style scoped>
</style>
