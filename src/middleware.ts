import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    console.log('Middleware running:', req.nextUrl.pathname);
  },
  {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized: ({ token }) => {
        if (token) {
          console.log('User authorized with token:', token);
          return true;
        }
        console.log('User not authorized, no token found');
        return false;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*'],
};
