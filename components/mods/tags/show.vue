<template>
	<div class="tags-show-container">
		<el-tag v-for="(tag, index) in __data__.tags" :key="index" :color="__data__.color" disable-transitions=false>
			{{tag}}
		</el-tag>
	</div>
</template>

<script>
import {
	Tag,
} from "element-ui";

import mod from "@/components/mods/common/mod.vue";
export default {
	mixins: [mod],
	components: {
		[Tag.name]: Tag,
	},

	data: function() {
		return {
			isShowInputTag:false,
			tag: "",
		}
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					tags:[],
				}
			}
		}
	},

	methods: {
	},

	mounted() {
	}
}

</script>

<style lang="scss">
.tags-show-container {
	.el-tag + .el-tag {
		margin-right: 10px;
	}
}
</style>

<style scoped>
</style>
