<FormProvider {...methods}>
  <form>
    <Checkbox
      name='agreement'
      label='Saya menyetujui syarat dan ketentuan di atas'
      value='agree'
      validation={{
        required: 'Anda harus menyetujui syarat dan ketentuan',
      }}
    />
  </form>
</FormProvider>;
