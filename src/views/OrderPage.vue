<template>
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
      </v-row>
      <div class="float-end">
        <v-btn @click="openAddDialog" color="indigo-darken-3">
          สั่งซื้อสินค้า
        </v-btn>
        <AddOrderDialog
          ref="dialogRef"
          :products="products"
          :customers="customers"
          @order-added="handleOrderAdded"
        />
      </div>
    </v-card-title>

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
          {{ (page - 1) * itemsPerPage + index + 1 }}
        </template>
        <template #item.fullname="{ item }">
          {{ item.first_name }} {{ item.family_name }}
        </template>
        <template #item.operator="{ item }">
          {{ item.user_first_name }} {{ item.user_family_name }}
        </template>
        <template #item.created_at="{ item }">
          {{ dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss") }}
        </template>
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            class="ml-2"
          >
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>
        <template #item.action="{ item }">
          <v-btn
            @click="openHistory(item)"
            size="x-small"
            class="mx-2"
            color="#5865f2"
          >
            <v-icon>mdi-history</v-icon>
          </v-btn>
          <!-- <v-btn @click="delOrder(item)" size="x-small" color="error">
            <v-icon>mdi-delete</v-icon>
          </v-btn> -->
        </template>
      </v-data-table-server>

      <!-- History Dialog Component -->
      <HistoryOrderDialog
        ref="dialogEditRef"
        @order-updated="handleOrderUpdated"
      />
    </div>
  </v-card>
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
const dialogRef = ref(null);
const dialogEditRef = ref(null);
const products = ref([]);
const customers = ref([]);

// เปิด Add Order Dialog
const openAddDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.openDialog();
  }
};

const getStatusColor = (status) => {
  const colors = {
    pending: "orange",
    shipping: "purple",
    delivered: "green",
    cancelled: "red",
  };
  return colors[status] || "grey";
};

const getStatusText = (status) => {
  const texts = {
    pending: "รอดำเนินการ",
    shipping: "กำลังจัดส่ง",
    delivered: "จัดส่งสำเร็จ",
    cancelled: "ยกเลิก"
  };
  return texts[status] || "ไม่ระบุ";
};

// เปิด History Dialog
const openHistory = (item) => {
  if (dialogEditRef.value && typeof dialogEditRef.value.open === "function") {
    dialogEditRef.value.open(item);
  } else {
    alertError("ไม่สามารถเปิดหน้าต่างรายละเอียดได้");
  }
};

// ลบ Order
// const delOrder = async (item) => {
//   const confirm = await alertDelete(
//     `คุณต้องการลบรายการสั่งซื้อ ${item.order_id} หรือไม่?`
//   );
//   if (confirm.isConfirmed) {
//     try {
//       const res = await api.delete("/orders/delete", {
//         data: { id: item.id },
//       });

//       alertSuccess(res.data.msg || "ลบข้อมูลเรียบร้อยแล้ว");
//       await loadOrders();
//     } catch (err) {
//       alertError(err.response?.data?.msg || "เกิดข้อผิดพลาด");
//     }
//   }
// };

// --- headers
const headers = [
  { title: "#", key: "index", sortable: false },
  { title: "รหัสสั่งซื้อ", key: "order_id", sortable: false },
  { title: "ชื่อผู้สั่ง", key: "fullname", sortable: false },
  { title: "เบอร์โทรศัพท์", key: "phone", sortable: false },
  { title: "จังหวัด", key: "province", sortable: false },
  { title: "ราคารวม", key: "total_price", sortable: false, align: "end" },
  { title: "คะแนนรวม", key: "point", sortable: false, align: "center" },
  { title: "ผู้ทำรายการ", key: "operator", sortable: false, align: "center" },
  { title: "สถานะ", key: "status", sortable: false, align: "center" },
  { title: "วันที่สร้าง", key: "created_at", sortable: false, align: "center" },
  { title: "จัดการ", key: "action", sortable: false, align: "center" },
];

// --- load data from API
const loadOrders = async () => {
  loading.value = true;

  try {
    const { data } = await api.get("/orders/list", {
      params: {
        page: page.value,
        per_page: itemsPerPage.value,
        search: search.value || undefined,
      },
    });

    orders.value = data.data;
    total.value = data.pagination.total;
  } catch (error) {
    console.error("โหลดข้อมูลออเดอร์ไม่สำเร็จ:", error);
    alertError(error.response?.data?.msg || "โหลดข้อมูลไม่สำเร็จ");
  } finally {
    loading.value = false;
  }
};

const loadProducts = async () => {
  try {
    const { data } = await api.get("/products/list");
    products.value = data.data;
  } catch (error) {
    console.error("โหลดข้อมูลสินค้าไม่สำเร็จ:", error);
    alertError("โหลดข้อมูลสินค้าไม่สำเร็จ");
  }
};

const loadCustomers = async () => {
  try {
    const { data } = await api.get("/customers/list");
    customers.value = data.data;
  } catch (error) {
    console.error("โหลดข้อมูลลูกค้าไม่สำเร็จ:", error);
    alertError("โหลดข้อมูลลูกค้าไม่สำเร็จ");
  }
};

// Handle events
const handleOrderAdded = async () => {
  await loadOrders();
};

const handleOrderUpdated = async () => {
  await loadOrders();
};

// Watch search with debounce
let searchTimeout;
watch(search, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    loadOrders();
  }, 300);
});

onMounted(async () => {
  await Promise.all([loadOrders(), loadProducts(), loadCustomers()]);
});
</script>
