import vue from "vue";
import _ from "lodash";

import component from "@/components/component.js";
import mod from "./common/mod.vue";
import {tags} from "@/lib/tags";
import common from "./common";
import templates from "./templates";
import markdowns from "./markdowns";
import headers from "./headers/index.js";
import footers from "./footers/index.js";
import carousels from "./carousels/index.js";
import comments from "./comments/index.js";
import customs from "./customs/index.js";
import titles from "./titles/index.js";
import texts from "./texts/index.js";
import tocs from "./tocs/index.js";
import richtexts from "./richtexts/index.js";
import breadcrumbs from "./breadcrumbs/index.js";
import medias from "./medias/index.js";

import logins from "./logins/index.js";
import menus from "./menus/index.js";
import pagenavs from "./pagenavs/index.js";
import helpers from "./helpers/index.js";
import _tags from "./tags/index.js";
import users from "./users/index.js";
import sites from "./sites/index.js";
import userlinks from "./userlinks/index.js";
import charts from "./charts/index.js";
import pages from "./pages/index.js";
import issues from "./issues/index.js";
import dialogs from "./dialogs/index.js";
import favorites from "./favorites/index.js";
import pays from "./pays/index.js";
import notifications from "./notifications/index.js";
import files from "./files/index.js";
import inputs from "./inputs/index.js";
import modules from "./modules/index.js";
import messages from "./messages/index.js";
import views from "./views/index.js";
import editors from "./editors/index.js";
import tasks from "./tasks/index.js";

import tests from "./tests/index.js";
import examples from "./examples/index.js";

const components = {
	tests,
	examples,

	// 功能组件
	logins, 
	menus,
	pagenavs,
	helpers,
	tags: _tags,
	users,
	sites,
	userlinks,
	charts,
	pages,
	issues,
	dialogs,
	favorites,
	pays,
	notifications,
	files,
	inputs,
	modules,
	messages,
	views,
	editors,
	tasks,

	// UI组件
	templates,
	markdowns,
	headers,
	footers,
	carousels,
	comments,
	customs,
	titles,
	texts,
	tocs,
	richtexts,
	breadcrumbs,
	medias,
}

_.each(components, (val, key) => {
	vue.component(key, {
		extends: mod,

		data: function() {
			return {
				styles: val,
			}
		},
	});
});


export const tagMods = {};

const getTagFactoryByTag = (tag) => () => tags.getTagByTag(tag);
_.each(tagMods, mod => {
	_.each(mod.styles, style => {
		var cmdName = style.modName + '-' + style.styleName;
		tags.registerTagFactory(cmdName, getTagFactoryByTag(style.tag));
	});
})

export const mods = {
}

const getTagFactoryByVNode = (vnode) => () => tags.getTagByVNode(vnode);
//if (process.client) {
export const registerModTag = (store) => {
	for (var modName in mods) {
		var styles = mods[modName];
		for (var key in styles) {
			let style = styles[key];
			let tagKey = modName + "-" + (style.name || key);
			let comp = new vue({
				...style,
				store,
			});
			let vnode = comp.$mount()._vnode;

			////console.log(tagKey);
			////console.log(vnode);

			tags.registerTagFactory(tagKey, getTagFactoryByVNode(vnode));

		}
	}
}
//}

export default components;

