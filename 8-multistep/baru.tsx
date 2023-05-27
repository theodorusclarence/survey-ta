export const STEP_TIMELINE_CONTENT: StepTimelineContentType = {
  'pendaftaran-afirmasi': [
    {
      route: '/pendaftaran/afirmasi/form/data-peserta',
      title: 'Data Peserta',
    },
    {
      route: '/pendaftaran/afirmasi/form/pilih-sekolah',
      title: 'Pemilihan Sekolah',
    },
    {
      route: '/pendaftaran/afirmasi/form/berkas',
      title: 'Unggah Berkas',
    },
    {
      route: '/pendaftaran/afirmasi/form/finalisasi',
      title: 'Finalisasi',
    },
  ],
};

function Page() {
  const store = useAfirmasiStore();
  const setFields = useAfirmasiStore.useSetFields();

  const methods = useForm<PilihSekolahAfirmasiForm>({
    mode: 'onTouched',
    defaultValues: { ...store },
  });
  const onSubmit: SubmitHandler<PilihSekolahAfirmasiForm> = (data) => {
    setFields({
      school: data.school,
    });

    handleNextStep({ type: TYPE, router });
  };

  return (
    <Layout>
      <FormStepper
        type='pendaftaran-afirmasi'
        isEdited={methods.formState.isDirty}
      />

      <Form>...</Form>

      <div className='pt-6 flex flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center'>
        <Button
          variant='outline'
          leftIcon={ArrowLeft}
          {...getPreviousButtonProps({
            type: TYPE,
            router,
          })}
        >
          Sebelumnya
        </Button>
        <Button type='submit' leftIcon={Send}>
          Simpan Permanen
        </Button>
      </div>
    </Layout>
  );
}
