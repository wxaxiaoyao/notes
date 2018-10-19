<template>
	<codemirror v-if="isClient" :options="__data__.options" ref="cm"></codemirror>
</template>

<script>
import vue from "vue";
import _ from "lodash";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/addon/fold/foldgutter.css"
//import "codemirror/mode/markdown/markdown.js";
//import "codemirror/addon/fold/foldgutter.js";
//import "codemirror/addon/fold/foldcode.js";
//import "codemirror/addon/fold/markdown-fold.js";
//import "codemirror/addon/fold/xml-fold.js";
//import 'codemirror/addon/selection/active-line.js';

import mod from "@/components/mods/common/mod.js";

function wikiCmdFold(cm, start) {
	var line = cm.getLine(start.line);
	if ((!line) || (!line.match(/^```[@\/]/)))
		return undefined;
	//console.log(start);
	var end = start.line + 1;
	var lastLineNo = cm.lastLine();
	while (end < lastLineNo) {
		line = cm.getLine(end)
		if (line && line.match(/^```/))
			break;
		end++;
	}

	return {
		from: CodeMirror.Pos(start.line),
		to: CodeMirror.Pos(end, (cm.getLine(end) || "").length)
	};
}

if (process.client) {
	const CodeMirror = require("codemirror");
	require("codemirror/mode/markdown/markdown.js");
	require("codemirror/addon/fold/foldgutter.js");
	require("codemirror/addon/fold/foldcode.js");
	require("codemirror/addon/fold/markdown-fold.js");
	require("codemirror/addon/fold/xml-fold.js");
	require('codemirror/addon/selection/active-line.js');

	CodeMirror.registerHelper("fold", "wikiCmdFold", wikiCmdFold);

	const VueCodemirror = require("vue-codemirror");
	vue.use(VueCodemirror, {
		options: {
			tabSize:4,
			line: true,
			mode:"text/x-markdown",
			lineNumbers: true,
			theme:"default",
			lineWrapping: true,
			styleActiveLine: true,
			indentWithTabs: false,
			matchBrackets: true,
			autofocus: true,
			foldGutter: true,
			foldOptions: {
				rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.markdown, CodeMirror.fold.xml, CodeMirror.fold.wikiCmdFold),
				//rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.markdown, CodeMirror.fold.xml),
				clearOnEnter: false,
			},
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
		}
	});

	window.CodeMirror = CodeMirror;
}

function getEmptyLine(editor, lineNo) {
	lineNo = lineNo || editor.getCursor().line || 0;

	var content = editor.getLine(lineNo);
	while (content){
		content = editor.getLine(++lineNo);
	}
	if (content == undefined){
		editor.replaceRange("\n",{line: lineNo, ch: 0});
	}
	return lineNo;
}

function line_keyword_nofocus(editor, lineNo, content) {
	lineNo = lineNo || getEmptyLine(editor);

	const originContent = editor.getLine(lineNo);
	const offsetX = originContent && originContent.length;
	editor.replaceRange(content, CodeMirror.Pos(lineNo, 0), CodeMirror.Pos(lineNo, offsetX));
};
	// 折叠wiki代码
function foldWikiBlock(cm, changeObj) {
	if (!changeObj) {
		return;
	}
	var start = -1, end = -1;
	for (var i = 0; i < changeObj.text.length; i++) {
		//cm.getDoc().removeLineClass(changeObj.from.line + i, 'wrap', 'CodeMirrorFold');
		if (/^```[@\/]/.test(changeObj.text[i])) {
			start = i;
		}
		if (start >= 0 && /^```/.test(changeObj.text[i])) {
			end = i;
		}
		if (start >= 0 && end >= 0) {
			cm.foldCode({line: changeObj.from.line + start, ch: changeObj.from.ch}, null, 'fold');
			start = end = -1;
		}
	}

	if (changeObj.origin == "setValue") {
		return;
	}

	start = end = -1;
	for (var i = 0; i < changeObj.removed.length; i++) {
		//cm.getDoc().removeLineClass(changeObj.from.line + i, 'wrap', 'CodeMirrorFold');
		if (/^```[@\/]/.test(changeObj.removed[i])) {
			start = i;
		}
		if (start >= 0 && /^```/.test(changeObj.removed[i])) {
			end = i;
		}
		if (start >= 0 && end >= 0) {
			cm.getDoc().removeLineClass(changeObj.from.line + i, 'wrap', 'CodeMirrorFold');
			start = end = -1;
		}
	}
}

function wrapfunc(self, funcname) {
	return function(...args) {
		(self[funcname])(...args);
	}
}

export default {
	mixins:[mod],
	data: function() {
		var self = this;
		return {
			isClient: false,
			keyMap:{
				"Ctrl-S": function(cm) {
					console.log("-------------ctrl-s-------------");
					self.__data__.CtrlS && self.__data__.CtrlS();
				},
				"Ctrl-Enter": function(cm) {
					cm.replaceSelection("\n");	
					console.log("---------ctrl-enter--------");
				},
				"Enter": function(cm) {
					cm.replaceSelection("\n");	
					//console.log("------enter-------");
				},
				"Alt-P": function(cm) {
					self.__data__.AltP && self.__data__.AltP(cm);
				}
			},
		};
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					options: {
					},
				}
			}
		}
	},

	watch: {
	},

	methods: {
		initCodeMirror() {
			var self = this;

			self.codemirror.setSize("100%", "100%");
			self.originDoc = self.codemirror.getDoc();

			self.codemirror.on("change", function (cm, changeObj) {
				// 代码折叠
				foldWikiBlock(cm, changeObj);

				// change
				var text = self.codemirror.getValue();
				var cursor = self.codemirror.getCursor();

				self.__data__.change && self.__data__.change({filename:self.currentFilename, text:text, cursor});
			});

			self.codemirror.on("cursorActivity", function(cm){
				var pos = self.codemirror.getCursor();
				self.__data__.cursorActivity && self.__data__.cursorActivity(pos);
			});

			self.codemirror.on("focus", function(cm){
				self.__data__.focus && self.__data__.focus();
			});

			self.codemirror.on("paste", function(cm, e) {
				if (!(e.clipboardData && e.clipboardData.items.length)) {
					alert("该浏览器不支持操作");
					return;
				}
				for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
					const item = e.clipboardData.items[i];
					// console.log(item.kind+":"+item.type);
					if (item.kind === "string") {
						item.getAsString(function (str) {
							// str 是获取到的字符串
							//console.log('get str');
							//console.log(str);
						})
					} else if (item.kind === "file") {
						var file = item.getAsFile();
						// pasteFile就是获取到的文件
						//self.$emit("fileUpload", file);
						self.__data__.fileUpload && self.__data__.fileUpload(file);
					}
				}
			});
			
			self.codemirror.on("drop", function(cm, e){
				if (!(e.dataTransfer && e.dataTransfer.files.length)) {
					alert("该浏览器不支持操作");
					return;
				}
				for (var i = 0; i < e.dataTransfer.files.length; i++) {
					var file = e.dataTransfer.files[i];
					//self.$emit("fileUpload", file);
					self.__data__.fileUpload && self.__data__.fileUpload(file);
				}
				e.preventDefault();
			});
	
			self.codemirror.setOption("extraKeys", this.keyMap);
		},

		swapDoc(filename, text) {
			text = text || "";
			if (filename) {
				if (!this.docMap[filename]) {
					this.docMap[filename] = this.CodeMirror.Doc(text, 'markdown');
				}
				this.codemirror.swapDoc(this.docMap[filename]);
			} else {
				this.codemirror.swapDoc(this.originDoc);
			}
			this.currentFilename = filename;
			if (text) {
				this.codemirror.setValue(text);
			} else {
				this.CodeMirror && this.CodeMirror.signal(this.codemirror, "change", this.codemirror);
			}

			this.codemirror.focus();
		},
		insertContent(content, lineNo) {
			line_keyword_nofocus(this.codemirror, lineNo, content);
		},
		getValue() {
			return {
				filename: this.currentFilename,
				text: this.codemirror ? this.codemirror.getValue() : "",
				cursor: this.codemirror && this.codemirror.getCursor(),
			};	
		},
		setValue(val) {
			if (!this.codemirror) return;
			this.swapDoc(val.filename, val.text);	
			
			const maxLine = this.codemirror.getDoc().lastLine();
			let line = val.cursor && val.cursor.line || maxLine;
			if (line > maxLine)line = maxLine;
			this.codemirror.setCursor({line});
		},
		replaceText(from, to, content) {
			if (typeof(content) != "string") {
				content = JSON.stringify(content);
			}
			this.codemirror.replaceRange(content, CodeMirror.Pos(from, 0), CodeMirror.Pos(to));
		},
	},
	created() {
		this.docMap = {};	
		this.currentFilename = undefined;
	},
	mounted() {
		const self = this;
		self.isClient = true;
		const timer = setInterval(()=> {
			if (!self.$refs.cm || !self.$refs.cm.codemirror) return;
			clearInterval(timer);
			self.codemirror = self.$refs.cm.codemirror;
			self.CodeMirror = this.CodeMirror || require("codemirror");
			self.initCodeMirror();
			self.swapDoc(self.__data__.filename, self.__data__.text);	

			self.__data__.inited && self.__data__.inited(self);
		}, 100);
	},
}
</script>

<style>
.vue-codemirror {
	height:100%;
	width:100%;
	overflow-y: auto;
}
.CodeMirror-vscrollbar {
	overflow-y: hidden;
}
.CodeMirrorFold {
	background-color: #F5F5F5;
}
</style>
