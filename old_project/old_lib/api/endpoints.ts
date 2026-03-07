import client from "@/lib/api/client"
import { parseApiData } from "@/lib/utils"
import type {
  Activity,
  Banner,
  Cart,
  Category,
  CreateActivityPayload,
  CreateBannerPayload,
  CreateCategoryPayload,
  CreatePromoPayload,
  LoginPayload,
  PaymentMethod,
  Promo,
  RegisterPayload,
  Transaction,
  UpdateActivityPayload,
  UpdateBannerPayload,
  UpdateCategoryPayload,
  UpdatePromoPayload,
  User,
} from "@/types"

export const endpoints = {
  auth: {
    register: "/api/v1/register",
    login: "/api/v1/login",
    logout: "/api/v1/logout",
  },
  users: {
    me: "/api/v1/user",
    all: "/api/v1/all-user",
    updateProfile: "/api/v1/update-profile",
    updateRole: (userId: string) => `/api/v1/update-user-role/${userId}`,
  },
  banners: {
    list: "/api/v1/banners",
    detail: (bannerId: string) => `/api/v1/banner/${bannerId}`,
    create: "/api/v1/create-banner",
    update: (bannerId: string) => `/api/v1/update-banner/${bannerId}`,
    delete: (bannerId: string) => `/api/v1/delete-banner/${bannerId}`,
  },
  promos: {
    list: "/api/v1/promos",
    detail: (promoId: string) => `/api/v1/promo/${promoId}`,
    create: "/api/v1/create-promo",
    update: (promoId: string) => `/api/v1/update-promo/${promoId}`,
    delete: (promoId: string) => `/api/v1/delete-promo/${promoId}`,
  },
  categories: {
    list: "/api/v1/categories",
    detail: (categoryId: string) => `/api/v1/category/${categoryId}`,
    create: "/api/v1/create-category",
    update: (categoryId: string) => `/api/v1/update-category/${categoryId}`,
    delete: (categoryId: string) => `/api/v1/delete-category/${categoryId}`,
  },
  activities: {
    list: "/api/v1/activities",
    detail: (activityId: string) => `/api/v1/activity/${activityId}`,
    byCategory: (categoryId: string) => `/api/v1/activities-by-category/${categoryId}`,
    create: "/api/v1/create-activity",
    update: (activityId: string) => `/api/v1/update-activity/${activityId}`,
    delete: (activityId: string) => `/api/v1/delete-activity/${activityId}`,
  },
  paymentMethods: {
    list: "/api/v1/payment-methods",
    generate: "/api/v1/generate-payment-methods",
  },
  carts: {
    list: "/api/v1/carts",
    add: "/api/v1/add-cart",
    update: (cartId: string) => `/api/v1/update-cart/${cartId}`,
    delete: (cartId: string) => `/api/v1/delete-cart/${cartId}`,
  },
  transactions: {
    mine: "/api/v1/my-transactions",
    all: "/api/v1/all-transactions",
    detail: (transactionId: string) => `/api/v1/transaction/${transactionId}`,
    create: "/api/v1/create-transaction",
    cancel: (transactionId: string) => `/api/v1/cancel-transaction/${transactionId}`,
    updateProof: (transactionId: string) =>
      `/api/v1/update-transaction-proof-payment/${transactionId}`,
    updateStatus: (transactionId: string) =>
      `/api/v1/update-transaction-status/${transactionId}`,
  },
  upload: {
    image: "/api/v1/upload-image",
  },
}

type UpdateProfilePayload = {
  name: string
  email: string
  profilePictureUrl?: string
  phoneNumber?: string
}

export const api = {
  auth: {
    async register(payload: RegisterPayload) {
      const res = await client.post(endpoints.auth.register, payload)
      return parseApiData<User>(res.data)
    },
    async login(payload: LoginPayload) {
      const res = await client.post(endpoints.auth.login, payload)
      return parseApiData<{ token: string }>(res.data)
    },
    async logout() {
      const res = await client.get(endpoints.auth.logout)
      return res.data
    },
  },
  users: {
    async me() {
      const res = await client.get(endpoints.users.me)
      return parseApiData<User>(res.data)
    },
    async all() {
      const res = await client.get(endpoints.users.all)
      return parseApiData<User[]>(res.data)
    },
    async updateProfile(payload: UpdateProfilePayload) {
      const res = await client.post(endpoints.users.updateProfile, payload)
      return parseApiData<User>(res.data)
    },
    async updateRole(userId: string, role: "user" | "admin") {
      const res = await client.post(endpoints.users.updateRole(userId), { role })
      return parseApiData<User>(res.data)
    },
  },
  banners: {
    async list() {
      const res = await client.get(endpoints.banners.list)
      return parseApiData<Banner[]>(res.data)
    },
    async detail(id: string) {
      const res = await client.get(endpoints.banners.detail(id))
      return parseApiData<Banner>(res.data)
    },
    async create(payload: CreateBannerPayload) {
      const res = await client.post(endpoints.banners.create, payload)
      return parseApiData<Banner>(res.data)
    },
    async update(id: string, payload: UpdateBannerPayload) {
      const res = await client.post(endpoints.banners.update(id), payload)
      return parseApiData<Banner>(res.data)
    },
    async remove(id: string) {
      const res = await client.delete(endpoints.banners.delete(id))
      return res.data
    },
  },
  promos: {
    async list() {
      const res = await client.get(endpoints.promos.list)
      return parseApiData<Promo[]>(res.data)
    },
    async detail(id: string) {
      const res = await client.get(endpoints.promos.detail(id))
      return parseApiData<Promo>(res.data)
    },
    async create(payload: CreatePromoPayload) {
      const res = await client.post(endpoints.promos.create, payload)
      return parseApiData<Promo>(res.data)
    },
    async update(id: string, payload: UpdatePromoPayload) {
      const res = await client.post(endpoints.promos.update(id), payload)
      return parseApiData<Promo>(res.data)
    },
    async remove(id: string) {
      const res = await client.delete(endpoints.promos.delete(id))
      return res.data
    },
  },
  categories: {
    async list() {
      const res = await client.get(endpoints.categories.list)
      return parseApiData<Category[]>(res.data)
    },
    async detail(id: string) {
      const res = await client.get(endpoints.categories.detail(id))
      return parseApiData<Category>(res.data)
    },
    async create(payload: CreateCategoryPayload) {
      const res = await client.post(endpoints.categories.create, payload)
      return parseApiData<Category>(res.data)
    },
    async update(id: string, payload: UpdateCategoryPayload) {
      const res = await client.post(endpoints.categories.update(id), payload)
      return parseApiData<Category>(res.data)
    },
    async remove(id: string) {
      const res = await client.delete(endpoints.categories.delete(id))
      return res.data
    },
  },
  activities: {
    async list() {
      const res = await client.get(endpoints.activities.list)
      return parseApiData<Activity[]>(res.data)
    },
    async detail(id: string) {
      const res = await client.get(endpoints.activities.detail(id))
      return parseApiData<Activity>(res.data)
    },
    async byCategory(categoryId: string) {
      const res = await client.get(endpoints.activities.byCategory(categoryId))
      return parseApiData<Activity[]>(res.data)
    },
    async create(payload: CreateActivityPayload) {
      const res = await client.post(endpoints.activities.create, payload)
      return parseApiData<Activity>(res.data)
    },
    async update(id: string, payload: UpdateActivityPayload) {
      const res = await client.post(endpoints.activities.update(id), payload)
      return parseApiData<Activity>(res.data)
    },
    async remove(id: string) {
      const res = await client.delete(endpoints.activities.delete(id))
      return res.data
    },
  },
  paymentMethods: {
    async list() {
      const res = await client.get(endpoints.paymentMethods.list)
      return parseApiData<PaymentMethod[]>(res.data)
    },
    async generate() {
      const res = await client.post(endpoints.paymentMethods.generate)
      return res.data
    },
  },
  carts: {
    async list() {
      const res = await client.get(endpoints.carts.list)
      return parseApiData<Cart[]>(res.data)
    },
    async add(activityId: string) {
      const res = await client.post(endpoints.carts.add, { activityId })
      return parseApiData<Cart>(res.data)
    },
    async update(cartId: string, quantity: number) {
      const res = await client.post(endpoints.carts.update(cartId), { quantity })
      return parseApiData<Cart>(res.data)
    },
    async remove(cartId: string) {
      const res = await client.delete(endpoints.carts.delete(cartId))
      return res.data
    },
  },
  transactions: {
    async mine() {
      const res = await client.get(endpoints.transactions.mine)
      return parseApiData<Transaction[]>(res.data)
    },
    async all() {
      const res = await client.get(endpoints.transactions.all)
      return parseApiData<Transaction[]>(res.data)
    },
    async detail(id: string) {
      const res = await client.get(endpoints.transactions.detail(id))
      return parseApiData<Transaction>(res.data)
    },
    async create(cartIds: string[], paymentMethodId: string) {
      const res = await client.post(endpoints.transactions.create, { cartIds, paymentMethodId })
      return parseApiData<Transaction>(res.data)
    },
    async cancel(id: string) {
      const res = await client.post(endpoints.transactions.cancel(id))
      return parseApiData<Transaction>(res.data)
    },
    async updateProof(id: string, proofPaymentUrl: string) {
      const res = await client.post(endpoints.transactions.updateProof(id), { proofPaymentUrl })
      return parseApiData<Transaction>(res.data)
    },
    async updateStatus(id: string, status: "success" | "failed") {
      const res = await client.post(endpoints.transactions.updateStatus(id), { status })
      return parseApiData<Transaction>(res.data)
    },
  },
}

