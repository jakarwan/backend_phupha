<template>
  <v-dialog v-model="isOpen" max-width="1200px" fullscreen>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>รายละเอียดคำสั่งซื้อ</span>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text v-if="orderData">
        <!-- ข้อมูลพื้นฐานของคำสั่งซื้อ -->
        <v-row class="mb-4">
          <v-col cols="12" md="6" style="padding: 5px">
            <v-card variant="outlined" class="pa-4">
              <h3 class="mb-3">ข้อมูลคำสั่งซื้อ</h3>
              <div class="mb-2">
                <strong>รหัสสั่งซื้อ:</strong> {{ orderData.order_id }}
              </div>
              <div class="mb-2">
                <strong>วันที่สั่งซื้อ:</strong>
                {{ formatDate(orderData.created_at) }}
              </div>
              <div class="mb-2">
                <strong>สถานะ:</strong>
                <v-chip
                  :color="getStatusColor(orderData.status)"
                  size="small"
                  class="ml-2"
                >
                  {{ getStatusText(orderData.status) }}
                </v-chip>
              </div>
              <div class="mb-2">
                <strong>ยอดรวม: </strong>
                <span class="text-success font-weight-bold">
                  {{ formatCurrency(orderData.total_price) }} บาท
                </span>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" style="padding: 5px">
            <v-card variant="outlined" class="pa-4">
              <h3 class="mb-3">ข้อมูลลูกค้า</h3>
              <div class="mb-2">
                <strong>ชื่อ:</strong> {{ orderData.first_name }}
                {{ orderData.family_name }}
              </div>
              <div class="mb-2">
                <strong>เบอร์โทร:</strong> {{ orderData.phone }}
              </div>
              <div class="mb-2">
                <strong>จังหวัด:</strong> {{ orderData.province }}
              </div>
              <div class="mb-2">
                <strong>คะแนนที่ได้:</strong> {{ orderData.point }} คะแนน
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- ปรับสถานะ -->
        <v-row class="mb-4">
          <v-col cols="12" style="padding: 5px">
            <v-card variant="outlined" class="pa-4">
              <h3 class="mb-3">จัดการสถานะ</h3>
              <v-row align="center">
                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedStatus"
                    :items="statusOptions"
                    item-title="text"
                    item-value="value"
                    label="เลือกสถานะ"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    @click="updateStatus"
                    color="primary"
                    :loading="updating"
                    :disabled="selectedStatus === orderData.status"
                  >
                    อัปเดตสถานะ
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- รายการสินค้า -->
        <!-- <v-row>
          <v-col cols="12">
            <v-card variant="outlined" class="pa-4">
              <h3 class="mb-3">รายการสินค้า</h3>
              <v-data-table
                :headers="itemHeaders"
                :items="orderItems"
                :loading="loadingItems"
                class="elevation-1"
                no-data-text="ไม่มีข้อมูลสินค้า"
              >
                <template #item.image="{ item }">
                  <v-img
                    :src="item.image_url"
                    width="50"
                    height="50"
                    contain
                    class="rounded"
                  />
                </template>
                <template #item.price="{ item }">
                  {{ formatCurrency(item.price) }} บาท
                </template>
                <template #item.total="{ item }">
                  <span class="font-weight-bold text-success">
                    {{ formatCurrency(item.price * item.quantity) }} บาท
                  </span>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row> -->
        <h3 class="mb-3">
          รายการสั่งซื้อสินค้า
          <span v-if="orderItems.length > 0">
            ({{ orderItems.length }}) รายการ</span
          >
        </h3>
        <v-row class="max-h-[300px] overflow-auto">
          <v-col
            cols="12"
            v-for="(item, index) in orderItems"
            :key="index"
            style="padding: 5px"
          >
            <v-card elevation="2" class="pa-3">
              <v-row align="center">
                <!-- ลำดับ -->
                <v-col cols="1" class="text-center" style="padding: 5px">
                  <v-chip color="primary" size="small">{{ index + 1 }}</v-chip>
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
                  <div class="text-primary">
                    ราคาสูงสุด {{ item.max_price }} บาท
                  </div>
                  <div class="text-primary">
                    ราคาต่ำสุด {{ item.min_price }} บาท
                  </div>
                  <div class="text-warning">
                    คะแนนสินค้า {{ item.product_point }} คะแนน
                  </div>
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

                    <div class="flex-grow-1 d-flex justify-center align-center">
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
                  <div>ราคา</div>
                  <div class="d-flex justify-center">
                    <!-- <v-switch
                      color="primary"
                      inset
                      v-model="ex11"
                      :model-value="Boolean(item.status)"
                      hide-details
                    ></v-switch> -->
                    <v-slider
                      v-model="item.wholesale_price"
                      :max="item.max_price"
                      :min="item.min_price"
                      :step="1"
                      thumb-label="always"
                      color="green"
                      track-color="green-lighten-3"
                      class="mt-8"
                      hide-details
                      readonly
                    >
                      <template v-slot:thumb-label="{ modelValue }">
                        ฿{{ formatNumber(modelValue) }}
                      </template>
                    </v-slider>
                  </div>
                  <span class="text-success font-weight-bold">
                    {{
                      (item.wholesale_price * item.quantity).toLocaleString()
                    }}
                    บาท
                  </span>
                  <span class="text-warning font-weight-bold">
                    ({{ item.point.toLocaleString() }}
                    คะแนน)
                  </span>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- แสดงยอดรวม -->
        <v-row>
          <v-col cols="12" class="text-right">
            <v-card color="primary" variant="tonal" class="pa-3">
              <div class="font-weight-bold">
                คะแนนทั้งหมด: {{ totalPoint() }} คะแนน
              </div>
              <div class="font-weight-bold">
                ยอดรวมทั้งหมด: {{ totalAmount() }} บาท
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="closeDialog" color="grey"> ปิด </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import api from "@/plugins/axios";
import dayjs from "dayjs";
import { alertSuccess, alertError } from "@/utils/alert";

const isOpen = ref(false);
const orderData = ref(null);
const orderItems = ref([]);
const loadingItems = ref(false);
const updating = ref(false);
const selectedStatus = ref("");

const emit = defineEmits(["order-updated"]);

// สถานะต่างๆ
const statusOptions = [
  { text: "รอดำเนินการ", value: "pending" },
  { text: "กำลังจัดส่ง", value: "shipping" },
  { text: "จัดส่งสำเร็จ", value: "delivered" },
  { text: "ยกเลิก", value: "cancelled" },
];

const ex11 = ["primary"];

// Headers สำหรับตารางสินค้า
// const itemHeaders = [
//   { title: "รูปภาพ", key: "image", sortable: false },
//   { title: "ชื่อสินค้า", key: "name", sortable: false },
//   { title: "รหัสสินค้า", key: "product_id", sortable: false },
//   { title: "ราคาต่อหน่วย", key: "price", sortable: false },
//   { title: "จำนวน", key: "quantity", sortable: false },
//   { title: "ราคารวม", key: "total", sortable: false },
// ];

// เปิด Dialog
const open = async (order) => {
  orderData.value = order;
  selectedStatus.value = order.status || "pending";
  isOpen.value = true;
  await loadOrderItems(order.id);
};

// ปิด Dialog
const closeDialog = () => {
  isOpen.value = false;
  orderData.value = null;
  orderItems.value = [];
  selectedStatus.value = "";
};

const totalAmount = () => {
  let total = 0;
  orderItems.value.forEach((item) => {
    total += item.wholesale_price * item.quantity;
  });
  return total;
};

// คำนวณยอดรวม
const totalPoint = () => {
  let total = 0;
  orderItems.value.forEach((item) => {
    total += item.point;
  });
  return total;
};

const formatNumber = (num) => {
  return new Intl.NumberFormat("th-TH").format(num);
};

// โหลดรายการสินค้าในคำสั่งซื้อ
const loadOrderItems = async (orderId) => {
  loadingItems.value = true;
  try {
    const { data } = await api.get(`/orders/items`, {
      params: {
        order_id: orderId,
      },
    });
    orderItems.value = data.data || [];
  } catch (error) {
    alertError(error.response.data.msg);
    orderItems.value = [];
  } finally {
    loadingItems.value = false;
  }
};

// อัปเดตสถานะ
const updateStatus = async () => {
  if (!orderData.value || !selectedStatus.value) return;

  updating.value = true;
  try {
    const { data } = await api.put(`/orders/status`, {
      id: orderData.value.id,
      status: selectedStatus.value,
    });

    orderData.value.status = selectedStatus.value;
    emit("order-updated");
    closeDialog();
    alertSuccess(data.msg || "อัปเดตสถานะสำเร็จ");
  } catch (error) {
    console.error("อัปเดตสถานะไม่สำเร็จ:", error);
    alertError(error.response?.data?.msg || "อัปเดตสถานะไม่สำเร็จ");
  } finally {
    updating.value = false;
  }
};

// ฟังก์ชันช่วย
const formatDate = (date) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};

const formatCurrency = (amount) => {
  return Number(amount).toLocaleString();
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
    cancelled: "ยกเลิก",
  };
  return texts[status] || "ไม่ระบุ";
};

defineExpose({
  open,
  closeDialog,
});
</script>
