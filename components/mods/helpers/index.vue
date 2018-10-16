
<template>
	<el-collapse>
		<el-collapse-item v-for="(x, i) in __data__.items" :key="i" :title="x.title.text">
			<div>{{x.description.text}}</div>
		</el-collapse-item>
	</el-collapse>
</template>

<script>
import {
	Collapse,
	CollapseItem,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	components: {
		[Collapse.name]: Collapse,
		[CollapseItem.name]: CollapseItem,
	},

	props: {
		__data_type__: {
			type:Object, 
			default: function() {
				return {
					label: "helpers",
					type: "object",
					items: {
						items: {
							label: "列表",
							type:"list",
							item: {
								label:"列表项",
								type: "object",
								items: {
									title: {
										label:"表题",
										type:'text',
									},
									description: {
										label: "描述",
										type: "text",
									}
								}
							}
						},
					}
				}
			}
		},
		__default_data__: {
			type: Object,
			default: function() {
				return {
					items: [
					{
						title: {
							text:"title",
						},
						description: {
							text:"description",
						},
					},
					],
				}
			}
		},
	},

	mounted() {
		//console.log(this.__data__);
	},
}
</script>

<style scoped>
</style>
