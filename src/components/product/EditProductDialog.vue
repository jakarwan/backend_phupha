<template>
  <v-dialog v-model="isOpen" max-width="800" persistent>
    <v-card>
      <v-card-title>แก้ไขข้อมูลลูกค้า</v-card-title>

      <v-divider />

      <v-card-text>
        <Form
          :validation-schema="schema"
          :initial-values="initialValues"
          :key="formKey"
          @submit="onSubmit"
          ref="formRef"
        >
          <div class="d-flex flex-column gap-4">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="name" v-slot="{ field, errorMessage, value }">
                  <v-text-field
                    v-bind="field"
                    label="ชื่อสินค้า"
                    :error-messages="errorMessage"
                    variant="outlined"
                    required
                    maxlength="100"
                    :model-value="value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="type_id" v-slot="{ field, errorMessage, value }">
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
                    :model-value="value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  ></v-select>
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="3" lg="3">
                <Field name="price" v-slot="{ field, errorMessage, value }">
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
                    :model-value="value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="3" lg="3">
                <Field
                  name="wholesale_price"
                  v-slot="{ field, errorMessage, value }"
                >
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
                    :model-value="value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="3" lg="3">
                <Field name="point" v-slot="{ field, errorMessage, value }">
                  <v-text-field
                    v-bind="field"
                    label="คะแนน"
                    placeholder="0"
                    :error-messages="errorMessage"
                    variant="outlined"
                    type="text"
                    min="0"
                    suffix="แต้ม"
                    :model-value="value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="12" md="3" lg="3">
                <Field name="stock" v-slot="{ field, errorMessage, value }">
                  <v-text-field
                    v-bind="field"
                    label="จำนวนสินค้าในสต็อก"
                    placeholder="0"
                    variant="outlined"
                    type="number"
                    min="0"
                    suffix="ชิ้น"
                    :error-messages="errorMessage"
                    :model-value="value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12">
                <Field
                  name="description"
                  v-slot="{ field, errorMessage, value }"
                >
                  <v-textarea
                    v-bind="field"
                    label="คำอธิบายสินค้า"
                    :error-messages="errorMessage"
                    variant="outlined"
                    rows="3"
                    maxlength="500"
                    counter
                    :model-value="value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  ></v-textarea>
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="12" lg="12">
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
              <v-col cols="12">
                <Field name="image_url" v-slot="{ field, errorMessage, value }">
                  <div v-if="value">
                    <div class="text-subtitle-2 mb-2">ตัวอย่างรูปภาพ:</div>
                    <div class="d-flex justify-center">
                      <v-img
                        :src="imagePreview"
                        max-width="200"
                        max-height="200"
                        class="border rounded"
                        :model-value="value"
                      />
                    </div>
                  </div>
                </Field>
              </v-col>
            </v-row>
          </div>

          <v-card-actions class="mt-6">
            <v-spacer />
            <v-btn text @click="isOpen = false" :disabled="isSubmitting">
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
import { ref, defineExpose, defineProps } from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { alertSuccess, alertError } from "@/utils/alert";
import api from "@/plugins/axios";

const props = defineProps({ types: Array });
const isOpen = ref(false);
const initialValues = ref({});
const formKey = ref(0);
const isSubmitting = ref(false);
const imagePreview = ref(null);

const emit = defineEmits(["updated"]);

// Schema validation
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
  type_id: yup
    .string()
    .typeError("กรุณาเลือกประเภทสินค้า")
    .required("กรุณาเลือกประเภทสินค้า"),
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
      // ไม่มีค่า = ผ่าน (ไม่บังคับ)
      if (!value) return true;
      
      // เป็น string (URL เดิม) = ผ่าน
      if (typeof value === 'string') return true;
      
      // เป็น FileList ที่ว่าง = ผ่าน
      if (value instanceof FileList && value.length === 0) return true;
      
      // เป็น Array ที่ว่าง = ผ่าน
      if (Array.isArray(value) && value.length === 0) return true;
      
      // ตรวจสอบขนาดไฟล์
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024;
      }
      if (Array.isArray(value) && value[0] instanceof File) {
        return value[0].size <= 5 * 1024 * 1024;
      }
      if (value instanceof FileList && value[0] instanceof File) {
        return value[0].size <= 5 * 1024 * 1024;
      }
      
      return true;
    })
    .test(
      "fileType",
      "รองรับเฉพาะไฟล์รูปภาพ (JPEG, PNG, JPG, WebP)",
      (value) => {
        // ไม่มีค่า = ผ่าน
        if (!value) return true;
        
        // เป็น string (URL เดิม) = ผ่าน
        if (typeof value === 'string') return true;
        
        // เป็น FileList ที่ว่าง = ผ่าน
        if (value instanceof FileList && value.length === 0) return true;
        
        // เป็น Array ที่ว่าง = ผ่าน
        if (Array.isArray(value) && value.length === 0) return true;
        
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        
        // ตรวจสอบประเภทไฟล์
        if (value instanceof File) {
          return validTypes.includes(value.type);
        }
        if (Array.isArray(value) && value[0] instanceof File) {
          return validTypes.includes(value[0].type);
        }
        if (value instanceof FileList && value[0] instanceof File) {
          return validTypes.includes(value[0].type);
        }
        
        return true;
      }
    ),
});

const open = (product) => {
  // ตั้งค่า initial values
  initialValues.value = {
    id: product.id || "",
    name: product.name || "",
    type_id: product.type_id || "",
    price: product.price,
    wholesale_price: product.wholesale_price,
    point: product.point,
    description: product.description,
    stock: product.stock,
    image_url: product.image_url || "",
  };
  imagePreview.value = product.image_url || null;

  // เปลี่ยน key เพื่อ force re-render form
  formKey.value++;

  isOpen.value = true;
};

defineExpose({ open });

// const onSubmit = async (values) => {
//   try {
//     const res = await api.put("/products/edit", {
//       id: values.id,
//       name: values.name,
//       type_id: values.type_id,
//       price: values.price,
//       point: values.point,
//       description: values.description,
//       stock: values.stock,
//       image_url: values.image_url,
//     });
//     console.log(values, "values");
//     emit("updated", values);
//     alertSuccess(res.data.msg);
//   } catch (error) {
//     console.log(error, "error");
//     alertError(error.response.data.msg);
//   }
//   isOpen.value = false;
// };

const onSubmit = async (values) => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();

    formData.append("id", values.id);
    formData.append("name", values.name);
    formData.append("type_id", values.type_id);
    formData.append("price", values.price);
    formData.append("wholesale_price", values.wholesale_price);
    formData.append("point", values.point ?? "");
    formData.append("description", values.description ?? "");
    formData.append("stock", values.stock ?? "");

    // ถ้าเป็นไฟล์ใหม่
    if (
      values.image_url instanceof File ||
      (Array.isArray(values.image_url) && values.image_url[0] instanceof File)
    ) {
      formData.append(
        "image",
        Array.isArray(values.image_url) ? values.image_url[0] : values.image_url
      );
    } else if (typeof values.image_url === "string") {
      // ส่ง URL เดิม
      formData.append("image_url", values.image_url);
    }

    const res = await api.put("/products/edit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    emit("updated", values);
    alertSuccess(res.data.msg);
  } catch (error) {
    alertError(error.response?.data?.msg || "เกิดข้อผิดพลาด");
  } finally {
    isSubmitting.value = false;
  }

  isOpen.value = false;
};

const handleFileChange = (files) => {
  let file = null;

  if (files instanceof File) {
    file = files;
  } else if (files && Array.isArray(files) && files.length > 0) {
    file = files[0];
  }

  if (file && file instanceof File) {
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }
    imagePreview.value = URL.createObjectURL(file);
  } else {
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }
    imagePreview.value = null;
  }
};
</script>
