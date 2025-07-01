<template>
  <v-dialog v-model="isOpen" fullscreen>
    <v-card>
      <v-card-title>
        <span>สั่งซื้อสินค้า</span>
      </v-card-title>

      <v-divider />

      <Form :validation-schema="schema" @submit="onSubmit" ref="formRef">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
              <Field
                name="member_id"
                v-slot="{ field, errorMessage, value, handleChange }"
              >
                <v-autocomplete
                  :model-value="value"
                  @update:model-value="handleChange"
                  :items="props.customers"
                  label="ชื่อลูกค้า"
                  :item-title="
                    (item) => item.first_name + ' ' + item.family_name
                  "
                  item-value="id"
                  :error-messages="errorMessage"
                  required
                  variant="outlined"
                  clearable
                  :custom-filter="
                    (value, query, item) => {
                      const searchText = query.toLowerCase();
                      const fullName =
                        `${item.raw.first_name} ${item.raw.family_name}`.toLowerCase();
                      return fullName.includes(searchText);
                    }
                  "
                ></v-autocomplete>
              </Field>
            </v-col>
          </v-row>

          <v-list-subheader v-if="carts.length > 0">
            ตะกร้าสินค้า ({{ carts.length }} รายการ)
          </v-list-subheader>

          <v-row class="max-h-[300px] overflow-auto" v-if="carts.length > 0">
            <v-col cols="12" v-for="(item, index) in carts" :key="index">
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
                    <div class="text-primary">ราคาสูงสุด {{ item.price }} บาท</div>
                    <div class="text-primary">
                      ราคาต่ำสุด {{ item.wholesale_price }} บาท
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
                        @click="decrementItem(index)"
                        size="small"
                        :disabled="item.quantity <= 1"
                        style="min-width: 32px; width: 32px"
                      ></v-btn>

                      <div
                        class="flex-grow-1 d-flex justify-center align-center"
                      >
                        <input
                          v-model.number="item.quantity"
                          type="number"
                          min="1"
                          @input="validateQuantity(index)"
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
                        />
                      </div>

                      <v-btn
                        icon="mdi-plus"
                        variant="text"
                        @click="incrementItem(index)"
                        size="small"
                        style="min-width: 32px; width: 32px"
                      ></v-btn>
                    </div>
                  </v-col>

                  <!-- ราคารวม -->
                  <v-col cols="2" class="text-center p-1">
                    <div>ราคาส่ง</div>
                    <div class="d-flex justify-center">
                      <!-- <v-switch
                        color="primary"
                        inset
                        v-model="item.wholesalePrice"
                        hide-details
                      ></v-switch> -->
                      <v-slider
                        v-model="item.wholesalePrice"
                        :max="item.price"
                        :min="item.wholesale_price"
                        :step="1"
                        thumb-label="always"
                        color="green"
                        track-color="green-lighten-3"
                        class="mt-8"
                        hide-details
                      >
                        <template v-slot:thumb-label="{ modelValue }">
                          ฿{{ formatNumber(modelValue) }}
                        </template>
                      </v-slider>
                    </div>
                    <div class="text-success font-weight-bold">
                      {{
                        (item.wholesalePrice * item.quantity).toLocaleString()
                      }}
                      บาท
                    </div>
                  </v-col>

                  <!-- ปุ่มลบ -->
                  <v-col cols="1" class="text-center" style="padding: 5px">
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      size="small"
                      @click="removeFromCart(index)"
                    ></v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- แสดงยอดรวม -->
          <v-row v-if="carts.length > 0" class="mt-2">
            <v-col cols="12" class="text-right">
              <v-card color="primary" variant="tonal" class="pa-3">
                <div class="font-weight-bold">
                  ยอดรวมทั้งหมด: {{ totalAmount.toLocaleString() }} บาท
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="mt-4" />

        <v-card-text>
          <v-list-subheader class="mt-4">สินค้าทั้งหมด</v-list-subheader>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="3"
              lg="3"
              v-for="(data, index) in props.products"
              :key="data.id"
            >
              <v-card class="mx-auto h-100" max-width="344">
                <v-img height="200px" :src="data.image_url" contain></v-img>

                <v-card-title class="text-wrap"> {{ data.name }} </v-card-title>

                <v-card-subtitle> {{ data.description }} </v-card-subtitle>

                <v-card-subtitle class="text-primary font-weight-bold">
                  ราคา {{ data.price }} บาท
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn
                    color="orange-lighten-2"
                    text="สั่งซื้อ"
                    @click="addProduct(data)"
                    :disabled="isProductInCart(data.id)"
                    block
                  >
                    {{
                      isProductInCart(data.id) ? "อยู่ในตะกร้าแล้ว" : "สั่งซื้อ"
                    }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </Form>

      <!-- ปุ่มลอยมุมขวาล่าง -->
      <div class="floating-buttons">
        <v-btn text @click="handleCancel" :disabled="isSubmitting" class="mr-2">
          ยกเลิก
        </v-btn>
        <v-btn
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting || carts.length === 0"
          @click="handleFormSubmit"
        >
          บันทึกคำสั่งซื้อ ({{ carts.length }} รายการ)
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {
  ref,
  defineExpose,
  defineProps,
  defineEmits,
  watch,
  computed,
} from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { alertSuccess, alertError } from "@/utils/alert";
import api from "@/plugins/axios";

const isOpen = ref(false);
const isSubmitting = ref(false);
const imagePreview = ref(null);
const formRef = ref(null);
const carts = ref([]);
const wholesalePrice = ref(false);

// เพิ่มสินค้าลงตะกร้า
const addProduct = (data) => {
  // ตรวจสอบว่าสินค้านี้อยู่ในตะกร้าแล้วหรือไม่
  const existingItem = carts.value.find((item) => item.id === data.id);

  if (!existingItem) {
    // เพิ่ม quantity property เป็น 1 เมื่อเพิ่มสินค้าใหม่
    carts.value.push({
      ...data,
      quantity: 1,
      wholesalePrice: data.wholesale_price,
    });
  }
};

// เพิ่มจำนวนสินค้า
const incrementItem = (index) => {
  carts.value[index].quantity++;
};

// ลดจำนวนสินค้า
const decrementItem = (index) => {
  if (carts.value[index].quantity > 1) {
    carts.value[index].quantity--;
  }
};

// ตรวจสอบและแก้ไขจำนวนสินค้าให้ถูกต้อง
const validateQuantity = (index) => {
  const item = carts.value[index];
  if (item.quantity < 1 || isNaN(item.quantity)) {
    item.quantity = 1;
  }
  // ปัดเป็นจำนวนเต็ม
  item.quantity = Math.floor(item.quantity);
};

// ลบสินค้าออกจากตะกร้า
const removeFromCart = (index) => {
  carts.value.splice(index, 1);
};

// ตรวจสอบว่าสินค้าอยู่ในตะกร้าแล้วหรือไม่
const isProductInCart = (productId) => {
  return carts.value.some((item) => item.id === productId);
};

// คำนวณยอดรวม
const totalAmount = computed(() => {
  return carts.value.reduce((total, item) => {
    return total + item.wholesalePrice * item.quantity;
  }, 0);
});

defineExpose({
  isOpen,
  openDialog: () => {
    isOpen.value = true;
  },
  closeDialog: () => {
    handleCancel();
  },
});

const props = defineProps({
  products: Array,
  customers: Array,
});

const emit = defineEmits(["order-added", "dialog-closed"]);

// แก้ไข validation schema เพื่อให้เหมาะกับ order form
const schema = yup.object({
  member_id: yup.string().required("กรุณาเลือกชื่อลูกค้า"),
});

// รีเซ็ตฟอร์ม
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetForm();
  }
  carts.value = [];
  imagePreview.value = null;
};

// จัดการการยกเลิก
const handleCancel = () => {
  resetForm();
  isOpen.value = false;
  emit("dialog-closed");
};

// เมื่อปิด dialog ให้รีเซ็ตฟอร์ม
watch(isOpen, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});

// จัดการการกดปุ่มบันทึก - trigger form validation
const handleFormSubmit = async () => {
  if (formRef.value) {
    // ใช้ validate แล้วถ้าผ่านค่อยเรียก onSubmit
    const { valid } = await formRef.value.validate();
    if (valid) {
      const values = formRef.value.values;
      await onSubmit(values);
    }
  }
};

const onSubmit = async (values) => {
  if (carts.value.length === 0) {
    alertError("กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
    return;
  }

  isSubmitting.value = true;

  try {
    const orderData = {
      member_id: values.member_id, // แก้ไขจาก values.id เป็น values.member_id
      items: carts.value.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        wholesale_price: item.wholesalePrice,
      })),
    };

    const res = await api.post("/orders/add", orderData);

    alertSuccess(res.data.msg || "บันทึกคำสั่งซื้อสำเร็จ");
    emit("order-added", res.data);
    isOpen.value = false;
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      "เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ";
    alertError(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat("th-TH").format(num);
};
</script>

<style scoped>
.floating-buttons {
  position: relative;
  bottom: 0px;
  right: 0px;
  z-index: 1000;
  display: flex;
  gap: 8px;
  align-self: end;
}

/* Styled Card */
.styled-card {
  background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
  border: 1px solid #e0e0e0;
}

/* Price Display */
.price-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.price-box {
  flex: 1;
  text-align: center;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.price-box:hover {
  border-color: #4caf50;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.price-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.price-value {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #2e7d32;
}

.price-separator {
  color: #9e9e9e;
}

/* Custom Slider */
.custom-slider :deep(.v-slider-track__fill) {
  height: 6px !important;
}

.custom-slider :deep(.v-slider-track__background) {
  height: 6px !important;
}

.custom-slider :deep(.v-slider-thumb) {
  width: 20px !important;
  height: 20px !important;
}

/* Price Marks */
.price-marks {
  position: relative;
  height: 20px;
  margin-top: 8px;
}

.price-mark {
  position: absolute;
  font-size: 11px;
  color: #666;
  transform: translateX(-50%);
  white-space: nowrap;
}

/* Minimal Price Display */
.minimal-price-display {
  text-align: center;
  padding: 16px;
  background-color: #e8f5e9;
  border-radius: 8px;
}

/* Histogram */
.histogram-container {
  height: 100px;
  padding: 0 12px;
}

.histogram {
  display: flex;
  align-items: flex-end;
  height: 100%;
  gap: 2px;
}

.histogram-bar {
  flex: 1;
  min-height: 4px;
  border-radius: 2px 2px 0 0;
  transition: all 0.3s ease;
}

/* Responsive */
@media (max-width: 600px) {
  .price-display {
    flex-direction: column;
    gap: 12px;
  }

  .price-box {
    width: 100%;
  }

  .price-separator {
    transform: rotate(90deg);
  }
}

/* Animations */
.v-range-slider {
  transition: all 0.3s ease;
}

.v-range-slider:hover :deep(.v-slider-track__fill) {
  height: 8px !important;
}

.v-chip {
  transition: all 0.2s ease;
}

.v-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
