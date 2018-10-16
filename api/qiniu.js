import * as qiniu from "qiniu-js";

const qiniuUpload = async (key, file, token, params = {}, observer = {}) => {
	const api = g_app.api;
	if (!token) {
		const data = await api.files.token({key});
		if (data.isErr()) {
			console.log("获取上传token失败:", key);
			return ;
		}
		token = data.data;
	}

	if (typeof(file) == "string") {
		file = new Blob([file], {type: "text/plain"});
	}

	const opts =  {
		token: token,
		putExtra: {
			mimeType: null,
			params: {
				//"x:varname":"x"
			},
		},
		config: {
			useCdnDomain: true,
		},
	}

	//console.log(file);

	const observable = qiniu.upload(file, key, opts.token, opts.putExtra, opts.config);
	const data = await new Promise((resolve, reject) => {
		observable.subscribe({
			next(res) {
				observer.next && observer.next(res);
				//console.log(res);
			},
			error(err) {
				observer.error && observer.error(err);
				console.log(err);
				resolve(false);
				//console.log(err);
			},
			async complete(res){
				//console.log(res);
				observer.complete && observer.complete(res);
				resolve({key:res.key, size: res.fsize, hash: res.hash});
			}
		});
	});
	
	if (!data) return;

	const result = await api.files.upsert(data);
	if (result.isErr()) return;

	return result.data;
}

export default qiniuUpload;
