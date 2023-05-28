function PendaftaranFinalisasiPage() {
  const router = useRouter();
  const dialog = useDialog();

  //#region  //*=========== Store ===========
  const userData = useUserDataStore.usePendaftaranAfirmasi();
  const store = useAfirmasiStore();
  logger({ userData }, 'finalisasi.page.tsx line 48');
  logger({ store }, 'finalisasi.page.tsx line 49');
  //#endregion  //*======== Store ===========
  const documentType = getJenisBerkasAfirmasi(userData?.affirmationType);

  //#region  //*=========== Form ===========
  const methods = useForm<AffirmationForm>({
    mode: 'onTouched',
    defaultValues: {
      school: store.school,
      ...documentType?.fields.reduce(
        (acc, { id }) => ({
          ...acc,
          [id]: store[id],
        }),
        {}
      ),
    },
  });
  const { handleSubmit } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const { mutateAsync: register } = usePendaftaranAfirmasiMutation();
  const { refetch: fetchAffirmation } = useGetRegistrationAffirmationQuery({
    // don't fetch initially, use refetch to fetch initial data
    options: { refetchOnWindowFocus: false, enabled: false, retry: 0 },
  });
  const onSubmit: SubmitHandler<AffirmationForm> = (data) => {
    logger({ data });
    dialog({
      title: 'Simpan Permanen',
      description: (
        <>
          Anda akan melakukan Pendaftaran Jalur Afirmasi. Data akan disimpan
          secara <b>permanen dan tidak dapat diubah kembali</b>. Berikut sekolah
          yang Anda pilih: <br />
          {schoolType === 'sma' && (
            <SingleSchoolDialog
              type={schoolType}
              name={dataSMA?.data.name}
              city={dataCity?.data.name}
            />
          )}
          {schoolType === 'smk_major' && (
            <SingleSchoolDialog
              type={schoolType}
              name={dataSMKMajor?.data.smk.name}
              major={dataSMKMajor?.data.major.name}
              city={dataCity?.data.name}
            />
          )}
          Apakah Anda sudah yakin?
        </>
      ),
      submitText: 'Yakin',
      variant: 'warning',
      listenForLoadingToast: true,
    }).then(() => {
      const postData: PendaftaranAfirmasiMutationBody = {
        registrable_type: store.school?.type,
        registrable_id:
          store.school?.type === 'sma'
            ? store.school?.school
            : store.school?.major,

        type: userData?.affirmationType,

        documents: {
          ...documentType?.fields.reduce(
            (acc, { id }) => ({
              ...acc,
              [id]: store[id],
            }),
            {}
          ),
        },
      };
      logger({ postData }, 'index.page.tsx line 123');

      register(postData).then(() => {
        // Pre-populate selesai data
        fetchAffirmation();

        return router.replace('/pendaftaran/afirmasi/selesai');
      });
    });
  };
  //#endregion  //*======== Form Submit ===========

  //#region  //*=========== Pilih Sekolah Data ===========
  const schoolType = store.school?.type;
  const { data: dataSMKMajor } = useGetSMKMajorDetail({
    id: store.school?.major,
  });
  const { data: dataSMA } = useGetSMASchoolDetail({
    id: store.school?.school,
  });
  const { data: dataCity } = useGetCityDetail({ id: store.school?.city });
  //#endregion  //*======== Pilih Sekolah Data ===========

  return (
    <Layout>
      <Seo templateTitle='Finalisasi - Pendaftaran Afirmasi' />

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
                    isEdited={false}
                  />

                  <FormSection>
                    <div className='space-y-1'>
                      <FormSection.Title>Data Peserta</FormSection.Title>
                    </div>
                    <SimpleCard
                      size='sm'
                      className='space-y-6 bg-light'
                    >
                      <DescriptionList
                        title='Jalur Pendaftaran'
                        description={getAffirmationTypeLabel(
                          userData?.affirmationType
                        )}
                      />
                      <DescriptionList
                        title='NISN'
                        description={userData?.nisn}
                      />
                      <DescriptionList
                        title='Nama Lengkap'
                        description={userData?.name}
                      />
                      <DescriptionList
                        title='Tanggal Lahir'
                        description={
                          userData?.birth_date
                            ? formatLocaleDate(
                                parseDateFromAPI(userData?.birth_date),
                                'FULL'
                              )
                            : ''
                        }
                      />
                    </SimpleCard>
                  </FormSection>
                  <FormSection>
                    <div>
                      <FormSection.Title>Data Sekolah SMP</FormSection.Title>
                    </div>
                    <SimpleCard
                      size='sm'
                      className='space-y-6 bg-light'
                    >
                      <DescriptionList
                        title='NPSN'
                        description={userData?.npsn}
                      />
                      {(userData?.pin_route === 'this_year' ||
                        userData?.pin_route === 'previous_year') && (
                        <DescriptionList
                          title='Nama Sekolah'
                          description={userData.smp?.name}
                        />
                      )}

                      {userData?.pin_route === 'outside_jatim' && (
                        <DescriptionList
                          title='Nama Sekolah'
                          description={userData.datas?.smp?.name}
                        />
                      )}
                    </SimpleCard>
                  </FormSection>

                  <FormSection>
                    <div className='space-y-1'>
                      <FormSection.Title>Pilihan Sekolah</FormSection.Title>
                      <FormSection.Subtitle>
                        Lakukan pemilihan sekolah sesuai dengan ketentuan dan
                        kuota yang diberikan
                      </FormSection.Subtitle>
                    </div>

                    <SimpleCard className=' bg-light'>
                      {schoolType === 'sma' && (
                        <SelectedSchoolPreview
                          type={schoolType}
                          name={dataSMA?.data.name}
                          city={dataCity?.data.name}
                        />
                      )}
                      {schoolType === 'smk_major' && (
                        <SelectedSchoolPreview
                          type={schoolType}
                          name={dataSMKMajor?.data.smk.name}
                          major={dataSMKMajor?.data.major.name}
                          city={dataCity?.data.name}
                        />
                      )}
                    </SimpleCard>
                  </FormSection>

                  <FormSection>
                    <FormSection.Title>Berkas</FormSection.Title>
                    <FormSection.TwoColumnContent>
                      {documentType?.fields.map((field) => (
                        <DropzoneInput
                          key={field.id}
                          id={field.id}
                          label={field.label}
                          readOnly={true}
                          accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                        />
                      ))}
                    </FormSection.TwoColumnContent>
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
                      })}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      type='submit'
                      leftIcon={Send}
                    >
                      Simpan Permanen
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
