
<template>
	<div>
		<el-input v-model="__data__.data.text"></el-input>
		<el-input v-model="__data__.data.link"></el-input>
		<el-checkbox v-model="__data__.data.target" true-label="_blank" false-label="_self">新窗口打开</el-checkbox>
	</div>
</template>

<script>
import _ from "lodash";
import {
	Checkbox,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";
export default {
	mixins:[mod],

	components: {
		[Checkbox.name]: Checkbox,
	},

	data: function() {
		return {

		};
	},

	props: {
		__default_data__: {
			type: Object, 
			default: function() {
				return {
					data: {
						text:"",
						link:"",
						target:"",
					},
					type: {

					}
				}
			}
		}
	},

}
</script>

<style>
</style>

<style scoped>
</style>
