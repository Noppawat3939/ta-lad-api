import { Nullable } from 'src/types'

export const success = <TMessage extends Nullable<string>, TData>(
  message?: TMessage,
  data?: TData
) => {
  return { success: true, ...(message && { message }), ...(data && { data }) }
}
