/**
 * @worklet
 */
export const formatDatetime = ({
  value,
  locale = "en-US",
  options = {},
}: {
  value: number
  locale?: string
  options?: Intl.DateTimeFormatOptions
}): string => {
  "worklet"
  const d = new Date(value)
  return d.toLocaleString(locale, options)
}
