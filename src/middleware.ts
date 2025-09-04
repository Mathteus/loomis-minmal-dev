import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

const routes = [
	{ path: '/', type: 'PUBLIC', WhenAuthenticated: 'next' },
	{ path: '/login', type: 'PUBLIC', WhenAuthenticated: 'redirect' },
	{ path: '/first-access', type: 'PUBLIC', WhenAuthenticated: 'redirect' },
	{ path: '/new-password', type: 'PUBLIC', WhenAuthenticated: 'redirect' },
	{ path: '/forgot-password', type: 'PUBLIC', WhenAuthenticated: 'redirect' },
	{ path: '/about-company', type: 'PUBLIC', WhenAuthenticated: 'redirect' },
	{ path: '/your-squad', type: 'PUBLIC', WhenAuthenticated: 'redirect' },
	{ path: '/verify-password', type: 'PUBLIC', WhenAuthenticated: 'redirect' },
	{
		path: '/first-access/about-company',
		type: 'PUBLIC',
		WhenAuthenticated: 'redirect',
	},
	{ path: '/dashboard', type: 'PRIVATE', WhenAuthenticated: 'next' },
	{ path: '/dashboard/agentes', type: 'PRIVATE', WhenAuthenticated: 'next' },
	{
		path: '/dashboard/atendimentos',
		type: 'PRIVATE',
		WhenAuthenticated: 'next',
	},
	{
		path: '/dashboard/configuracoes',
		type: 'PRIVATE',
		WhenAuthenticated: 'next',
	},
	{ path: '/dashboard/contatos', type: 'PRIVATE', WhenAuthenticated: 'next' },
	{ path: '/dashboard/funil', type: 'PRIVATE', WhenAuthenticated: 'next' },
	{
		path: '/dashboard/integracoes',
		type: 'PRIVATE',
		WhenAuthenticated: 'next',
	},
	{
		path: '/dashboard/mensagem-massa',
		type: 'PRIVATE',
		WhenAuthenticated: 'next',
	},
	{ path: '/dashboard/tarefas', type: 'PRIVATE', WhenAuthenticated: 'next' },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login';
const REDIRECT_WHEN_AUTHENTICATED_ROUTE = '/dashboard';

function checkJwtExpired(token: string) {
	try {
		// validateJwt(token);
		console.info('checkJwtExpired: ', token);
		return false;
	} catch {
		return true;
	}
}

function toRedirectLogin(request: NextRequest) {
	const redirectUrl = request.nextUrl.clone();
	redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
	return NextResponse.redirect(redirectUrl);
}

function toRedirectDashboard(request: NextRequest) {
	const redirectUrl = request.nextUrl.clone();
	redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED_ROUTE;
	return NextResponse.redirect(redirectUrl);
}

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const appRoutes = routes.find((route) => route.path === path);
	const authToken = request.cookies.get('access_token');
	console.log(path, appRoutes, authToken);

	if (path === '/') {
		return toRedirectDashboard(request);
	}

	// if (!authToken && appRoutes?.type === 'PRIVATE') {
	// 	return toRedirectLogin(request);
	// }

	if (
		authToken &&
		appRoutes?.type === 'PUBLIC' &&
		appRoutes?.WhenAuthenticated === 'redirect'
	) {
		if (checkJwtExpired(authToken.value)) return toRedirectLogin(request);
		return toRedirectDashboard(request);
	}

	if (authToken && appRoutes?.type === 'PRIVATE') {
		if (checkJwtExpired(authToken.value)) return toRedirectLogin(request);
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config: MiddlewareConfig = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js|short-logo.svg).*)',
	],
};
