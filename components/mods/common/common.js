
import _ from "lodash";
import {mapGetters, mapActions, mapMutations} from "vuex";
import component from '@/components/component.js';


export default {
	mixins:[component],

	data: function() {
		return {
			defaultData:{},
		}
	},

	props: {
		__data_type__: {
			type: Object,
			//default: function() {return {}},
		},
		__default_data__: {
			type: Object,
			//default: function() {return {}},
		},
		__mode__: {
			type: String,
			default: "normal",
		},
		__key__: {
			type: String,
		},
	},
	
	computed: {
		...mapGetters({
			getModData: "getModData",
			currentMod: "getCurrentMod",
			currentModData: "getCurrentModData",
		}),
		__uid__() {
			return this._uid;
		},
		__isEditorMode__() {
			return this.__mode__ == "editor";
		},
		__isActived__() {
			const currentMod = this.currentMod;
			if (!currentMod || !currentMod.__key__) return false;

			return currentMod.__key__ == this.__key__;
		},
		__data__() {
		   	// 设置默认数据
			const defaultValue = this.__default_data__ || {};
			_.merge(defaultValue, this.defaultData, _.cloneDeep(defaultValue)); 
			if (!this.__key__) return defaultValue;

			// 设置传入数据
			_.merge(defaultValue,  this.getModData(this.__key__));
			return defaultValue;
		},
	},

	watch: {
		currentModData: function() {
			if (this.__key__ && this.currentMod.__mod_key__ == this.__key__) this.__store_data__();
		}
	},

	methods: {
		...mapMutations({
			setModData: "setModData",
			setModsData: "setModsData",
			setCurrentModData: "setCurrentModData",
		}),
		__store_data__() {
			if (!this.__key__) return;
			const modKey = this.__mod_key__();
			const data = this.getModData(modKey);
			const blockData = this.getShareData("blockData") || {};
			const block = blockData[modKey];
			//console.log(modKey);
			if (JSON.stringify(data) == JSON.stringify(block.data)) return;
			//console.log(JSON.stringify(block.data));
			//console.log(JSON.stringify(data));
			//return;
			this.emit(this.EVENTS.__EVENT__CODEMIRROR__IN__TEXT_REPLACE__, {
				from: block.start,
				to: block.end,
				data: data,
			});

		},
		__key_func__(key) {
			if (!this.__key__) return this.__key__;

			return this.__key__ + "." + key;
		},
		__mod_key__(key) {
			return (key || this.__key__ || "").split(".")[0];
		},
		__set_data__(data = {}) {
			if (!this.__key__) return;
			const modKey = this.__mod_key__();
			const modData = this.getModData(modKey);
			const rootData = {[modKey]: modData};
			_.set(rootData, this.__key__, data);
			this.setModData(rootData);
			this.__store_data__();
		},
		setCurrentMod(value) {
			if (!this.__key__) return;
			this.$store.commit("setCurrentMod", {
				__mod_key__: this.__mod_key__(this.__key__),
				__key__: this.__key__,
				__data_type__: this.__data_type__,
				__value__: value || this.__data__,
			});
			this.setCurrentModData(value || this.__data__);
		},
	},

	mounted() {
	},

	created() {
		this.__data__.setPageAttr && this.__data__.setPageAttr(this);
	},
}

