import { useMemo } from 'react'
import { SWRHook } from '@vercel/commerce/utils/types'
import useSubmitCheckout from './use-submit-checkout'
import useCheckout, {
  UseCheckout,
} from '@vercel/commerce/checkout/use-checkout'

import type { GetCheckoutHook } from '@vercel/commerce/types/checkout'

export default useCheckout as UseCheckout<typeof handler>

export const handler: SWRHook<GetCheckoutHook> = {
  fetchOptions: {
    url: '/api/checkout',
    method: 'GET',
  },

  async fetcher({ options, fetch }) {
    return await fetch({ ...options })
  },

  useHook: ({ useData }) =>
    function useHook(input) {
      const submit = useSubmitCheckout()
      
      const response = useData({
        swrOptions: { revalidateOnFocus: false, ...input?.swrOptions },
      })

      return useMemo(
        () =>
          Object.create(response, {
            isEmpty: {
              get() {
                return (response.data?.lineItems?.length ?? 0) <= 0
              },
              enumerable: true,
            },
            submit: {
              get() {
                return submit
              },
              enumerable: true,
            },
          }),
        [response, submit]
      )
    },
}
