const { data } = useGetProvinces();
const PROVINCE_OPTIONS = generateOptions({ data: data?.data })

<FormProvider {...methods}>
  <form>
    <SelectInput
      id='province_id'
      label='Provinsi Sekolah Asal'
      placeholder='Pilih provinsi'
      options={PROVINCE_OPTIONS}
      validation={{ required: 'Provinsi harus diisi' }}
    />
  </form>
</FormProvider>;
