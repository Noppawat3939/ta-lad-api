import { FindOneOptions, FindOptionsWhere } from 'typeorm'

export type Pagination = { page: string; page_size: string }

export type Where<E> = FindOptionsWhere<E> | FindOptionsWhere<E>[]

export type SortOrder<E> = FindOneOptions<E>['order']

export type IncludedSellerProduct = (
  | 'product'
  | 'userSeller'
  | 'groupProduct'
)[]

export type IncludeProductCart = ('product' | 'user')[]

export type QueryProduct = Partial<{ category_name: string }>
