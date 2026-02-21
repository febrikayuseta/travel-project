export type Role = "user" | "admin"

export type ApiMeta = {
  message?: string
  total?: number
}

export type ApiResponse<T> = {
  data: T
  meta?: ApiMeta
  message?: string
}

export type User = {
  id: string
  name?: string
  email: string
  role: Role
  profilePictureUrl?: string
  phoneNumber?: string
}

export type RegisterPayload = {
  email: string
  password: string
  passwordRepeat: string
  role?: Role
  profilePictureUrl?: string
  phoneNumber?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type Banner = {
  id: string
  name: string
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

export type Promo = {
  id: string
  title: string
  description: string
  imageUrl: string
  terms_condition: string
  promo_code: string
  promo_discount_price: number
  minimum_claim_price: number
  createdAt?: string
  updatedAt?: string
}

export type Category = {
  id: string
  name: string
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

export type Activity = {
  id: string
  categoryId: string
  title: string
  description: string
  imageUrls: string[]
  price: number
  price_discount: number
  rating: number
  total_reviews: number
  facilities: string
  address: string
  province: string
  city: string
  location_maps: string
  createdAt?: string
  updatedAt?: string
}

export type Cart = {
  id: string
  activityId: string
  quantity: number
  userId?: string
  activity?: Activity
}

export type PaymentMethod = {
  id: string
  name: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type TransactionStatus = "pending" | "success" | "failed" | "cancelled"

export type Transaction = {
  id: string
  userId: string
  carts: Cart[]
  totalAmount?: number
  proofPaymentUrl?: string
  paymentMethodId?: string
  paymentMethod?: PaymentMethod
  status: TransactionStatus
  createdAt?: string
  updatedAt?: string
}

export type CreateBannerPayload = Pick<Banner, "name" | "imageUrl">
export type UpdateBannerPayload = CreateBannerPayload

export type CreatePromoPayload = Omit<Promo, "id" | "createdAt" | "updatedAt">
export type UpdatePromoPayload = CreatePromoPayload

export type CreateCategoryPayload = Pick<Category, "name" | "imageUrl">
export type UpdateCategoryPayload = CreateCategoryPayload

export type CreateActivityPayload = Omit<Activity, "id" | "createdAt" | "updatedAt">
export type UpdateActivityPayload = CreateActivityPayload
