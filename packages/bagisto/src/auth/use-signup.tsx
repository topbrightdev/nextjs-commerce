import useSignup, { UseSignup } from '@vercel/commerce/auth/use-signup'
import { CommerceError } from '@vercel/commerce/utils/errors'
import { useCallback } from 'react'
import useCustomer from '../customer/use-customer'

import type { MutationHook } from '@vercel/commerce/utils/types'
import type { SignupHook } from '../type/signup'

export default useSignup as UseSignup<typeof handler>

export const handler: MutationHook<SignupHook> = {
  fetchOptions: {
    url: '/api/signup',
    method: 'POST',
  },
  async fetcher({
    input: { firstName, lastName, email, password },
    options,
    fetch,
  }) {
    if (!(firstName && lastName && email && password)) {
      throw new CommerceError({
        message:
          'A first name, last name, email and password are required to signup',
      })
    }

    return fetch({
      ...options,
      body: { firstName, lastName, email, password },
    })
  },
  useHook:
    ({ fetch }) =>
    () => {
      const { mutate } = useCustomer()

      return useCallback(
        async function signup(input) {
          const data = await fetch({ input })
          await mutate()
          return data
        },
        [fetch, mutate]
      )
    },
}
