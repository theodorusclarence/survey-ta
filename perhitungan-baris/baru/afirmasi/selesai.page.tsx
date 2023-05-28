function SelesaiPage() {
  const { data } = useGetRegistrationAffirmationQuery();
  const pendaftaranData = data?.data;
  const documentType = getJenisBerkasAfirmasi(
    pendaftaranData?.type as AffirmationType
  );

  //#region  //*=========== Form ===========
  const methods = useForm<SelesaiForm>({
    defaultValues: {
      ...documentType?.fields.reduce(
        (acc, { id, label }) => ({
          ...acc,
          [id]: convertUrlToFileWithPreview({
            url: pendaftaranData?.user.documents[id],
            fileName: label,
          }),
        }),
        {}
      ),
    },
  });
  //#endregion  //*======== Form ===========

  //#region  //*=========== Pilihan Sekolah Data ===========
  const schoolType = getSchoolDataFromType(pendaftaranData?.registrable_type);
  //#endregion  //*======== Pilihan Sekolah Data ===========

  return (
    <Layout>
      <Seo templateTitle='Selesai - Pendaftaran Afirmasi' />

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
                Pendaftaran
              </Typography>
              <Typography variant='b1'>
                Jalur Afirmasi -{' '}
                {getAffirmationTypeLabel(
                  pendaftaranData?.type as AffirmationType
                )}
              </Typography>
            </div>

            <FormProvider {...methods}>
              <MacCard
                mode='light'
                className='mt-16'
                childrenClassName='divide-y divide-typo-divider p-5 sm:p-9'
              >
                <section className='relative flex py-6'>
                  <SimpleCard className='flex w-full flex-col justify-between gap-x-2 gap-y-4 overflow-hidden bg-light p-0 md:flex-row'>
                    <div className='z-10 w-full px-5 py-6'>
                      <Typography
                        as='h2'
                        variant='j2'
                        className='font-semibold'
                      >
                        Pendaftaran Selesai
                      </Typography>
                      <Typography
                        variant='b2'
                        className='mt-4'
                      >
                        Anda telah melakukan pendaftaran pada Jalur Afirmasi
                        SMA/SMK PPDB Jawa Timur 2023
                      </Typography>
                      <Typography
                        variant='b2'
                        className='mt-6'
                      >
                        Pengumuman Hasil :{' '}
                        <Tag color='primary'>
                          {formatLocaleDate(
                            new Date(
                              FEATURE_FLAG[
                                'PENGUMUMAN_DAN_CETAK_BUKTI_TAHAP_1'
                              ].start
                            ),
                            'FULL_WITH_TIME'
                          )}{' '}
                          WIB
                        </Tag>{' '}
                      </Typography>
                      <Typography
                        variant='b2'
                        className='mt-6'
                      >
                        Anda dapat melakukan pencetakan bukti pendaftaran dengan
                        mengklik tombol Cetak Bukti berikut
                      </Typography>

                      <Button
                        leftIcon={Printer}
                        className='mt-3'
                        color='primary'
                        onClick={printProof}
                      >
                        Cetak Bukti
                      </Button>
                    </div>
                    <Graphics />
                    <Noise />
                  </SimpleCard>
                </section>
                <FormSection isFullWidth>
                  <SimpleCard className='divide-y divide-typo-divider overflow-hidden bg-light py-0'>
                    <FormSection>
                      <div className='space-y-1'>
                        <FormSection.Title>Data Peserta</FormSection.Title>
                      </div>
                      <div className='space-y-6'>
                        <DescriptionList
                          title='Jalur Pendaftaran'
                          description={getAffirmationTypeLabel(
                            pendaftaranData?.type as AffirmationType
                          )}
                        />
                        <DescriptionList
                          title='NISN'
                          description={pendaftaranData?.user.nisn}
                        />
                        <DescriptionList
                          title='Nama Lengkap'
                          description={pendaftaranData?.user.name}
                        />
                        <DescriptionList
                          title='Tanggal Lahir'
                          description={
                            pendaftaranData?.user.birth_date
                              ? formatLocaleDate(
                                  parseDateFromAPI(
                                    pendaftaranData?.user.birth_date
                                  ),
                                  'FULL'
                                )
                              : ''
                          }
                        />
                      </div>
                    </FormSection>
                    <FormSection>
                      <div>
                        <FormSection.Title>Data Sekolah SMP</FormSection.Title>
                      </div>
                      <div className='space-y-6'>
                        <DescriptionList
                          title='NPSN'
                          description={pendaftaranData?.user.npsn}
                        />
                        {(pendaftaranData?.user?.pin_route === 'this_year' ||
                          pendaftaranData?.user?.pin_route ===
                            'previous_year') && (
                          <DescriptionList
                            title='Nama Sekolah'
                            description={pendaftaranData?.user.smp?.name}
                          />
                        )}

                        {pendaftaranData?.user?.pin_route ===
                          'outside_jatim' && (
                          <DescriptionList
                            title='Nama Sekolah'
                            description={pendaftaranData?.user.datas?.smp?.name}
                          />
                        )}
                      </div>
                    </FormSection>

                    <FormSection>
                      <div className='space-y-1'>
                        <FormSection.Title>Pilihan Sekolah</FormSection.Title>
                      </div>
                      <div>
                        {schoolType === 'sma' && (
                          <SelectedSchoolPreview
                            type={schoolType}
                            name={pendaftaranData?.registrable.name}
                            city={
                              pendaftaranData?.registrable?.subdistrict?.city
                                ?.name
                            }
                          />
                        )}
                        {schoolType === 'smk_major' && (
                          <SelectedSchoolPreview
                            withHeader={false}
                            type={schoolType}
                            name={pendaftaranData?.registrable?.smk?.name}
                            major={pendaftaranData?.registrable.major?.name}
                            city={
                              pendaftaranData?.registrable?.smk?.subdistrict
                                ?.city?.name
                            }
                          />
                        )}
                      </div>
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
                  </SimpleCard>
                </FormSection>

                <div
                  className={clsx([
                    'pt-6',
                    'flex flex-col-reverse justify-center sm:flex-row sm:items-center',
                  ])}
                >
                  <ButtonLink
                    href='/'
                    variant='ghost'
                    leftIcon={ArrowLeft}
                  >
                    Kembali ke Menu Utama
                  </ButtonLink>
                </div>
              </MacCard>
            </FormProvider>
          </div>
        </section>
      </main>
    </Layout>
  );
}
