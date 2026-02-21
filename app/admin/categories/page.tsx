"use client"

import { AdminCrudPage } from "@/components/admin-crud-page"
import type { Category } from "@/types"

export default function AdminCategoriesPage() {
  return (
    <AdminCrudPage<Category>
      title="Admin categories"
      queryKey="admin-categories"
      listEndpoint="categories"
      createEndpoint="create-category"
      updateEndpoint={(id) => `update-category/${id}`}
      deleteEndpoint={(id) => `delete-category/${id}`}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "imageUrl", label: "Image URL", required: true },
      ]}
      mapInitial={(item) => ({
        name: item?.name ?? "",
        imageUrl: item?.imageUrl ?? "",
      })}
      renderItem={(category) => (
        <div>
          <p className="font-medium">{category.name}</p>
          <img src={category.imageUrl} alt={category.name} className="mt-2 h-24 w-full rounded object-cover" />
        </div>
      )}
    />
  )
}

