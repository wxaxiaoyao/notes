
<template>
	<div>
		<el-input v-model="__data__.data.text"></el-input>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";
export default {
	mixins:[mod],

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
					}
				}
			}
		}
	}
}
</script>

<style>
</style>

<style scoped>
</style>
