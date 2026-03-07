"use client"

import { AdminCrudPage } from "@/components/admin-crud-page"
import type { Activity } from "@/types"

export default function AdminActivitiesPage() {
  return (
    <AdminCrudPage<Activity>
      title="Admin activities"
      queryKey="admin-activities"
      listEndpoint="activities"
      createEndpoint="create-activity"
      updateEndpoint={(id) => `update-activity/${id}`}
      deleteEndpoint={(id) => `delete-activity/${id}`}
      fields={[
        { name: "categoryId", label: "Category ID", required: true },
        { name: "title", label: "Title", required: true },
        { name: "description", label: "Description", multiline: true, required: true },
        { name: "imageUrls", label: "Image URLs (comma separated)", multiline: true, required: true },
        { name: "price", label: "Price", required: true },
        { name: "price_discount", label: "Price discount", required: true },
        { name: "rating", label: "Rating", required: true },
        { name: "total_reviews", label: "Total reviews", required: true },
        { name: "facilities", label: "Facilities (HTML allowed)", multiline: true, required: true },
        { name: "address", label: "Address", required: true },
        { name: "province", label: "Province", required: true },
        { name: "city", label: "City", required: true },
        { name: "location_maps", label: "Location maps (HTML allowed)", multiline: true, required: true },
      ]}
      mapInitial={(item) => ({
        categoryId: item?.categoryId ?? "",
        title: item?.title ?? "",
        description: item?.description ?? "",
        imageUrls: item?.imageUrls?.join(",") ?? "",
        price: String(item?.price ?? ""),
        price_discount: String(item?.price_discount ?? ""),
        rating: String(item?.rating ?? ""),
        total_reviews: String(item?.total_reviews ?? ""),
        facilities: item?.facilities ?? "",
        address: item?.address ?? "",
        province: item?.province ?? "",
        city: item?.city ?? "",
        location_maps: item?.location_maps ?? "",
      })}
      renderItem={(activity) => (
        <div>
          <p className="font-medium">{activity.title}</p>
          <p className="text-sm text-slate-600">{activity.city}</p>
        </div>
      )}
      transformPayload={(payload) => ({
        ...payload,
        imageUrls: payload.imageUrls
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        price: Number(payload.price),
        price_discount: Number(payload.price_discount),
        rating: Number(payload.rating),
        total_reviews: Number(payload.total_reviews),
      })}
    />
  )
}
