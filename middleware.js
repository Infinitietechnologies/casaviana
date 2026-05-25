import { NextResponse } from 'next/server';

export function middleware(request) {
    return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Maintenance</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: #111;
                    color: white;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div>
                <h1>Site Temporarily Unavailable</h1>
                <p>We’ll be back soon.</p>
            </div>
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
