<template>
  <div class="main">
    <div class="directory">
      <div class="directory-bar">
        <InputText
          id="username"
          :placeholder="'Найти по ФИО'"
          v-model="filters.global.value"
          aria-describedby="filter-fio"
        />
        <Button label="Добавить" @click="popupVisible = true" />
      </div>

      <div class="directory-container">
        <DataTable
          v-model:filters="filters"
          :globalFilterFields="['fio']"
          class="directory-table"
          dataKey="id"
          :loading="loading"
          stripedRows
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          sortMode="multiple"
          :value="organizations"
        >
          <template #empty> Организации не найдены </template>
          <template #loading> Загрузка ... </template>
          <Column
            v-for="col of columns"
            :key="col.field"
            :sortable="col.sortable"
            :field="col.field"
            :header="col.header"
          >
          </Column>
          <Column class="directory-table-actions" field="actions">
            <template #body="slotProps">
              <Button
                icon="pi pi-trash"
                severity="danger"
                aria-label="Delete"
                @click="deleteOrganization(slotProps.data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="directory-pagination"></div>
    </div>

    <Dialog
      class="popupForm"
      v-model:visible="popupVisible"
      modal
      :pt="{
        root: 'border-none',
        mask: {
          style: 'backdrop-filter: blur(2px)',
        },
      }"
      header="Добавление организации"
      :style="{ width: '25rem' }"
    >
      <span class="popupForm-help">Введите информацию об организации.</span>
      <form class="popupForm-form" @submit.prevent="saveOrganization()">
        <ValidateInputText
          name="name"
          :placeholder="'Название'"
          autocomplete="off"
        />
        <ValidateInputText
          name="phone"
          :placeholder="'Номер телефона'"
          autocomplete="off"
        />
        <ValidateInputText
          name="fio"
          :placeholder="'ФИО Директора'"
          autocomplete="off"
        />
        <div class="popupForm-actions">
          <Button :disabled="!meta.valid" type="submit" label="Ок"></Button>
          <Button
            type="reset"
            label="Отмена"
            severity="secondary"
            @click="closePopup()"
          ></Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount, ref } from "vue";
import InputText from "primevue/inputtext";
import { FilterMatchMode } from "primevue/api";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import { VueCookies } from "vue-cookies";
import ValidateInputText from "./components/customInputText.vue";
import { useForm } from "vee-validate";
import { object, string } from "yup";

const $cookies = inject<VueCookies>("$cookies") as VueCookies;
const loading = ref(false);
const popupVisible = ref(false);

const organizations = ref<
  {
    id: number;
    name: string;
    fio: string;
    phone: string;
  }[]
>([]);

const columns = [
  { field: "name", header: "Название", sortable: true },
  { field: "fio", header: "ФИО Директора", sortable: true },
  { field: "phone", header: "Номер телефона", sortable: false },
];

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

const schema = object().shape({
  name: string()
    .trim()
    .required("Это поле обязательно для заполнения")
    .min(2, "Минимальная длина 2 символа"),
  phone: string()
    .trim()
    .required("Это поле обязательно для заполнения")
    .matches(phoneRegExp, "Некорректный номер телефона"),
  fio: string()
    .trim()
    .required("Это поле обязательно для заполнения")
    .min(2, "Минимальная длина 2 символа"),
});

const { handleSubmit, meta } = useForm({
  validationSchema: schema,
});

const getOrganizations = () => {
  loading.value = true;
  setTimeout(() => {
    if ($cookies.get("organizations")) {
      organizations.value = $cookies.get("organizations");
    }
    loading.value = false;
  }, 500);
};

const setOrganizations = () => {
  $cookies.set("organizations", organizations.value);
};

const deleteOrganization = (id: number) => {
  organizations.value = organizations.value.filter(
    (organization) => organization.id !== id
  );
  setOrganizations();
};

const saveOrganization = handleSubmit((values) => {
  const newOrganizationData = {
    id: organizations.value.length
      ? organizations.value[organizations.value.length - 1].id + 1
      : 0,
    name: values.name,
    fio: values.fio,
    phone: values.phone,
  };

  organizations.value.push({ ...newOrganizationData });
  setOrganizations();
  popupVisible.value = false;
});

const closePopup = () => {
  popupVisible.value = false;
};

onBeforeMount(() => {
  getOrganizations();
});
</script>

<style lang="scss">
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem;
}

.directory {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-table {
    &-actions {
      width: 2.5rem;
    }
  }
}

.popupForm {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .p-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  &-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  &-help {
    font-size: 0.75rem;
    color: gray;
  }

  &-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
}
</style>
