
<template>
	<div>
		<el-form v-model="__data__.data" label-width="80px">
			<el-form-item v-for="(x, i) in fields" :key="i" :label="x.label">
				<el-input v-model="__data__.data[x.fieldkey]"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import _ from "lodash";
import {
	Form,
	FormItem,
} from "element-ui";
import {mapActions, mapGetters} from "vuex";

import mod from "@/components/mods/common/mod.js";
export default {
	mixins:[mod],
	
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
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
						
					},
					subtype: {

					},
				}
			}
		}
	},

	computed: {
		fields() {
			const subtype = this.__data__.subtype;
			const fields = [];
			_.each(subtype, (val, key) => fields.push({...val, fieldkey: key}));
			_.orderBy(fields, ["order", "type"], ["asc", "desc"]);

			return fields;
		}
	}
}
</script>

<style>
</style>

<style scoped>
</style>
