

export default function({store, req, redirect}) {
	if (process.server && !req) return;
	
	let authenticated = false;
	if (process.server && req.ctx.state.user && req.ctx.state.user.userId) authenticated = true;

	if (process.client && store.getters["isAuthenticated"]) authenticated = true;
	
	if (!authenticated) return redirect("/note/login");
}
