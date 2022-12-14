import type { CheckoutSchema } from '../../types/checkout'
import type { GetAPISchema } from '..'

import { CommerceAPIError } from '../utils/errors'
import isAllowedOperation from '../utils/is-allowed-operation'

const checkoutEndpoint: GetAPISchema<
  any,
  CheckoutSchema
>['endpoint']['handler'] = async (ctx) => {
  const { req, res, handlers, config } = ctx

  if (
    !isAllowedOperation(req, res, {
      GET: handlers['getCheckout'],
      POST: handlers['submitCheckout'],
    })
  ) {
    return
  }

  const { cookies } = req
  const cartId = cookies[config.cartCookie]

  try {
    // Add addresses.
    if (req.url === '/api/checkout/add-addresses') {
      const body = { ...req.body, cartId }
      return await handlers['addAddresses']!({ ...ctx, body })
    }

    // Add shipping method.
    if (req.url === '/api/checkout/add-shipping-method') {
      const body = { ...req.body, cartId }
      return await handlers['addShippingMethod']!({ ...ctx, body })
    }

    // Add payment method.
    if (req.url === '/api/checkout/add-payment-method') {
      const body = { ...req.body, cartId }
      return await handlers['addPaymentMethod']!({ ...ctx, body })
    }

    // Get checkout.
    if (req.method === 'GET') {
      const body = { ...req.body, cartId }
      return await handlers['getCheckout']({ ...ctx, body })
    }

    // Create checkout.
    if (req.method === 'POST' && handlers['submitCheckout']) {
      const body = { ...req.body, cartId }
      return await handlers['submitCheckout']({ ...ctx, body })
    }
  } catch (error) {
    console.error(error)

    const message =
      error instanceof CommerceAPIError
        ? 'An unexpected error ocurred with the Commerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export default checkoutEndpoint
