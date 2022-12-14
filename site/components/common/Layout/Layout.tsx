import cn from 'clsx'
import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { CommerceProvider } from '@framework'
import { CheckoutProvider } from '@components/checkout/context'

import { Navbar, Footer } from '@components/common'
import { Sidebar, Button, LoadingDots } from '@components/ui'
import { useUI } from '@components/ui/context'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'

import LoginView from '@components/auth/LoginView'
import MenuSidebarView, { Link } from '../UserNav/MenuSidebarView'
import CartSidebarView from '@components/cart/CartSidebarView'
import CheckoutSidebarView from '@components/checkout/CheckoutSidebarView'
import AddressView from '@components/checkout/AddressView'
import ShippingMethodView from '@components/checkout/ShippingMethodView'
import PaymentMethodView from '@components/checkout/PaymentMethodView'
import OrderSuccessView from '@components/checkout/OrderSuccessView'

import s from './Layout.module.css'

import type { Page } from '@commerce/types/page'
import type { Category } from '@commerce/types/site'

const Loading = () => (
  <div className="w-80 h-80 flex items-center text-center justify-center p-3">
    <LoadingDots />
  </div>
)

const dynamicProps = {
  loading: Loading,
}

const SignUpView = dynamic(() => import('@components/auth/SignUpView'), {
  ...dynamicProps,
})

const ForgotPassword = dynamic(
  () => import('@components/auth/ForgotPassword'),
  {
    ...dynamicProps,
  }
)

const FeatureBar = dynamic(() => import('@components/common/FeatureBar'), {
  ...dynamicProps,
})

const Modal = dynamic(() => import('@components/ui/Modal'), {
  ...dynamicProps,
  ssr: false,
})

interface Props {
  pageProps: {
    pages?: Page[]
    categories: Category[]
  }
}

const ModalView: FC<{ modalView: string; closeModal(): any }> = ({
  modalView,
  closeModal,
}) => {
  return (
    <Modal onClose={closeModal}>
      {modalView === 'LOGIN_VIEW' && <LoginView />}
      {modalView === 'SIGNUP_VIEW' && <SignUpView />}
      {modalView === 'FORGOT_VIEW' && <ForgotPassword />}
      {modalView === 'ORDER_SUCCESS_VIEW' && <OrderSuccessView />}
    </Modal>
  )
}

const ModalUI: FC = () => {
  const { displayModal, closeModal, modalView } = useUI()
  return displayModal ? (
    <ModalView modalView={modalView} closeModal={closeModal} />
  ) : null
}

const SidebarView: FC<{
  sidebarView: string
  closeSidebar(): any
  links: Link[]
}> = ({ sidebarView, closeSidebar, links }) => {
  return (
    <Sidebar onClose={closeSidebar}>
      {sidebarView === 'MOBILEMENU_VIEW' && <MenuSidebarView links={links} />}
      {sidebarView === 'CART_VIEW' && <CartSidebarView />}
      {sidebarView === 'CHECKOUT_VIEW' && <CheckoutSidebarView />}
      {sidebarView === 'ADDRESS_VIEW' && <AddressView />}
      {sidebarView === 'SHIPPING_METHOD_VIEW' && <ShippingMethodView />}
      {sidebarView === 'PAYMENT_METHOD_VIEW' && <PaymentMethodView />}
    </Sidebar>
  )
}

const SidebarUI: FC<{ links: any }> = ({ links }) => {
  const { displaySidebar, closeSidebar, sidebarView } = useUI()
  return displaySidebar ? (
    <SidebarView
      sidebarView={sidebarView}
      closeSidebar={closeSidebar}
      links={links}
    />
  ) : null
}

const Layout: FC<Props> = ({
  children,
  pageProps: { categories = [], ...pageProps },
}) => {
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
  const { locale = 'en-US' } = useRouter()
  const navBarlinks = categories.slice(0, 2).map((c) => ({
    label: c.name,
    href: `/search/${c.slug}`,
  }))

  return (
    <CommerceProvider locale={locale}>
      <div className={cn(s.root)}>
        <Navbar links={navBarlinks} />
        <main className="fit">{children}</main>
        <Footer pages={pageProps.pages} />
        <ModalUI />
        <CheckoutProvider>
          <SidebarUI links={navBarlinks} />
        </CheckoutProvider>
        <FeatureBar
          title="This site uses cookies to improve your experience. By clicking, you agree to our Privacy Policy."
          hide={acceptedCookies}
          action={
            <Button className="mx-5" onClick={() => onAcceptCookies()}>
              Accept cookies
            </Button>
          }
        />
      </div>
    </CommerceProvider>
  )
}

export default Layout
