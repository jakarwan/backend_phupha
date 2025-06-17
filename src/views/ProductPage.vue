<template>
  <!-- <v-container> -->
  <v-card class="min-h-[850px] mt-4 mx-4">
    <div class="text-xl font-bold ma-4">รายการสินค้า</div>
    <v-card-title>
      <v-row>
        <v-col md="4">
          <v-text-field
            v-model="search"
            label="ค้นหาสินค้า"
            hide-details
            variant="outlined"
            density="comfortable"
            placeholder="รหัสสินค้า, ชื่อสินค้า"
          />
        </v-col>
        <!-- <v-col md="3">
          <v-select
            v-model="type_id"
            :items="types"
            label="ประเภทสินค้า"
            item-title="type_name"
            item-value="type_id"
            variant="outlined"
            density="comfortable"
            clearable
          />
        </v-col> -->
      </v-row>
      <div class="float-end">
        <v-btn @click="dialogRef.isOpen = true" color="indigo-darken-3"
          >เพิ่มสินค้า</v-btn
        >
        <AddProductDialog ref="dialogRef" :types="types" @product-added="handleProductAdded" />
      </div>
    </v-card-title>
    <!-- :sort-by="sortBy" -->
    <div class="px-4">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items-length="total"
        :headers="headers"
        :items="products"
        :loading="loading"
        :search="search"
        class="elevation-1"
        :items-per-page-options="[10, 50, 100]"
        @update:options="loadProducts"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.image="{ item }">
          <v-img
            :src="item.image_url"
            max-width="50"
            max-height="50"
          />
        </template>
        <template #item.created_at="{ item }">
          {{ dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss") }}
        </template>
        <template #item.action="{ item }">
          <v-btn
            @click="editProduct(item)"
            size="x-small"
            class="mx-2"
            color="#5865f2"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
          <v-btn @click="delProduct(item)" size="x-small" color="error"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </template>
      </v-data-table-server>
      <EditProductDialog
        ref="dialogEditRef"
        :types="types"
        @updated="handleProductUpdated"
      />
    </div>
  </v-card>
  <!-- </v-container> -->
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import api from "@/plugins/axios";
import AddProductDialog from "@/components/product/AddProductDialog.vue";
import EditProductDialog from "@/components/product/EditProductDialog.vue";
import dayjs from "dayjs";
import { alertError, alertSuccess, alertDelete } from "@/utils/alert";

// --- state
const products = ref([]);
const total = ref(0);
const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const search = ref("");
const dialogRef = ref();
const dialogEditRef = ref();
const types = ref([]);
// const type_id = ref(null);
const selectedProducts = ref(null);
// const sortBy = ref([{ key: "created_at", order: "desc" }]);

const editProduct = (item) => {
  dialogEditRef.value.open(item);
};

const delProduct = async (item) => {
  const confirm = await alertDelete(item);
  if (confirm.isConfirmed) {
    try {
      const res = await api.delete("/products/delete", {
        data: { id: item.id },
      });

      alertSuccess(res.data.msg || "ลบข้อมูลเรียบร้อยแล้ว");
      loadProducts();
    } catch (err) {
      alertError(err.response?.data?.msg || "เกิดข้อผิดพลาด");
    }
  }
};

// --- headers
const headers = [
  { title: "#", key: "index", sortable: false },
  { title: "ภาพ", key: "image", sortable: false },
  { title: "รหัสสินค้า", key: "product_id", sortable: false },
  {
    title: "ชื่อสินค้า",
    key: "name",
    sortable: false,
  },
  { title: "คำอธิบายสินค้า", key: "description", sortable: false },
  { title: "ราคาสินค้า", key: "price", sortable: false, align: "end" },
  { title: "แต้มสินค้า", key: "point", sortable: false, align: "center" },
  { title: "จำนวนสินค้า", key: "stock", sortable: false, align: "center" },
  { title: "action", key: "action", sortable: false, align: "center" },
];

// --- load data from API
const loadProducts = async () => {
  loading.value = true;

  try {
    const { data } = await api.get("/products/list", {
      params: {
        page: page.value,
        per_page: itemsPerPage.value,
        search: search.value ? search.value : undefined,
        // type_id: type_id.value,
        // sort_by: sortBy.value[0]?.key || "",
        // sort_order: sortBy.value[0]?.order || "",
      },
    });

    products.value = data.data;
    total.value = data.pagination.total;
  } catch (error) {
    alertError(error.response.data.msg);
  } finally {
    loading.value = false;
  }
};

const loadTypes = async () => {
  loading.value = true;

  try {
    const { data } = await api.get("/types/list");

    types.value = data.data;
  } catch (e) {
    console.error("โหลดข้อมูลไม่สำเร็จ", e);
  } finally {
    loading.value = false;
  }
};

const handleProductUpdated = (updatedData) => {
  loadProducts();
};

const handleProductAdded = async (newProduct) => {
  await loadProducts()
}

// --- watch search trigger load
// watch(type_id, () => {
//   page.value = 1; // reset page
//   loadProducts();
// });

onMounted(() => {
  loadTypes();
});
</script>
