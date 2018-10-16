
<template>
	<div :style="__data__.style" v-text="__data__.text.text">
	</div>
</template>

<script>

import mod from "@/components/mods/common/mod.js";
export default {
	mixins:[mod],
	props: {
		__data_type__: {
			type:Object, 
			default: function() {
				return {
					label: "titles",
					type: "object",
					items: {
						text: {
							label: "标题",
							type: "text",
						},
						style: {
							label: "样式",
							type:"object",
						},
					}
				}
			}
		},
		__default_data__: {
			type: Object,
			default: function() {
				return {
					text: {
						text: "标题",
					},
					style: {
					}
				}
			}
		},
	},
}
</script>
