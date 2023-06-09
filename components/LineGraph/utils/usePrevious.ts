import * as React from "react"
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const usePrevious = <T>(value: T): any => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef<T>()
  // Store current value in ref
  React.useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current
}
