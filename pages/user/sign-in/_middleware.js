import { NextResponse } from 'next/server';

export async function middleware(ctx) {
    // const headersCookies = ctx.headers.get('cookie');
    // // TODO refacto cookies
    // const cookies = cookie.parse(headersCookies ? headersCookies : '');
    // let tokens = {};
    //
    // if (Object.keys(cookies).includes('tokens')) {
    //     tokens = JSON.parse(cookies.tokens);
    // }
    //
    // if (tokens.accessToken) {
    //     return NextResponse.redirect('/');
    // }

    return NextResponse.next();
}
