<FormProvider {...methods}>
  <form>
    <Input
      id='kk.nik'
      label='NIK'
      inputMode='numeric'
      validation={{
        required: 'NIK harus diisi',
        pattern: {
          value: REGEX.NUMBER,
          message: 'NIK harus berupa angka',
        },
        ...exactLength(16, 'NIK harus berjumlah 16 digit'),
      }}
      placeholder='Masukkan NIK'
    />
  </form>
</FormProvider>;
