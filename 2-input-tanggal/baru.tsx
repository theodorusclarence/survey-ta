<FormProvider {...methods}>
  <form>
    <DatePicker
      id='kk.kk_date'
      label='Tanggal Terbit Kartu Keluarga'
      maxDate={new Date()}
      validation={{
        required: `Tanggal Terbit Kartu Keluarga harus diisi`,
      }}
      placeholder='Masukkan tanggal terbit'
    />
  </form>
</FormProvider>;
