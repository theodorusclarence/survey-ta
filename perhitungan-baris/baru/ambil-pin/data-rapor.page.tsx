function DataRaporPage() {
  const router = useRouter();

  //#region  //*=========== Store ===========
  const store = useAmbilPinStore((store) =>
    objectPick(store, [
      'akselerasi',
      'accreditation',
      'grade',
      'graduation_letter',
    ])
  );
  const setFields = useAmbilPinStore.useSetFields();

  const userData = useUserDataStore.useAmbilPin();
  //#endregion  //*======== Store ===========

  //#region  //*=========== Redirect Registered User ===========
  React.useEffect(() => {
    if (userData?.pin_verification) {
      router.replace('/ambil-pin/form/selesai');
    }
  }, [router, userData?.pin_verification]);
  //#endregion  //*======== Redirect Registered User ===========

  //#region  //*=========== Form ===========
  const methods = useForm<DataRaporForm>({
    mode: 'onTouched',
    defaultValues: {
      akselerasi: store.akselerasi ?? 'not-akselerasi',
      accreditation: store.accreditation,
      grade: store.grade,
      graduation_letter: store.graduation_letter,
    },
  });
  const {
    handleSubmit,
    watch,
    formState: { isDirty },
  } = methods;
  const akselerasi = watch('akselerasi');
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<DataRaporForm> = (data) => {
    logger({ data });

    setFields({
      akselerasi: data.akselerasi,
      accreditation: data.accreditation,
      grade: data.grade,
      graduation_letter: data.graduation_letter,
    });

    handleNextStep({ type: TYPE, router });
  };
  //#endregion  //*======== Form Submit ===========

  const numOfSemester = (() => {
    switch (akselerasi) {
      case 'akselerasi':
        return SEMESTERS.AKSELERASI;
      case 'not-akselerasi':
        return SEMESTERS.NON_AKSELERASI;
      default:
        return SEMESTERS.NON_AKSELERASI;
    }
  })();

  const shouldShowReportTable =
    userData?.pin_route === 'this_year' &&
    userData.grade_verification?.status === 'valid';

  return (
    <Layout>
      <Seo templateTitle='Data Rapor - Ambil PIN' />

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
                Pengambilan PIN
              </Typography>
              <Typography variant='b1'>
                Jalur {getAmbilPinRouteLabel(userData?.pin_route)}
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

                  <FormSection>
                    <div className='space-y-1'>
                      <FormSection.Title>Data Peserta</FormSection.Title>
                      <FormSection.Subtitle>
                        Berikut data yang akan anda gunakan untuk melakukan
                        pengambilan PIN
                      </FormSection.Subtitle>
                    </div>
                    <SimpleCard
                      size='sm'
                      className='space-y-6 bg-light'
                    >
                      <DescriptionList
                        title='Jalur Pengambilan PIN'
                        description={getAmbilPinRouteLabel(userData?.pin_route)}
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
                        <>
                          <DescriptionList
                            title='Nama Sekolah'
                            description={userData.smp?.name}
                          />
                          <DescriptionList
                            title='Nilai Akreditasi Sekolah'
                            description={userData.smp?.accreditation_score}
                          />
                          <DescriptionList
                            title='Nilai Indeks Sekolah'
                            description='CHANGE ME'
                          />
                        </>
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
                    <FormSection.Title>
                      Data Surat Keterangan Lulus
                    </FormSection.Title>
                    <div className='space-y-6'>
                      <DropzoneInput
                        id='graduation_letter'
                        label='Foto Surat Keterangan Lulus'
                        validation={{
                          required: 'Foto Surat Keterangan Lulus harus diisi',
                        }}
                        accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                        helperText={IMAGE_UPLOAD_HELPER_TEXT}
                      />
                    </div>
                  </FormSection>

                  {userData?.pin_route === 'outside_jatim' && (
                    <FormSection>
                      <FormSection.Title>
                        Data Akreditasi Sekolah SMP
                      </FormSection.Title>
                      <div className='space-y-6'>
                        <Input
                          id='accreditation.accreditation_grade'
                          label='Nilai Akreditasi Sekolah'
                          inputMode='numeric'
                          placeholder='Masukkan nilai akreditasi sekolah'
                          validation={{
                            required: 'Nilai Akreditasi Sekolah harus diisi',
                            pattern: {
                              value: REGEX.NUMBER,
                              message:
                                'Nilai Akreditasi Sekolah harus berupa bilangan bulat',
                            },
                            max: {
                              value: 100,
                              message: 'Nilai maksimal 100',
                            },
                            min: {
                              value: 0,
                              message: 'Nilai minimal 0',
                            },
                          }}
                        />
                        <DropzoneInput
                          id='accreditation.accreditation_letter'
                          label='Foto Sertifikat Akreditasi Sekolah'
                          validation={{
                            required:
                              'Foto Sertifikat Akreditasi Sekolah harus diisi',
                          }}
                          accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          helperText={IMAGE_UPLOAD_HELPER_TEXT}
                        />
                      </div>
                    </FormSection>
                  )}

                  {shouldShowReportTable ? (
                    <FormSection isFullWidth>
                      <FormSection.Title>Data Nilai Rapor</FormSection.Title>
                      <ReportTable
                        className='mt-4'
                        grades={userData.grades}
                      />
                    </FormSection>
                  ) : (
                    <>
                      <div className='py-6'>
                        <Alert variant='secondary'>
                          Anda belum melakukan verifikasi nilai, silakan teliti
                          dan masukkan nilai beserta foto rapor pada form
                          berikut
                        </Alert>
                      </div>

                      <FormSection>
                        <FormSection.Title>
                          Apakah Anda siswa SKS?
                        </FormSection.Title>
                        <div>
                          <div className='flex flex-col gap-4 sm:flex-row sm:flex-wrap'>
                            <Radio
                              name='akselerasi'
                              label={getJenisSemesterLabel('regular')}
                              value='not-akselerasi'
                              validation={{ required: 'Kondisi harus diisi' }}
                              hideError
                            />
                            <Radio
                              name='akselerasi'
                              label={getJenisSemesterLabel('acceleration')}
                              value='akselerasi'
                              hideError
                            />
                          </div>
                          <ErrorMessage
                            className='mt-2'
                            id='akselerasi'
                          />
                        </div>
                      </FormSection>

                      <FormSection
                        isFullWidth
                        className='gap-2 sm:gap-4'
                      >
                        <div className='col-span-2'>
                          <FormSection.Title>
                            Data Nilai Rapor
                          </FormSection.Title>
                          <FormSection.Subtitle>
                            Isikan data nilai rapor semester 1-{numOfSemester}{' '}
                            anda, dan sertakan {numOfSemester} foto rapor per
                            semester.
                          </FormSection.Subtitle>
                        </div>
                        <ReportTableInput numOfSemester={numOfSemester} />
                      </FormSection>

                      <FormSection>
                        <div>
                          <FormSection.Title>
                            Berkas Foto Rapor
                          </FormSection.Title>
                          <FormSection.Subtitle>
                            Silakan unggah foto rapor tiap semester
                          </FormSection.Subtitle>
                          <KetentuanFotoAlert className='mt-2' />
                        </div>
                        <div className='space-y-6'>
                          {[...Array(numOfSemester)].map((_, i) => (
                            <DropzoneInput
                              key={i}
                              id={`grade.${i}.report_photo`}
                              label={`Foto Rapor Semester ${i + 1}`}
                              validation={{
                                required: 'Foto Rapor harus diisi',
                              }}
                              accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                            />
                          ))}
                        </div>
                      </FormSection>
                    </>
                  )}
                  <div
                    className={clsx([
                      'pt-6',
                      'flex flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center',
                    ])}
                  >
                    <div></div>
                    <Button
                      rightIcon={ArrowRight}
                      type='submit'
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
