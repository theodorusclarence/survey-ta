export default withAuth('pendaftaran_afirmasi')(
  withFeatureFlag('PENDAFTARAN_TAHAP_1')(BerkasPage)
);
function BerkasPage() {
  const router = useRouter();
  const dialog = useDialog();

  //#region  //*=========== Store ===========
  const store = useAfirmasiStore();
  const setFields = useAfirmasiStore.useSetFields();
  const userData = useUserDataStore.usePendaftaranAfirmasi();
  logger({ store }, 'berkas.page.tsx line 43');

  //#endregion  //*======== Store ===========
  const documentType = getJenisBerkasAfirmasi(userData?.affirmationType);

  //#region  //*=========== Form ===========
  const methods = useForm<BerkasAfirmasiForm>({
    mode: 'onTouched',
    defaultValues: {
      ...documentType?.fields.reduce(
        (acc, { id }) => ({ ...acc, [id]: store[id] }),
        {}
      ),
    },
  });
  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<BerkasAfirmasiForm> = (data) => {
    logger({ data }, 'cek disini');
    setFields(data);

    handleNextStep({ type: TYPE, router });
  };
  //#endregion  //*======== Form Submit ===========

  return (
    <Layout>
      <Seo templateTitle='Berkas - Pendaftaran Afirmasi' />

      <main className='relative bg-light'>
        <PendaftaranBackground />

        <section className='relative'>
          <div className='layout min-h-main py-20'>
            <div className='text-center'>
              <Typography
                as='h1'
                variant='j1'
                className='font-semibold'
              >
                Pendaftaran PPDB
              </Typography>
              <Typography variant='b1'>
                Jalur Afirmasi -{' '}
                {getAffirmationTypeLabel(userData?.affirmationType)}
              </Typography>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <MacCard
                  mode='light'
                  className='mt-16'
                  childrenClassName='divide-y divide-typo-divider p-5 sm:p-9'
                >
                  <FormStepper
                    type={TYPE}
                    isEdited={isDirty}
                  />

                  <FormSection className='sm:grid-cols-2'>
                    <div>
                      <FormSection.Title>
                        {documentType?.title}
                      </FormSection.Title>
                      <FormSection.Subtitle className='mt-1'>
                        {documentType?.description}
                      </FormSection.Subtitle>
                      <KetentuanFotoAlert className='mt-2' />
                    </div>

                    <div className='space-y-6'>
                      {documentType?.fields.map((field) => (
                        <DropzoneInput
                          key={field.id}
                          id={field.id}
                          label={field.label}
                          validation={{
                            required: `${field.label} harus diisi`,
                          }}
                          accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          helperText={field.helperText}
                        />
                      ))}
                    </div>
                  </FormSection>

                  <div
                    className={clsx([
                      'pt-6',
                      'flex flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center',
                    ])}
                  >
                    <Button
                      variant='outline'
                      leftIcon={ArrowLeft}
                      {...getPreviousButtonProps({
                        type: TYPE,
                        router,
                        dialog: isDirty ? dialog : undefined,
                      })}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      type='submit'
                      rightIcon={ArrowRight}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </MacCard>
              </form>
            </FormProvider>
          </div>
        </section>
      </main>
    </Layout>
  );
}
