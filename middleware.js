import { NextResponse } from 'next/server';

export function middleware(request) {
    return new NextResponse(
        `
        <html>
            <head>
                <title>Temporarily Unavailable</title>
            </head>
            <body style="font-family:sans-serif;text-align:center;padding-top:100px">
                <h1>Site Temporarily Unavailable</h1>
                <p>We’ll be back soon.</p>
            </body>
        </html>
        `,
        {
            status: 503,
            headers: {
                'Content-Type': 'text/html',
            },
        }
    );
}

export const config = {
    matcher: '/:path*',
};
