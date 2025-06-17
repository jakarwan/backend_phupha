<template>
  <!-- <v-container> -->
  <v-card class="min-h-[850px] mt-4 mx-4">
    <div class="text-xl font-bold ma-4">รายการลูกค้า</div>
    <v-card-title>
      <v-row>
        <v-col md="4">
          <v-text-field
            v-model="search"
            label="ค้นหาลูกค้า"
            hide-details
            variant="outlined"
            density="comfortable"
            placeholder="รหัสลูกค้า, ชื่อลูกค้า, เบอร์โทร"
          />
        </v-col>
        <v-col md="3">
          <v-select
            v-model="province_id"
            :items="provinces"
            label="จังหวัด"
            item-title="name_th"
            item-value="id"
            variant="outlined"
            density="comfortable"
            clearable
          />
        </v-col>
      </v-row>
      <div class="float-end">
        <v-btn @click="dialogRef.isOpen = true" color="indigo-darken-3"
          >เพิ่มลูกค้า</v-btn
        >
        <AddCustomerDialog
          ref="dialogRef"
          :provinces="provinces"
          @customer-added="handleCustomerAdded"
        />
      </div>
    </v-card-title>
    <!-- :sort-by="sortBy" -->
    <div class="px-4">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items-length="total"
        :headers="headers"
        :items="customers"
        :loading="loading"
        :search="search"
        class="elevation-1"
        :items-per-page-options="[10, 50, 100]"
        @update:options="loadCustomers"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.created_at="{ item }">
          {{ dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss") }}
        </template>
        <template #item.point="{ item }">
          <v-chip variant="elevated" color="indigo">{{ item.point }}</v-chip>
        </template>
        <template #item.action="{ item }">
          <v-btn @click="openHistory(item)" size="x-small" color="#919191">
            <v-icon>mdi-history</v-icon>
            <v-tooltip activator="parent" location="top">
              ดูรายละเอียด
            </v-tooltip>
          </v-btn>
          <v-btn
            @click="editCustomer(item)"
            size="x-small"
            class="mx-2"
            color="#5865f2"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
          <v-btn @click="delCustomer(item)" size="x-small" color="error"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </template>
      </v-data-table-server>
      <EditCustomerDialog
        ref="dialogEditRef"
        :provinces="provinces"
        @updated="handleCustomerUpdated"
      />
      <CustomerHistoryDialog v-model="historyDialog" ref="historyDialogRef" />
    </div>
  </v-card>
  <!-- </v-container> -->
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import api from "@/plugins/axios";
import AddCustomerDialog from "@/components/customer/AddCustomerDialog.vue";
import EditCustomerDialog from "@/components/customer/EditCustomerDialog.vue";
import dayjs from "dayjs";
import { alertError, alertSuccess, alertDelete } from "@/utils/alert";
import CustomerHistoryDialog from "@/components/customer/OrderHistoryDialog.vue";

// --- state
const customers = ref([]);
const total = ref(0);
const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const search = ref("");
const dialogRef = ref();
const dialogEditRef = ref();
const provinces = ref([]);
const province_id = ref(null);
const historyDialog = ref(false);
const historyDialogRef = ref();
// const sortBy = ref([{ key: "created_at", order: "desc" }]);

const editCustomer = (item) => {
  dialogEditRef.value.open(item);
};

const openHistory = (item) => {
  historyDialogRef.value.open(item);
};

const delCustomer = async (item) => {
  const confirm = await alertDelete(item);
  if (confirm.isConfirmed) {
    try {
      const res = await api.delete("/customers/delete", {
        data: { id: item.id },
      });

      alertSuccess(res.data.msg || "ลบข้อมูลเรียบร้อยแล้ว");
      loadCustomers();
    } catch (err) {
      alertError(err.response?.data?.msg || "เกิดข้อผิดพลาด");
    }
  }
};

// --- headers
const headers = [
  { title: "#", key: "index", sortable: false },
  { title: "รหัสลูกค้า", key: "member_id", sortable: false },
  {
    title: "ชื่อ-สกุล",
    key: "full_name",
    sortable: false,
    value: (item) => `${item.first_name} ${item.family_name}`,
  },
  { title: "เบอร์โทร", key: "phone", sortable: false },
  { title: "จังหวัด", key: "province", sortable: false },
  { title: "คะแนน", key: "point", sortable: false, align: "center" },
  { title: "วันที่สร้าง", key: "created_at", sortable: false },
  { title: "action", key: "action", sortable: false, align: "center" },
];

// --- load data from API
const loadCustomers = async () => {
  loading.value = true;

  try {
    const { data } = await api.get("/customers/list", {
      params: {
        page: page.value,
        per_page: itemsPerPage.value,
        search: search.value ? search.value : undefined,
        province_id: province_id.value,
        // sort_by: sortBy.value[0]?.key || "",
        // sort_order: sortBy.value[0]?.order || "",
      },
    });

    customers.value = data.data;
    total.value = data.pagination.total;
  } catch (error) {
    alertError(error.response.data.msg);
  } finally {
    loading.value = false;
  }
};

const loadProvinces = async () => {
  loading.value = true;

  try {
    const { data } = await api.get("/address/provinces");

    provinces.value = data;
  } catch (e) {
    console.error("โหลดข้อมูลไม่สำเร็จ", e);
  } finally {
    loading.value = false;
  }
};

const handleCustomerUpdated = (updatedData) => {
  loadCustomers();
};

const handleCustomerAdded = (addedData) => {
  loadCustomers();
};

// --- watch search trigger load
watch(province_id, () => {
  page.value = 1; // reset page
  loadCustomers();
});

onMounted(() => {
  loadProvinces();
});
</script>
