/* tslint:disable */

/**
 * @worklet
 */
export const formatPrice = ({
  value: _value,
  defaultPrice: _defaultPrice = "",
}: {
  value: string
  defaultPrice?: string
}): string => {
  "worklet"

  let defaultPrice = _defaultPrice
  if (typeof defaultPrice === "number") {
    defaultPrice = (defaultPrice as number).toString()
  }

  const value = _value || defaultPrice?.replace?.(",", "")
  if (!value) {
    return `0.00`
  }

  const res = `${Number(value).toFixed(6)}`
  return res
}
