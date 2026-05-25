import { NextResponse } from 'next/server';

export function middleware(request) {
  return new NextResponse('<h1>Site under maintenance</h1>', {
    status: 503,
    headers: { 'content-type': 'text/html' },
  });
}
