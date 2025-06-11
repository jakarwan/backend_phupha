<template>
  <v-dialog v-model="isOpen" max-width="800" persistent>
    <v-card>
      <v-card-title>
        <span>เพิ่มข้อมูลลูกค้า</span>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <Form :validation-schema="schema" @submit="onSubmit">
          <div class="d-flex flex-column gap-4">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="first_name" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="ชื่อ"
                    :error-messages="errorMessage"
                    variant="outlined"
                    required
                    maxlength="50"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="family_name" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="นามสกุล"
                    :error-messages="errorMessage"
                    variant="outlined"
                    required
                    maxlength="50"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="phone" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="เบอร์โทรศัพท์"
                    placeholder="09xxxxxxxx"
                    :error-messages="errorMessage"
                    variant="outlined"
                    required
                    maxlength="10"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="address" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="ที่อยู่"
                    placeholder="99/99 หมู่ 9"
                    variant="outlined"
                    maxlength="100"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="province_id" v-slot="{ field, errorMessage }">
                  <!-- <v-text-field
                v-bind="field"
                label="จังหวัด"
                :error-messages="errorMessage"
                variant="outlined"
                required
              /> -->
                  <v-select
                    :items="props.provinces"
                    label="จังหวัด"
                    v-bind="field"
                    item-title="name_th"
                    item-value="id"
                    :error-messages="errorMessage"
                    required
                    variant="outlined"
                  ></v-select>
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="lz_id" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="Lazada ID"
                    placeholder="Lazada ID"
                    variant="outlined"
                    maxlength="50"
                  />
                </Field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Field name="sp_id" v-slot="{ field, errorMessage }">
                  <v-text-field
                    v-bind="field"
                    label="Shopee ID"
                    placeholder="Shopee ID"
                    variant="outlined"
                    maxlength="50"
                  />
                </Field>
              </v-col>
            </v-row>
          </div>

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
import { ref, defineExpose, defineProps, defineEmits } from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { alertSuccess, alertError } from "@/utils/alert";
import api from "@/plugins/axios";

const isOpen = ref(false);
defineExpose({ isOpen });

const emit = defineEmits(["product-added", "dialog-closed"]);

const props = defineProps({
  provinces: Array,
});
const schema = yup.object({
  first_name: yup.string().required("กรุณากรอกชื่อ"),
  family_name: yup.string().required("กรุณากรอกนามสกุล"),
  phone: yup
    .string()
    .required("กรุณากรอกเบอร์โทร")
    .matches(/^0[0-9]{8,9}$/, "รูปแบบไม่ถูกต้อง"),
  province_id: yup.string().required("กรุณาเลือกจังหวัด"),
});

const onSubmit = async (values) => {
  try {
    const res = await api.post("/customers/add-customer", {
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
    alertSuccess(res.msg);
    emit("customer-added", res.data);
  } catch (error) {
    alertError(error.response.data.msg);
  }
  isOpen.value = false;
};
</script>
