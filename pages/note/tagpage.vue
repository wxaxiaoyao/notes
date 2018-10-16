
<template>
	<div>
		<tag v-if="tag" :tag="tag"></tag>
		<div v-else>
		</div>
	</div>
</template>

<script>
import component from "@/components/component.js";
import tag from "@/components/mods/customs/tag.js";
import {tags} from "@/lib/tags";

export default {
	mixins: [component],
	components: {
		tag,
	},

	data: function() {
		return {
			tag:null,
		}
	},

	async mounted() {
		const params = this.$route.params;

		const result = await this.api.tags.getByName(params);
		if (result.isErr()) return;

		const tag = result.getData();
		console.log(tag.tag);
		this.tag = tags.getTagByTag(tag.tag);
	}
}
</script>
