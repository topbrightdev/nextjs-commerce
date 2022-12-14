import { GetAPISchema, createEndpoint } from '@vercel/commerce/api'
import checkoutEndpoint from '@vercel/commerce/api/endpoints/checkout'

import getCheckout from './get-checkout'
import addAddresses from './add-addresses'
import addShippingMethod from './add-shipping-method'
import addPaymentMethod from './add-payment-method'
import submitCheckout from './submit-checkout'

import type { CheckoutSchema } from '@vercel/commerce/types/checkout'
import type { BagistoAPI } from '../../'

export type CheckoutAPI = GetAPISchema<BagistoAPI, CheckoutSchema>
export type CheckoutEndpoint = CheckoutAPI['endpoint']

export const handlers: CheckoutEndpoint['handlers'] = {
  getCheckout,
  addAddresses,
  addShippingMethod,
  addPaymentMethod,
  submitCheckout,
}

const checkoutApi = createEndpoint<CheckoutAPI>({
  handler: checkoutEndpoint,
  handlers,
})

export default checkoutApi
