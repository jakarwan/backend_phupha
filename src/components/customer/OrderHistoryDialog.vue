<template>
  <v-dialog
    v-model="dialog"
    max-width="1200"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="history-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <v-card-title class="d-flex align-center pa-6">
          <v-avatar size="56" color="white" class="mr-4 elevation-2">
            <v-icon size="28" color="green-darken-2">mdi-account-clock</v-icon>
          </v-avatar>
          <div>
            <h2 class="font-weight-bold text-white mb-1">ประวัติการสั่งซื้อ</h2>
            <p class="text-white mb-0" v-if="customer">
              รหัสลูกค้า: {{ customer.member_id }}
            </p>
            <div class="text-white mb-0" v-if="customer">
              ชื่อลูกค้า: {{ customer.first_name }}
              {{ customer.family_name }}
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" @click="closeDialog" class="text-white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
      </div>

      <!-- Customer Summary -->
      <v-card-text class="pa-0">
        <!-- Orders Table -->
        <div class="orders-section">
          <v-data-table
            :headers="headers"
            :items="orders"
            :loading="loading"
            :items-per-page="10"
            class="history-table"
          >
            <!-- Order Number -->
            <template v-slot:item.order_number="{ item }">
              <div class="font-weight-medium text-green-darken-2">
                {{ item.order_number }}
              </div>
            </template>

            <!-- Date -->
            <template v-slot:item.created_at="{ item }">
              <div>
                <div class="text-body-2">
                  {{ formatDate(item.created_at) }}
                </div>
                <div class="text-caption text-grey">
                  {{ formatTime(item.created_at) }}
                </div>
              </div>
            </template>

            <!-- Status -->
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                :text-color="getStatusTextColor(item.status)"
                size="small"
                label
              >
                <v-icon start size="16">{{
                  getStatusIcon(item.status)
                }}</v-icon>
                {{ getStatusText(item.status) }}
              </v-chip>
            </template>

            <!-- Total -->
            <template v-slot:item.total_price="{ item }">
              <div class="text-right font-weight-medium">
                ฿{{ formatCurrency(item.total_price) }}
              </div>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                size="small"
                variant="text"
                color="green"
                @click="viewOrderDetail(item)"
              >
                <v-icon>mdi-eye</v-icon>
                <v-tooltip activator="parent" location="top">
                  ดูรายละเอียด
                </v-tooltip>
              </v-btn>
            </template>

            <!-- Loading -->
            <template v-slot:loading>
              <v-skeleton-loader
                v-for="i in 5"
                :key="i"
                type="table-row"
                class="mb-2"
              ></v-skeleton-loader>
            </template>

            <!-- No Data -->
            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon size="64" color="grey-lighten-1" class="mb-4">
                  mdi-package-variant-closed
                </v-icon>
                <p class="text-h6 text-grey-darken-1">
                  ไม่พบประวัติการสั่งซื้อ
                </p>
                <p class="text-body-2 text-grey">
                  ลูกค้ารายนี้ยังไม่มีประวัติการสั่งซื้อสินค้า
                </p>
              </div>
            </template>

          </v-data-table>
        </div>
      </v-card-text>

      <!-- Footer -->
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeDialog"> ปิด </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Order Detail Dialog -->
  <v-dialog
    v-model="detailDialog"
    max-width="800"
    transition="dialog-transition"
  >
    <v-card v-if="selectedOrder">
      <v-card-title class="bg-green-lighten-5 text-green-darken-3">
        <v-icon class="mr-2">mdi-receipt-text</v-icon>
        รายละเอียดคำสั่งซื้อ
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Order Info -->
        <div class="mb-6">
          <h3 class="mb-3">รายการสั่งซื้อ</h3>
        </div>

        <!-- <v-divider class="mb-6"></v-divider> -->

        <!-- Products List -->
        <div>
          <!-- <h3 class="text-h6 mb-3">รายการสินค้า</h3> -->
          <!-- <v-list lines="two" class="pa-0">
            <v-list-item
              v-for="(product, idx) in selectedOrder"
              :key="idx"
              class="px-0 py-3"
            >
              <template v-slot:prepend>
                <v-avatar size="48" rounded color="grey-lighten-3">
                  <v-img :src="product.image_url"></v-img>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ idx + 1 }} . {{ product.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                ฿{{ formatCurrency(product.price) }} x {{ product.quantity }} =
                ฿{{ formatCurrency(product.price * product.quantity) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list> -->
          <v-row class="max-h-[300px] overflow-auto">
            <v-col
              cols="12"
              v-for="(item, index) in selectedOrder"
              :key="index"
              style="padding: 5px"
            >
              <v-card elevation="2" class="pa-3">
                <v-row align="center">
                  <!-- ลำดับ -->
                  <v-col cols="1" class="text-center" style="padding: 5px">
                    <v-chip color="primary" size="small">{{
                      index + 1
                    }}</v-chip>
                  </v-col>

                  <!-- รูปภาพ -->
                  <v-col cols="2" style="padding: 5px">
                    <v-img
                      width="60px"
                      height="60px"
                      :src="item.image_url"
                      contain
                      class="rounded"
                    ></v-img>
                  </v-col>

                  <!-- ข้อมูลสินค้า -->
                  <v-col cols="3" style="padding: 5px">
                    <div class="font-weight-bold">{{ item.name }}</div>
                    <div class="text-grey">รหัส: {{ item.product_id }}</div>
                    <div class="text-primary">{{ item.price }} บาท</div>
                  </v-col>

                  <!-- ปุ่มจำนวน -->
                  <v-col cols="3" class="d-flex justify-center">
                    <div
                      class="d-flex align-center border rounded-lg pa-1"
                      style="width: 140px; background-color: #f5f5f5"
                    >
                      <v-btn
                        icon="mdi-minus"
                        variant="text"
                        size="small"
                        disabled
                        style="min-width: 32px; width: 32px"
                      ></v-btn>

                      <div
                        class="flex-grow-1 d-flex justify-center align-center"
                      >
                        <input
                          v-model.number="item.quantity"
                          type="number"
                          min="1"
                          style="
                            width: 50px;
                            text-align: center;
                            border: none;
                            outline: none;
                            background: transparent;
                            font-size: 14px;
                            font-weight: 500;
                            padding: 0;
                            margin: 0;
                          "
                          disabled
                        />
                      </div>

                      <v-btn
                        icon="mdi-plus"
                        variant="text"
                        size="small"
                        disabled
                        style="min-width: 32px; width: 32px"
                      ></v-btn>
                    </div>
                  </v-col>

                  <!-- ราคารวม -->
                  <v-col cols="2" class="text-center p-1">
                    <div class="text-success font-weight-bold">
                      {{ (item.price * item.quantity).toLocaleString() }} บาท
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- <v-divider class="my-4"></v-divider> -->
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="detailDialog = false"> ปิด </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import dayjs from "dayjs";
import api from "@/plugins/axios";
import { alertError, alertSuccess } from "@/utils/alert";

// Props
const props = defineProps({
  modelValue: Boolean,
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// Dialog State
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Data
const customer = ref(null);
const orders = ref([]);
const loading = ref(false);
const page = ref(1);
const searchOrder = ref("");
const filterStatus = ref(null);
const dateRange = ref([]);
const dateMenu = ref(false);
const detailDialog = ref(false);
const selectedOrder = ref(null);

// Computed
const dateRangeText = computed(() => {
  if (!dateRange.value.length) return "";
  return dateRange.value
    .map((date) => dayjs(date).format("DD/MM/YYYY"))
    .join(" - ");
});

const pageCount = computed(() => {
  return Math.ceil(orders.value.length / 10);
});

// Constants
const orderStatuses = [
  { title: "ทั้งหมด", value: null },
  { title: "รอดำเนินการ", value: "pending" },
  { title: "กำลังจัดส่ง", value: "shipping" },
  { title: "จัดส่งแล้ว", value: "delivered" },
  { title: "ยกเลิก", value: "cancelled" },
];

const headers = [
  { title: "เลขที่คำสั่งซื้อ", key: "order_id", sortable: false },
  { title: "วันที่", key: "created_at", sortable: false },
  { title: "สถานะ", key: "status", sortable: false },
  { title: "ยอดรวม", key: "total_price", sortable: false, align: "end" },
  { title: "", key: "actions", sortable: false, align: "center" },
];

// Methods
const open = async (customerData) => {
  customer.value = customerData;
  dialog.value = true;
  await loadOrderHistory();
};

const closeDialog = () => {
  dialog.value = false;
  customer.value = null;
  orders.value = [];
  resetFilters();
};

const resetFilters = () => {
  searchOrder.value = "";
  filterStatus.value = null;
  dateRange.value = [];
  page.value = 1;
};

const loadOrderHistory = async () => {
  if (!customer.value) return;

  loading.value = true;
  try {
    const params = {
      id: customer.value.id,
      search: searchOrder.value || undefined,
      status: filterStatus.value || undefined,
      start_date: dateRange.value[0] || undefined,
      end_date: dateRange.value[1] || undefined,
    };

    const { data } = await api.get("/customers/order", { params });
    console.log(data.data, "data");
    orders.value = data.data || [];

    // Update customer summary
    if (data.summary) {
      customer.value = { ...customer.value, ...data.summary };
    }
  } catch (error) {
    alertError(error.response?.data?.msg || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
  } finally {
    loading.value = false;
  }
};

const viewOrderDetail = async (order) => {
  try {
    const { data } = await api.get(`/customers/order-item`, {
      params: {
        order_id: order.id,
      },
    });
    selectedOrder.value = data.data;
    detailDialog.value = true;
  } catch (error) {
    alertError("ไม่สามารถโหลดรายละเอียดคำสั่งซื้อได้");
  }
};

const printInvoice = (order) => {
  // Implement print invoice
  window.open(`/api/orders/invoice/${order.id}`, "_blank");
};

const exportHistory = async () => {
  try {
    const params = {
      member_id: customer.value.id,
      format: "excel",
    };

    const response = await api.get("/orders/export", {
      params,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `order-history-${customer.value.member_id}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();

    alertSuccess("Export สำเร็จ");
  } catch (error) {
    alertError("ไม่สามารถ Export ข้อมูลได้");
  }
};

// Status Helpers
const getStatusColor = (status) => {
  const colors = {
    pending: "orange-lighten-3",
    shipping: "purple-lighten-3",
    delivered: "green-lighten-3",
    cancelled: "red-lighten-3",
  };
  return colors[status] || "grey-lighten-3";
};

const getStatusTextColor = (status) => {
  const colors = {
    pending: "orange-darken-2",
    shipping: "purple-darken-2",
    delivered: "green-darken-2",
    cancelled: "red-darken-2",
  };
  return colors[status] || "grey-darken-2";
};

const getStatusIcon = (status) => {
  const icons = {
    pending: "mdi-clock-outline",
    shipping: "mdi-truck-delivery",
    delivered: "mdi-check-circle",
    cancelled: "mdi-close-circle",
  };
  return icons[status] || "mdi-help-circle";
};

const getStatusText = (status) => {
  const texts = {
    pending: "รอดำเนินการ",
    shipping: "กำลังจัดส่ง",
    delivered: "จัดส่งแล้ว",
    cancelled: "ยกเลิก",
  };
  return texts[status] || status;
};

// Date Formatters
const formatDate = (date) => {
  return dayjs(date).format("DD/MM/YYYY");
};

const formatTime = (date) => {
  return dayjs(date).format("HH:mm น.");
};

const formatDateTime = (date) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm น.");
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH").format(amount);
};

// Watchers
watch([searchOrder, filterStatus, dateRange], () => {
  page.value = 1;
  loadOrderHistory();
});

// Expose
defineExpose({
  open,
});
</script>

<style scoped>
/* Dialog Styles */
.history-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

/* Header */
.dialog-header {
  background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%);
  position: relative;
  overflow: hidden;
}

.dialog-header::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
}

/* Summary Section */
.summary-section {
  background-color: #fafafa;
}

.stat-card {
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Filter Section */
.filter-section {
  background-color: #f5f5f5;
}

.search-field :deep(.v-field) {
  background: white !important;
}

.status-filter :deep(.v-field) {
  background: white !important;
}

/* Table */
.history-table {
  box-shadow: none !important;
}

.history-table :deep(.v-data-table__th) {
  background-color: #e8f5e9 !important;
  color: #2e7d32 !important;
  font-weight: 600 !important;
}

.history-table :deep(tbody tr:hover) {
  background-color: #f5f5f5 !important;
}

/* Chips */
.v-chip {
  font-weight: 500;
}

/* Animations */
.v-dialog {
  transition: all 0.3s ease;
}

/* Responsive */
@media (max-width: 960px) {
  .summary-section .v-col {
    margin-bottom: 1rem;
  }

  .filter-section .v-col {
    margin-bottom: 0.5rem;
  }
}
</style>
