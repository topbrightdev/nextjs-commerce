import { FC } from 'react'
import s from './ShippingMethodWidget.module.css'
import { ChevronRight, CreditCard, Check } from '@components/icons'

interface ComponentProps {
  onClick?: () => any
  isValid?: boolean
}

const ShippingMethodWidget: FC<ComponentProps> = ({ onClick, isValid }) => {
  /*
    Shipping Method
    Only available with checkout set to true.
    This means that the provider does offer checkout functionality.
  */
  return (
    <div onClick={onClick} className={s.root}>
      <div className="flex flex-1 items-center">
        <CreditCard className="w-5 flex" />
        <span className="ml-5 text-sm text-center font-medium">
          Add Shipping Method
        </span>
      </div>
      <div>{isValid ? <Check /> : <ChevronRight />}</div>
    </div>
  )
}

export default ShippingMethodWidget
