<template>
  <v-container fluid class="pa-4">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="font-weight-bold text-xl">Dashboard</div>
          </div>
          <!-- <div>
            <v-btn prepend-icon="mdi-download" variant="outlined" class="mr-2">
              ดาวน์โหลดรายงาน
            </v-btn>
            <v-btn prepend-icon="mdi-calendar" variant="tonal" color="primary">
              {{ dateRange }}
            </v-btn>
          </div> -->
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex justify-space-between align-start">
            <div>
              <p class="text-sm text-medium-emphasis mb-1">ยอดขายทั้งหมด</p>
              <h3 class="text-xl font-weight-bold mb-2">
                {{ dashboards?.stats?.totalSales?.value }} บาท
              </h3>
              <!-- <div class="d-flex align-center">
                <v-icon
                  :icon="
                    stat.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down'
                  "
                  :color="stat.trend > 0 ? 'success' : 'error'"
                  size="small"
                  class="mr-1"
                ></v-icon>
                <span
                  :class="stat.trend > 0 ? 'text-success' : 'text-error'"
                  class="text-caption font-weight-medium"
                >
                  {{ Math.abs(stat.trend) }}%
                </span>
                <span class="text-caption text-medium-emphasis ml-1">
                  จากเดือนที่แล้ว
                </span>
              </div> -->
            </div>
            <v-avatar color="primary" size="48" variant="tonal">
              <v-icon icon="mdi-cash-multiple" size="24"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex justify-space-between align-start">
            <div>
              <p class="text-sm text-medium-emphasis mb-1">คำสั่งซื้อทั้งหมด</p>
              <h3 class="text-xl font-weight-bold mb-2">
                {{ dashboards?.stats?.totalOrders?.value }} รายการ
              </h3>
              <!-- <div class="d-flex align-center">
                <v-icon
                  :icon="
                    stat.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down'
                  "
                  :color="stat.trend > 0 ? 'success' : 'error'"
                  size="small"
                  class="mr-1"
                ></v-icon>
                <span
                  :class="stat.trend > 0 ? 'text-success' : 'text-error'"
                  class="text-caption font-weight-medium"
                >
                  {{ Math.abs(stat.trend) }}%
                </span>
                <span class="text-caption text-medium-emphasis ml-1">
                  จากเดือนที่แล้ว
                </span>
              </div> -->
            </div>
            <v-avatar color="success" size="48" variant="tonal">
              <v-icon icon="mdi-shopping" size="24"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex justify-space-between align-start">
            <div>
              <p class="text-sm text-medium-emphasis mb-1">ลูกค้าทั้งหมด</p>
              <h3 class="text-xl font-weight-bold mb-2">
                {{ dashboards?.stats?.customers?.value }} คน
              </h3>
              <!-- <div class="d-flex align-center">
                <v-icon
                  :icon="
                    stat.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down'
                  "
                  :color="stat.trend > 0 ? 'success' : 'error'"
                  size="small"
                  class="mr-1"
                ></v-icon>
                <span
                  :class="stat.trend > 0 ? 'text-success' : 'text-error'"
                  class="text-caption font-weight-medium"
                >
                  {{ Math.abs(stat.trend) }}%
                </span>
                <span class="text-caption text-medium-emphasis ml-1">
                  จากเดือนที่แล้ว
                </span>
              </div> -->
            </div>
            <v-avatar color="warning" size="48" variant="tonal">
              <v-icon icon="mdi-account-multiple" size="24"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row -->
    <!-- <v-row class="mb-4">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>ยอดขายรายเดือน</span>
            <v-btn-toggle
              v-model="chartPeriod"
              variant="outlined"
              divided
              density="compact"
              color="primary"
            >
              <v-btn value="month" size="small">เดือน</v-btn>
              <v-btn value="quarter" size="small">ไตรมาส</v-btn>
              <v-btn value="year" size="small">ปี</v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
            <v-sheet height="350" class="d-flex align-center justify-center">
              <canvas ref="salesChart"></canvas>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" height="100%">
          <v-card-title>สัดส่วนหมวดหมู่สินค้า</v-card-title>
          <v-card-text>
            <v-sheet height="350" class="d-flex align-center justify-center">
              <canvas ref="categoryChart"></canvas>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->

    <!-- Recent Activities & Top Products -->
    <!-- <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>คำสั่งซื้อล่าสุด</span>
            <v-btn variant="text" size="small" color="primary">
              ดูทั้งหมด
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="orderHeaders"
              :items="recentOrders"
              :items-per-page="5"
              density="comfortable"
              class="elevation-0"
            >
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small" label>
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.total="{ item }">
                <span class="font-weight-medium"
                  >฿{{ item.total.toLocaleString() }}</span
                >
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title>สินค้าขายดี</v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-item
                v-for="(product, index) in topProducts"
                :key="index"
                class="px-0"
              >
                <template v-slot:prepend>
                  <v-avatar size="48" rounded>
                    <v-img :src="product.image"></v-img>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ product.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  ขายไป {{ product.sold }} ชิ้น
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="text-right">
                    <div class="font-weight-bold text-primary">
                      ฿{{ product.revenue.toLocaleString() }}
                    </div>
                    <div class="text-caption text-medium-emphasis">รายได้</div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->

    <!-- Quick Actions -->
    <!-- <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2" color="primary" variant="tonal">
          <v-card-text>
            <div class="d-flex justify-space-between align-center flex-wrap">
              <div>
                <h3 class="text-h6 mb-1">ต้องการความช่วยเหลือ?</h3>
                <p class="text-body-2 mb-0">
                  เรามีคู่มือและวิดีโอสอนการใช้งานระบบ
                </p>
              </div>
              <div>
                <v-btn variant="flat" color="primary" class="mr-2">
                  <v-icon start>mdi-book-open-variant</v-icon>
                  อ่านคู่มือ
                </v-btn>
                <v-btn variant="outlined" color="primary">
                  <v-icon start>mdi-play-circle</v-icon>
                  ดูวิดีโอ
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Chart from "chart.js/auto";
import { alertError } from "@/utils/alert";
import api from "@/plugins/axios";

// Data
const dateRange = ref("1 - 31 ตุลาคม 2024");
const chartPeriod = ref("month");
const salesChart = ref(null);
const categoryChart = ref(null);
const dashboards = ref(null);

const loading = ref(false);

// Stats Cards Data
const statsCards = ref([
  {
    title: "ยอดขายทั้งหมด",
    value: "฿1,234,567",
    trend: 12.5,
    icon: "mdi-cash-multiple",
    color: "primary",
  },
  {
    title: "คำสั่งซื้อใหม่",
    value: "156",
    trend: 8.2,
    icon: "mdi-shopping",
    color: "success",
  },
  {
    title: "ลูกค้าใหม่",
    value: "48",
    trend: -3.1,
    icon: "mdi-account-multiple",
    color: "warning",
  },
  {
    title: "อัตราการแปลง",
    value: "3.2%",
    trend: 5.4,
    icon: "mdi-chart-line",
    color: "info",
  },
]);

// Recent Orders Data
const orderHeaders = [
  { title: "เลขที่คำสั่งซื้อ", key: "id" },
  { title: "ลูกค้า", key: "customer" },
  { title: "วันที่", key: "date" },
  { title: "ยอดรวม", key: "total", align: "end" },
  { title: "สถานะ", key: "status", align: "center" },
];

const recentOrders = ref([
  {
    id: "ORD-2024-001",
    customer: "สมชาย ใจดี",
    date: "31 ต.ค. 2024",
    total: 4500,
    status: "สำเร็จ",
  },
  {
    id: "ORD-2024-002",
    customer: "สมหญิง รักดี",
    date: "31 ต.ค. 2024",
    total: 12300,
    status: "กำลังจัดส่ง",
  },
  {
    id: "ORD-2024-003",
    customer: "สมศักดิ์ มั่งมี",
    date: "30 ต.ค. 2024",
    total: 8900,
    status: "รอชำระเงิน",
  },
  {
    id: "ORD-2024-004",
    customer: "สมหวัง สุขใจ",
    date: "30 ต.ค. 2024",
    total: 6700,
    status: "สำเร็จ",
  },
  {
    id: "ORD-2024-005",
    customer: "สมพร เจริญ",
    date: "29 ต.ค. 2024",
    total: 15600,
    status: "ยกเลิก",
  },
]);

// Top Products Data
const topProducts = ref([
  {
    name: "iPhone 15 Pro Max",
    sold: 45,
    revenue: 202500,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Samsung Galaxy S24",
    sold: 38,
    revenue: 152000,
    image: "https://via.placeholder.com/150",
  },
  {
    name: 'iPad Pro 12.9"',
    sold: 28,
    revenue: 140000,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "MacBook Air M3",
    sold: 22,
    revenue: 110000,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "AirPods Pro 2",
    sold: 67,
    revenue: 100500,
    image: "https://via.placeholder.com/150",
  },
]);

// Methods
const getStatusColor = (status) => {
  const colors = {
    สำเร็จ: "success",
    กำลังจัดส่ง: "info",
    รอชำระเงิน: "warning",
    ยกเลิก: "error",
  };
  return colors[status] || "grey";
};

const loadDashboard = async () => {
  loading.value = true;

  try {
    const { data } = await api.get("/dashboards");

    dashboards.value = data.data;
  } catch (error) {
    alertError(error.response.data.msg);
  } finally {
    loading.value = false;
  }
};

// Initialize Charts
const initCharts = () => {
  // Sales Chart
  if (salesChart.value) {
    const ctx = salesChart.value.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "ม.ค.",
          "ก.พ.",
          "มี.ค.",
          "เม.ย.",
          "พ.ค.",
          "มิ.ย.",
          "ก.ค.",
          "ส.ค.",
          "ก.ย.",
          "ต.ค.",
        ],
        datasets: [
          {
            label: "ยอดขาย",
            data: [
              650000, 780000, 720000, 890000, 920000, 1050000, 1120000, 980000,
              1150000, 1234567,
            ],
            borderColor: "#1976D2",
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return "ยอดขาย: ฿" + context.parsed.y.toLocaleString();
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "฿" + value / 1000 + "k";
              },
            },
          },
        },
      },
    });
  }

  // Category Chart
  if (categoryChart.value) {
    const ctx = categoryChart.value.getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "อิเล็กทรอนิกส์",
          "เครื่องใช้ไฟฟ้า",
          "แฟชั่น",
          "อาหารและเครื่องดื่ม",
          "อื่นๆ",
        ],
        datasets: [
          {
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              "#1976D2",
              "#43A047",
              "#FB8C00",
              "#E53935",
              "#8E24AA",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ": " + context.parsed + "%";
              },
            },
          },
        },
      },
    });
  }
};

// Lifecycle
onMounted(async () => {
  await nextTick();
  initCharts();
  loadDashboard();
});
</script>

<style scoped>
.v-data-table {
  font-size: 14px;
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

/* Remove hover effect for data table card */
.v-data-table .v-card:hover {
  transform: none;
}
</style>
