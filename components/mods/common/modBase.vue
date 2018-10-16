
<template>
	<component 
		ref="self"
		v-if="__mode__ == 'editor'"
		@click.native.stop="clickBaseComp"
		class="baseCompContainer"
		:class='{"actived": __isActived__}'
		:is="$options.components.baseComp" 
		:__default_data__="__default_data__"
	    :__data_type__="__data_type__"
		:__key__="__key__"
		:__mode__="__mode__"
		v-bind="$attrs"
		v-on="$listeners">
		<slot></slot>
	</component>
	<component 
		v-else
		:is="$options.components.baseComp" 
		:__default_data__="__default_data__"
	    :__data_type__="__data_type__"
		:__key__="__key__"
		:__mode__="__mode__"
		v-bind="$attrs"
		v-on="$listeners">
		<slot></slot>
	</component>
</template>

<script>

export default {
	inheritAttrs: false,
	components: {
	},

	data: function() {
		return {
		}
	},

	props: {
	},

	methods: {
		clickBaseComp() {
			const self = this.$refs.self;
			self.setCurrentMod();
			self.setData("editorActiveTab", "baseCompEditor");
		}

	},

	computed: {
	},

	mounted() {
	},
}
</script>

<style scoped>
.actived {
	border: 1px solid gray;
}

.baseCompContainer {
	cursor: pointer;
}
</style>
