import Link from 'next/link'
import { FC, useState, useEffect } from 'react'

import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'

import { useCheckoutContext } from '../context'
import SidebarLayout from '@components/common/SidebarLayout'

import CartItem from '@components/cart/CartItem'

import useCart from '@framework/cart/use-cart'
import useCheckout from '@framework/checkout/use-checkout'
import usePrice from '@framework/product/use-price'

import AddressWidget from '../AddressWidget'
import ShippingMethodWidget from '../ShippingMethodWidget'
import PaymentMethodWidget from '../PaymentMethodWidget'

import s from './CheckoutSidebarView.module.css'

const CheckoutSidebarView: FC = () => {
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const { setSidebarView, closeSidebar } = useUI()
  const { openModal, setModalView } = useUI()
  const { data: cartData, mutate: refreshCart } = useCart()
  const { data: checkoutData, submit: onCheckout } = useCheckout()
  const { clearCheckoutFields } = useCheckoutContext()

  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    try {
      setLoadingSubmit(true)
      event.preventDefault()

      await onCheckout()
      clearCheckoutFields()
      setLoadingSubmit(false)
      refreshCart()
      closeSidebar()

      setModalView('ORDER_SUCCESS_VIEW')
      openModal()
    } catch {
      setLoadingSubmit(false)
    }
  }

  const { price: subTotal } = usePrice(
    cartData && {
      amount: Number(cartData.subtotalPrice),
      currencyCode: cartData.currency.code,
    }
  )

  const { price: total } = usePrice(
    cartData && {
      amount: Number(cartData.totalPrice),
      currencyCode: cartData.currency.code,
    }
  )

  const { price: shippingCharges } = usePrice(
    cartData && {
      amount: Number(cartData.shippingCharges ?? 0),
      currencyCode: cartData.currency.code,
    }
  )

  return (
    <SidebarLayout
      className={s.root}
      handleBack={() => setSidebarView('CART_VIEW')}
    >
      <div className="px-4 sm:px-6 flex-1">
        <Link href="/cart">
          <a>
            <Text variant="sectionHeading">Checkout</Text>
          </a>
        </Link>

        <AddressWidget
          isValid={cartData?.hasAddresses}
          onClick={() => setSidebarView('ADDRESS_VIEW')}
        />

        <ShippingMethodWidget
          isValid={cartData?.hasShipping}
          onClick={() => {
            cartData?.hasAddresses
              ? setSidebarView('SHIPPING_METHOD_VIEW')
              : alert('Please fill up the checkout addresses.')
          }}
        />

        <PaymentMethodWidget
          isValid={cartData?.hasPayment}
          onClick={() => {
            cartData?.hasShipping
              ? setSidebarView('PAYMENT_METHOD_VIEW')
              : alert('Please select the shipping method.')
          }}
        />

        <ul className={s.lineItemsList}>
          {cartData!.lineItems.map((item: any) => (
            <CartItem
              key={item.id}
              item={item}
              currencyCode={cartData!.currency.code}
              variant="display"
            />
          ))}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 bg-accent-0 border-t text-sm"
      >
        <ul className="pb-2">
          <li className="flex justify-between py-1">
            <span>Subtotal</span>
            <span>{subTotal}</span>
          </li>
          <li className="flex justify-between py-1">
            <span>Taxes</span>
            <span>Calculated at checkout</span>
          </li>
          <li className="flex justify-between py-1">
            <span>Shipping</span>
            <span className="font-bold tracking-wide">{shippingCharges}</span>
          </li>
        </ul>
        <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-2">
          <span>Total</span>
          <span>{total}</span>
        </div>
        <div>
          <Button
            type="submit"
            width="100%"
            disabled={
              !cartData?.hasAddresses ||
              !cartData?.hasShipping ||
              !cartData?.hasPayment
            }
            loading={loadingSubmit}
          >
            Confirm Purchase
          </Button>
        </div>
      </form>
    </SidebarLayout>
  )
}

export default CheckoutSidebarView
