//protected routing: to be implemented
import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth'; 

export async function middleware(request) {
  const url = request.url;

  const token = request.cookies.get('auth_token'); 
  
  if (url.includes('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', url)); 
  }

  return NextResponse.next();
}
