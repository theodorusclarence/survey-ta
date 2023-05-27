<FormProvider {...methods}>
  <form>
    <DropzoneInput
      containerClassName='@lg:col-span-2'
      id='kk.kk'
      label='Unggah Kartu Keluarga'
      validation={{
        required: 'Kartu Keluarga harus diisi',
      }}
      accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
      helperText={IMAGE_UPLOAD_HELPER_TEXT}
    />
  </form>
</FormProvider>;
