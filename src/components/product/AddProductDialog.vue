<template>
  <v-dialog v-model="isOpen" max-width="800" persistent>
    <v-card>
      <v-card-title>
        <span>เพิ่มข้อมูลสินค้า</span>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <Form :validation-schema="schema" @submit="onSubmit" ref="formRef">
          <div class="d-flex flex-column gap-4">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="name" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="ชื่อสินค้า"
                    :error-messages="errorMessage"
                    variant="outlined"
                    required
                    maxlength="100"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="type_id" v-slot="{ field, errorMessage }">
                  <v-select
                    :items="types"
                    label="ประเภทสินค้า"
                    v-bind="field"
                    item-title="type_name"
                    item-value="type_id"
                    :error-messages="errorMessage"
                    required
                    variant="outlined"
                    clearable
                  ></v-select>
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="3" lg="3">
                <Field name="price" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="ราคาสูงสุด"
                    placeholder="0.00"
                    :error-messages="errorMessage"
                    variant="outlined"
                    required
                    type="text"
                    min="0"
                    step="0.01"
                    suffix="บาท"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="3" lg="3">
                <Field name="wholesale_price" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="ราคาต่ำสุด"
                    placeholder="0.00"
                    :error-messages="errorMessage"
                    variant="outlined"
                    type="text"
                    min="0"
                    step="0.01"
                    suffix="บาท"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="3" lg="3">
                <Field name="point" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="คะแนน"
                    placeholder="0"
                    :error-messages="errorMessage"
                    variant="outlined"
                    type="text"
                    min="0"
                    suffix="แต้ม"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="3" lg="3">
                <Field name="stock" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="จำนวนสินค้า"
                    placeholder="0"
                    variant="outlined"
                    type="text"
                    min="0"
                    suffix="ชิ้น"
                    :error-messages="errorMessage"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12">
                <Field name="description" v-slot="{ field, errorMessage }">
                  <v-textarea
                    v-bind="field"
                    label="คำอธิบายสินค้า"
                    :error-messages="errorMessage"
                    variant="outlined"
                    rows="3"
                    maxlength="500"
                    counter
                  ></v-textarea>
                </Field>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12">
                <Field name="image_url" v-slot="{ errorMessage, handleChange }">
                  <v-file-input
                    label="รูปภาพสินค้า"
                    variant="outlined"
                    class="text-truncate"
                    clearable
                    @update:model-value="
                      (files) => {
                        handleChange(files);
                        handleFileChange(files);
                      }
                    "
                    :error-messages="errorMessage"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    prepend-icon="mdi-camera"
                    show-size
                  />
                </Field>
              </v-col>
              <!-- แสดงตัวอย่างรูปภาพ -->
              <v-col cols="12" v-if="imagePreview">
                <div class="text-subtitle-2 mb-2">ตัวอย่างรูปภาพ:</div>
                <div class="d-flex justify-center">
                  <v-img
                    :src="imagePreview"
                    max-width="200"
                    max-height="200"
                    class="border rounded"
                  />
                </div>
              </v-col>
            </v-row>
          </div>

          <v-card-actions class="mt-6">
            <v-spacer />
            <v-btn text @click="handleCancel" :disabled="isSubmitting">
              ยกเลิก
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              บันทึก
            </v-btn>
          </v-card-actions>
        </Form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineExpose, defineProps, defineEmits, watch } from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { alertSuccess, alertError } from "@/utils/alert";
import api from "@/plugins/axios";

const isOpen = ref(false);
const isSubmitting = ref(false);
const imagePreview = ref(null);
const formRef = ref(null);

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
  // categories: {
  types: Array,
  // default: () => [],
  // required: true,
  // },
});

const emit = defineEmits(["product-added", "dialog-closed"]);

// แก้ไข validation schema
const schema = yup.object({
  name: yup
    .string()
    .required("กรุณากรอกชื่อสินค้า")
    .min(2, "ชื่อสินค้าต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(100, "ชื่อสินค้าต้องไม่เกิน 100 ตัวอักษร"),
  price: yup
    .number()
    .typeError("ราคาต้องเป็นตัวเลข")
    .required("กรุณากรอกราคาสินค้าสูงสุด")
    .min(0.01, "ราคาต้องมากกว่า 0")
    .max(999999.99, "ราคาต้องไม่เกิน 999,999.99 บาท"),
  wholesale_price: yup
    .number()
    .typeError("ราคาต้องเป็นตัวเลข")
    .required("กรุณากรอกราคาสินค้าต่ำสุด")
    .min(0.01, "ราคาต้องมากกว่า 0")
    .max(999999.99, "ราคาต้องไม่เกิน 999,999.99 บาท"),
  type_id: yup.string().required("กรุณาเลือกประเภทสินค้า"),
  point: yup
    .number()
    .typeError("คะแนนต้องเป็นตัวเลข")
    .min(0, "คะแนนต้องมากกว่าหรือเท่ากับ 0")
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),
  stock: yup
    .number()
    .typeError("จำนวนสต็อกต้องเป็นตัวเลข")
    .min(0, "จำนวนสต็อกต้องมากกว่าหรือเท่ากับ 0")
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),
  description: yup
    .string()
    .max(500, "คำอธิบายต้องไม่เกิน 500 ตัวอักษร")
    .nullable(),
  image_url: yup
    .mixed()
    .test("fileSize", "ขนาดไฟล์ต้องไม่เกิน 5MB", (value) => {
      if (!value || !value[0]) return true;
      return value[0].size <= 5 * 1024 * 1024; // 5MB
    })
    .test(
      "fileType",
      "รองรับเฉพาะไฟล์รูปภาพ (JPEG, PNG, JPG, WebP)",
      (value) => {
        if (!value || !value[0]) return true;
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        return validTypes.includes(value[0].type);
      }
    ),
});

// จัดการการเปลี่ยนแปลงไฟล์
const handleFileChange = (files) => {
  let file = null;

  // รองรับทั้ง File object และ array
  if (files instanceof File) {
    file = files;
  } else if (files && Array.isArray(files) && files.length > 0) {
    file = files[0];
  }

  if (file && file instanceof File) {
    // ล้าง URL เก่าก่อน
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }

    // สร้าง URL ใหม่
    imagePreview.value = URL.createObjectURL(file);
  } else {
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }
    imagePreview.value = null;
  }
};

// รีเซ็ตฟอร์ม
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetForm();
  }
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

const onSubmit = async (values) => {
  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description || "");
    formData.append("price", parseFloat(values.price).toString());
    formData.append(
      "wholesale_price",
      parseFloat(values.wholesale_price).toString()
    );
    formData.append(
      "point",
      values.point ? parseInt(values.point).toString() : "0"
    );
    formData.append(
      "stock",
      values.stock ? parseInt(values.stock).toString() : "0"
    );
    formData.append("type_id", values.type_id);

    // จัดการไฟล์รูปภาพ - แก้ไขตรงนี้
    if (values.image_url) {
      let imageFile = null;

      // รองรับทั้ง File object และ array
      if (values.image_url instanceof File) {
        imageFile = values.image_url;
      } else if (
        Array.isArray(values.image_url) &&
        values.image_url.length > 0
      ) {
        imageFile = values.image_url[0];
      }

      if (imageFile && imageFile instanceof File) {
        formData.append("image", imageFile); // เปลี่ยนจาก "image_url" เป็น "image"
      }
    }

    const res = await api.post("/products/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alertSuccess(res.data.msg || "เพิ่มสินค้าสำเร็จ");
    emit("product-added", res.data);
    isOpen.value = false;
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      "เกิดข้อผิดพลาดในการเพิ่มสินค้า";
    alertError(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
