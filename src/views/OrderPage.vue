<template>
  <!-- <v-container> -->
  <v-card class="min-h-[850px] mt-4 mx-4">
    <div class="text-xl font-bold ma-4">รายการสั่งซื้อสินค้า</div>
    <v-card-title>
      <v-row>
        <v-col md="4">
          <v-text-field
            v-model="search"
            label="ค้นหารายการสั่งซื้อ"
            hide-details
            variant="outlined"
            density="comfortable"
            placeholder="รหัสสั่งซื้อ, ชื่อผู้ส่ง"
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
          >สั่งซื้อสินค้า</v-btn
        >
        <AddOrderDialog ref="dialogRef" :products="products" :customers="customers" @order-added="handleProductAdded" />
      </div>
    </v-card-title>
    <!-- :sort-by="sortBy" -->
    <div class="px-4">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items-length="total"
        :headers="headers"
        :items="orders"
        :loading="loading"
        :search="search"
        class="elevation-1"
        :items-per-page-options="[10, 50, 100]"
        @update:options="loadOrders"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.fullname="{ item }">
          {{ item.first_name }} {{ item.family_name }}
        </template>
        <template #item.oparetor="{ item }">
          {{ item.user_first_name }} {{ item.user_family_name }}
        </template>
        <template #item.created_at="{ item }">
          {{ dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss") }}
        </template>
        <template #item.action="{ item }">
                      <!-- @click="openHistory(item)" -->
          <v-btn

            size="x-small"
            class="mx-2"
            color="#5865f2"
            ><v-icon>mdi-history</v-icon></v-btn
          >
          <!-- @click="delProduct(item)" -->
          <v-btn  size="x-small" color="error"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </template>
      </v-data-table-server>
      <HistoryOrderDialog
        ref="dialogEditRef"
      />
    </div>
  </v-card>
  <!-- </v-container> -->
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import api from "@/plugins/axios";
import AddOrderDialog from "@/components/order/AddOrderDialog.vue";
import HistoryOrderDialog from "@/components/order/HistoryOrderDialog.vue";
import dayjs from "dayjs";
import { alertError, alertSuccess, alertDelete } from "@/utils/alert";

// --- state
const orders = ref([]);
const total = ref(0);
const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const search = ref("");
const dialogRef = ref();
const dialogEditRef = ref();
const products = ref([]);
const customers = ref([]);
// const type_id = ref(null);
const selectedOrders = ref(null);
// const sortBy = ref([{ key: "created_at", order: "desc" }]);

const openHistory = (item) => {
  dialogEditRef.value.open(item);
};

const delProduct = async (item) => {
  const confirm = await alertDelete(item);
  if (confirm.isConfirmed) {
    try {
      const res = await api.delete("/orders/delete", {
        data: { id: item.id },
      });

      alertSuccess(res.data.msg || "ลบข้อมูลเรียบร้อยแล้ว");
      loadOrders();
    } catch (err) {
      alertError(err.response?.data?.msg || "เกิดข้อผิดพลาด");
    }
  }
};

// --- headers
const headers = [
  { title: "#", key: "index", sortable: false },
  { title: "รหัสสั่งซื้อ", key: "order_id", sortable: false },
  {
    title: "ชื่อผู้สั่ง",
    key: "fullname",
    sortable: false,
  },
  { title: "เบอร์โทรศัพท์", key: "phone", sortable: false },
  { title: "จังหวัด", key: "province", sortable: false },
  { title: "ราคารวม", key: "total_price", sortable: false, align: "end" },
  { title: "คะแนนรวม", key: "point", sortable: false, align: "center" },
  { title: "ผู้ทำรายการ", key: "oparetor", sortable: false, align: "center" },
  { title: "วันที่สร้าง", key: "created_at", sortable: false, align: "center" },
  { title: "action", key: "action", sortable: false, align: "center" },
];

// --- load data from API
const loadOrders = async () => {
  loading.value = true;

  try {
    const { data } = await api.get("/orders/list", {
      params: {
        page: page.value,
        per_page: itemsPerPage.value,
        search: search.value ? search.value : undefined,
        // type_id: type_id.value,
        // sort_by: sortBy.value[0]?.key || "",
        // sort_order: sortBy.value[0]?.order || "",
      },
    });

    orders.value = data.data;
    total.value = data.pagination.total;
  } catch (error) {
    alertError(error.response.data.msg);
  } finally {
    loading.value = false;
  }
};

const loadProducts = async () => {
  loading.value = true;

  try {
    const { data } = await api.get("/products/list");

    products.value = data.data;
  } catch (e) {
    console.error("โหลดข้อมูลไม่สำเร็จ", e);
  } finally {
    loading.value = false;
  }
};

const loadCustomers = async () => {
  loading.value = true;

  try {
    const { data } = await api.get("/customers/list");

    customers.value = data.data;
  } catch (e) {
    console.error("โหลดข้อมูลไม่สำเร็จ", e);
  } finally {
    loading.value = false;
  }
};

const handleProductAdded = async (newProduct) => {
  await loadOrders()
}

// --- watch search trigger load
// watch(type_id, () => {
//   page.value = 1; // reset page
//   loadProducts();
// });

onMounted(() => {
  loadProducts();
  loadCustomers();
});
</script>
