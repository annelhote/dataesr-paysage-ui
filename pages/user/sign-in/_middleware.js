import cookie from 'cookie';
import { NextResponse } from 'next/server';
import { userService } from '../../../services/User.service';

export async function middleware(ctx) {
    const headersCookies = ctx.headers.get('cookie');
    // TODO refacto cookies
    const cookies = cookie.parse(headersCookies ? headersCookies : '');
    let tokens = {};

    if (Object.keys(cookies).includes('tokens')) {
        tokens = JSON.parse(cookies.tokens);
    }

    if (tokens.accessToken) {
        await userService.signOut();

        return NextResponse.redirect('/');
    }

    return NextResponse.next();
}
