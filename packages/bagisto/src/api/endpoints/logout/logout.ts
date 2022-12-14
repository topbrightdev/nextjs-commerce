import { prepareSetCookie, setCookies } from '../../lib/cookie'

import type { LogoutEndpoint } from './'

const logout: LogoutEndpoint['handlers']['logout'] = async ({
  res,
  body: { redirectTo },
  config,
}) => {
  // Remove the cookie.
  const authCookie = prepareSetCookie(config.customerCookie, '', {
    maxAge: -1,
    path: '/',
  })
  setCookies(res, [authCookie])

  // Only allow redirects to a relative URL.
  if (redirectTo?.startsWith('/')) {
    res.redirect(redirectTo)
  } else {
    res.status(200).json({ data: null })
  }
}

export default logout
