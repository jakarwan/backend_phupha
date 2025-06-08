<template>
  <v-dialog v-model="isOpen" max-width="800" persistent>
    <v-card>
      <v-card-title>แก้ไขข้อมูลลูกค้า</v-card-title>

      <v-divider />

      <v-card-text>
        <Form
          :validation-schema="validationSchema"
          @submit="onSubmit"
          :initial-values="initialValues"
          :key="formKey"
        >
          <v-row>
            <v-col cols="12" sm="6">
              <Field name="first_name" v-slot="{ field, errorMessage, value }">
                <v-text-field
                  label="ชื่อ"
                  :model-value="value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errorMessage"
                  variant="outlined"
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6">
              <Field name="family_name" v-slot="{ field, errorMessage, value }">
                <v-text-field
                  label="นามสกุล"
                  :model-value="value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errorMessage"
                  variant="outlined"
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6">
              <Field name="phone" v-slot="{ field, errorMessage, value }">
                <v-text-field
                  label="เบอร์โทรศัพท์"
                  :model-value="value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errorMessage"
                  variant="outlined"
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6">
              <Field name="address" v-slot="{ field, errorMessage, value }">
                <v-text-field
                  label="ที่อยู่"
                  :model-value="value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errorMessage"
                  variant="outlined"
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6">
              <Field name="province_id" v-slot="{ field, errorMessage, value }">
                <v-select
                  label="จังหวัด"
                  :model-value="value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :items="props.provinces"
                  item-title="name_th"
                  item-value="id"
                  :error-messages="errorMessage"
                  variant="outlined"
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6">
              <Field name="lz_id" v-slot="{ field, errorMessage, value }">
                <v-text-field
                  label="Lazada ID"
                  :model-value="value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errorMessage"
                  variant="outlined"
                />
              </Field>
            </v-col>

            <v-col cols="12" sm="6">
              <Field name="sp_id" v-slot="{ field, errorMessage, value }">
                <v-text-field
                  label="Shopee ID"
                  :model-value="value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errorMessage"
                  variant="outlined"
                />
              </Field>
            </v-col>
          </v-row>

          <v-card-actions class="mt-6">
            <v-spacer />
            <v-btn text @click="isOpen = false">ยกเลิก</v-btn>
            <v-btn type="submit" color="primary">บันทึก</v-btn>
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

const props = defineProps({ provinces: Array });
const isOpen = ref(false);
const initialValues = ref({});
const formKey = ref(0);

const emit = defineEmits(["updated"]);

// Schema validation
const validationSchema = yup.object({
  first_name: yup.string().required("กรุณากรอกชื่อ"),
  family_name: yup.string().required("กรุณากรอกนามสกุล"),
  phone: yup
    .string()
    .required("กรุณากรอกเบอร์โทร")
    .matches(/^0[0-9]{8,9}$/, "รูปแบบไม่ถูกต้อง"),
  province_id: yup.string().required("กรุณาเลือกจังหวัด"),
});

const open = (customer) => {
  // ตั้งค่า initial values
  initialValues.value = {
    id: customer.id || "",
    first_name: customer.first_name || "",
    family_name: customer.family_name || "",
    phone: customer.phone || "",
    address: customer.address || "",
    lz_id: customer.lz_id || "",
    sp_id: customer.sp_id || "",
    // province: customer.province ? String(customer.province) : "",
    province_id: customer.province?.id || customer.province_id || "",
  };

  // เปลี่ยน key เพื่อ force re-render form
  formKey.value++;

  isOpen.value = true;
};

defineExpose({ open });

const onSubmit = async (values) => {
  try {
    const res = await api.put("/customers/edit-customer", {
      id: values.id,
      first_name: values.first_name,
      family_name: values.family_name,
      phone: values.phone,
      address: values.address,
      tambon_id: values.tambon_id,
      amphure_id: values.amphure_id,
      province_id: values.province_id,
      lz_id: values.lz_id,
      sp_id: values.sp_id,
      birthdate: values.birthdate,
    });
    console.log(values,'values')
    emit("updated", values);
    alertSuccess(res.data.msg);
  } catch (error) {
    console.log(error, "error");
    alertError(error.response.data.msg);
  }
  isOpen.value = false;
};
</script>
