import vue from "vue";
import _ from "lodash";
import {mapGetters, mapActions, mapMutations} from "vuex";
import component from '@/components/component.js';


export default {
	mixins:[component],

	data: function() {
		return {
			default_data:{},
		}
	},

	props: {
		__data_type__: {
			type: Object,
		},
		__default_data__: {
			type: Object,
		},
		//__data__: {
			//type: Object,
			//default: function() {
				//return {};
			//},
		//},
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
			const data = this.__default_data__ || this.default_data || {};	
			// 设置store值
			if (this.__key__) {
				_.each(this.getModData(this.__key__) || {}, (val, key) => {
					if (data[key] == undefined) {
						vue.set(data, key , val);
					} else {
						data[key] = val
					}
				});
			}

			_.each(this.default_data, (val, key) => {
				if (data[key] == undefined) {
					vue.set(data, key, val);
				}
			});

			return data;

		}
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
		this.__data__.setPageAttr && this.__data__.setPageAttr(this);
	},

	created() {
	},
}

