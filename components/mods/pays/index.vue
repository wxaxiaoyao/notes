
<template>
	<div>
		<h3>{{__data__.subject}}</h3>
		<p>{{__data__.body}}</p>
		<div>
			<img :src="trade.QR">
		</div>
	</div>
</template>

<script>

import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			trade: {},
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					subject: "会员",
					body: "keepwork 会员",
					channel: "wx_pub_qr",
					amount: 30,
				}
			}
		}
	},

	async mounted() {
		const result = await this.api.trades.create(this.__data__);
		if (result.isErr()) return;

		this.trade = result.data || {};
	}
}
</script>
