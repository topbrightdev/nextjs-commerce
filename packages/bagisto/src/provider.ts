import fetcher from './fetcher'

import { handler as useLogin } from './auth/use-login'
import { handler as useLogout } from './auth/use-logout'
import { handler as useSignup } from './auth/use-signup'

import { handler as useCart } from './cart/use-cart'
import { handler as useAddItem } from './cart/use-add-item'
import { handler as useUpdateItem } from './cart/use-update-item'
import { handler as useRemoveItem } from './cart/use-remove-item'

import { handler as useCheckout } from './checkout/use-checkout'
import { handler as useAddAddresses } from './checkout/use-add-addresses'
import { handler as useAddShippingMethod } from './checkout/use-add-shipping-method'
import { handler as useAddPaymentMethod } from './checkout/use-add-payment-method'
import { handler as useSubmitCheckout } from './checkout/use-submit-checkout'

import { handler as useOrders } from './order/use-orders'

import { handler as useCustomer } from './customer/use-customer'
import { handler as useAddAddressItem } from './customer/address/use-add-item'

import { handler as useSearch } from './product/use-search'

export const bagistoProvider = {
  locale: 'en-us',
  cartCookie: 'session',
  fetcher: fetcher,
  cart: { useCart, useAddItem, useUpdateItem, useRemoveItem },
  checkout: {
    useCheckout,
    useAddAddresses,
    useAddShippingMethod,
    useAddPaymentMethod,
    useSubmitCheckout,
  },
  order: {
    useOrders,
  },
  customer: {
    useCustomer,
    address: {
      useAddItem: useAddAddressItem,
    },
  },
  products: { useSearch },
  auth: { useLogin, useLogout, useSignup },
}

export type BagistoProvider = typeof bagistoProvider
