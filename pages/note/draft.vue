
<template>
	<editors __style__="codemirror" :__default_data__="editorsCodemirrorData"></editors>
</template>

<script>

export default {
	data: function() {
		return {
			storageKey: "__note_draft_value__",
			editorsCodemirrorData: {
				change: val => this.change(val),
				inited: ref => this.editorInited(ref),
			}
		}
	},

	methods: {
		change(val) {
			if (this.timer) return;
			this.timer = setTimeout(() => {
				const value = this.editorsCodemirrorData.ref.getValue();
				g_app.storage.localStorageSetItem(this.storageKey, value);
				this.timer = undefined;
			}, 3000);
		},

		editorInited(ref) {
			this.editorsCodemirrorData.ref = ref;
			const val = g_app.storage.localStorageGetItem(this.storageKey) || {};
			ref.setValue(val);
		}
	}, 

	mounted() {
	}
}

</script>
