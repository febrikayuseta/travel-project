"use client"

import { AdminCrudPage } from "@/components/admin-crud-page"
import type { Promo } from "@/types"

export default function AdminPromosPage() {
  return (
    <AdminCrudPage<Promo>
      title="Admin promos"
      queryKey="admin-promos"
      listEndpoint="promos"
      createEndpoint="create-promo"
      updateEndpoint={(id) => `update-promo/${id}`}
      deleteEndpoint={(id) => `delete-promo/${id}`}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "description", label: "Description", multiline: true, required: true },
        { name: "imageUrl", label: "Image URL", required: true },
        { name: "terms_condition", label: "Terms (HTML allowed)", multiline: true, required: true },
        { name: "promo_code", label: "Promo code", required: true },
        { name: "promo_discount_price", label: "Discount price", required: true },
        { name: "minimum_claim_price", label: "Minimum claim price", required: true },
      ]}
      mapInitial={(item) => ({
        title: item?.title ?? "",
        description: item?.description ?? "",
        imageUrl: item?.imageUrl ?? "",
        terms_condition: item?.terms_condition ?? "",
        promo_code: item?.promo_code ?? "",
        promo_discount_price: String(item?.promo_discount_price ?? ""),
        minimum_claim_price: String(item?.minimum_claim_price ?? ""),
      })}
      renderItem={(promo) => (
        <div>
          <p className="font-medium">{promo.title}</p>
          <p className="text-sm text-slate-600">{promo.promo_code}</p>
        </div>
      )}
    />
  )
}

