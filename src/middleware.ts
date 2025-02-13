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
          return true;
        }
        return false;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*'],
};
