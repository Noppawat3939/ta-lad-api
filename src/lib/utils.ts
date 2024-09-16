import { createHash } from 'crypto'
import { regex } from '.'
import { join } from 'path'
import { readFileSync } from 'fs'
import { Pagination } from 'src/types'

type Encoding = 'base64' | 'base64url' | 'hex' | 'binary'

export const validIdNumber = (id: string) => {
  let sum = 0

  if (id.length !== 13 && !regex.number.test(id)) return false

  for (let i = 0; i < 12; i++) {
    sum += Number(id.charAt(i)) * (13 - i)
  }

  let mod = sum % 11

  let check = (11 - mod) % 10

  return check === Number(id.charAt(12))
}

export const hashCrypto = (
  s: string,
  algorithm = 'sha256',
  encoding?: Encoding
) => {
  return createHash(algorithm)
    .update(s)
    .digest(encoding ?? 'hex')
}

export const randomCodeNumber = () => {
  const randomNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000

  return randomNum.toString().padStart(6, '0')
}

export const randomString = (len = 50) => {
  let text = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < len; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return text
}

export const getStaticTemplate = (fileName: string) => {
  const pathFile = join(
    __dirname,
    '..',
    '..',
    'src',
    'template',
    `${fileName}.html`
  )

  const template = readFileSync(pathFile, 'utf-8')

  return template
}

export const createSkuProduct = ({
  product_category_code,
  product_id,
  seller_id,
  created_at,
}: {
  product_category_code: string
  product_id: number
  seller_id: number
  created_at: string
}) => {
  const concatSKU = `${product_category_code}pid${product_id}sid${seller_id}cd${created_at}`

  return concatSKU
}

export const decodedSkuProduct = (sku: string) => {
  const product_category_code = sku.slice(0, 3)
  const pidMatch = sku.match(/pid(\d+)/)
  const sidMatch = sku.match(/sid(\d+)/)
  const cdMatch = sku.match(/cd(\d+)/)

  const product_id = pidMatch ? +pidMatch[1] : null
  const seller_id = sidMatch ? +sidMatch[1] : null
  const product_created_at = cdMatch ? cdMatch[1] : null

  const isInvalid = [!product_id, !seller_id, !product_created_at].some(Boolean)

  if (isInvalid) return { isError: true }

  return { product_category_code, product_id, seller_id, product_created_at }
}

export const checkInvalidPagination = (
  query: Pagination,
  max_page_size = 50
) => {
  const isInvalid = [
    !query.page,
    !query.page_size,
    query.page_size && +query.page_size > max_page_size,
  ].some(Boolean)

  return isInvalid
}

export const createPaginationDB = (query?: Pagination) => {
  const page = +query?.page || 1
  const pageSize = +query?.page_size || 50
  const offset = (page - 1) * (pageSize + 1)

  return { take: pageSize, skip: offset }
}
