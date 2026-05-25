import { NextResponse } from 'next/server';

export function middleware(request) {
    const response = new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Maintenance</title>
        </head>
        <body style="font-family:sans-serif;text-align:center;padding-top:100px">
            <h1>Site Under Maintenance</h1>
            <p>Please check back later.</p>
        </body>
        </html>
        `,
        {
            status: 503,
            headers: {
                'content-type': 'text/html',
            },
        }
    );

    return response;
}

export const config = {
    matcher: ['/((?!_next).*)'],
};
