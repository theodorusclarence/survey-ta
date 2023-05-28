type FinalisasiForm = AmbilPinStoreState;
const TYPE: StepTimelineType = 'ambil-pin';

export default withAuth('ambil_pin')(
  withFeatureFlag('AMBIL_PIN')(FinalisasiPage)
);
function FinalisasiPage() {
  const router = useRouter();
  const dialog = useDialog();

  //#region  //*=========== Ambil Pin Store ===========
  const store = useAmbilPinStore((store) =>
    objectPick(store, [
      'grade',
      'kk',
      'surat',
      'province_id',
      'city_id',
      'coordinate',
      'accreditation',
      'akselerasi',
      'graduation_letter',
    ])
  );
  const userData = useUserDataStore.useAmbilPin();
  //#endregion  //*======== Ambil Pin Store ===========

  //#region  //*=========== Form ===========
  const methods = useForm<FinalisasiForm>({
    mode: 'onTouched',
    defaultValues: {
      kk: {
        kk: store.kk?.kk,
        new_kk_letter: store.kk?.new_kk_letter,
      },
      surat: store.surat,
      grade: store.grade,
      accreditation: {
        accreditation_letter: store.accreditation?.accreditation_letter,
      },
      graduation_letter: store.graduation_letter,
    },
  });
  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  //#endregion  //*======== Form ===========

  //#region  //*=========== Get Province, City, Subdistrict Name ===========
  const { data: province } = useGetProvinceDetail({
    id: store.province_id,
  });
  const { data: city } = useGetCityDetail({ id: store.city_id });
  const { data: subdistrict } = useGetSubdistrictDetail({
    id: store.kk?.subdistrict_id,
  });
  //#endregion  //*======== Get Province, City, Subdistrict Name ===========

  //#region  //*=========== Conditional Variables ===========
  const shouldShowGradesFromBackend =
    userData?.pin_route === 'this_year' &&
    userData?.grade_verification?.status === 'valid';
  const shouldShowSuratKeteranganRTInput =
    store.kk?.domicile_type === 'kk' &&
    store.kk?.kk_date >= parseDateFromAPI(MIN_KK_DATE);
  const shouldShowSuratKeteranganKondisiInput =
    store.kk?.domicile_type !== 'kk' &&
    getJenisSuratLabel(store.kk?.domicile_type);
  const shouldShowKKNumberInput = store.kk?.domicile_type === 'kk';
  const slicedGrade =
    store.grade?.slice(0, store?.akselerasi === 'akselerasi' ? 3 : 5) ?? [];
  //#endregion  //*======== Conditional Variables ===========

  //#region  //*=========== Form Submit ===========
  const { mutateAsync: register } = useAmbilPinMutation();
  const onSubmit: SubmitHandler<FinalisasiForm> = () => {
    dialog({
      title: 'Simpan Permanen',
      description: (
        <>
          Anda akan melakukan Pengambilan PIN. Data akan disimpan secara{' '}
          <b>permanen dan tidak dapat diubah kembali</b>.
          <br />
          <br />
          Apakah Anda sudah yakin?
        </>
      ),
      submitText: 'Simpan Permanen',
      variant: 'warning',
      listenForLoadingToast: true,
    }).then(() => {
      const domicile_type = store.kk?.domicile_type;
      if (!store.kk?.domicile_type) return;

      const body: AmbilPinMutationBody = {
        kk: {
          ...store.kk,

          kk: store.kk?.kk,
          kk_date: store.kk?.kk_date
            ? formatDateForAPI(store.kk?.kk_date)
            : undefined,
          ...(domicile_type !== 'kk' && {
            skd: store.kk?.kk,
            skd_date: store.kk?.kk_date
              ? formatDateForAPI(store.kk?.kk_date)
              : undefined,
            // overwrite kk data to undefined
            kk: undefined,
            kk_date: undefined,
          }),

          ...(shouldShowSuratKeteranganKondisiInput && {
            mutation_letter:
              domicile_type === 'mutation' ? store.surat : undefined,
            disaster_letter:
              domicile_type === 'natural_or_social_disaster'
                ? store.surat
                : undefined,
            pesantren_or_orphanage_letter:
              domicile_type === 'pesantren_or_orphanage'
                ? store.surat
                : undefined,
          }),

          new_kk_letter: shouldShowSuratKeteranganRTInput
            ? store.kk?.new_kk_letter
            : undefined,

          kk_number: shouldShowKKNumberInput ? store.kk?.kk_number : undefined,
        },

        ...(!shouldShowGradesFromBackend &&
          store.grade && {
            grade: {
              data: store.grade
                ?.slice(0, store.akselerasi === 'akselerasi' ? 3 : 5)
                .map((grade, i) => ({ ...grade, semester: i + 1 })),
              is_accelerated: store.akselerasi === 'akselerasi',
            },
          }),

        coordinate: {
          latitude: formatCoordinateForAPI(
            store.coordinate?.latitude
          ) as number,
          longitude: formatCoordinateForAPI(
            store.coordinate?.longitude
          ) as number,
        },
        accreditation:
          userData?.pin_route === 'outside_jatim'
            ? store.accreditation
            : undefined,

        documents: {
          graduation_letter: store.graduation_letter,
        },
      };

      register(body).then(() => router.replace('/ambil-pin/form/selesai'));
    });
  };
  //#endregion  //*======== Form Submit ===========

  return (
    <Layout>
      <Seo templateTitle='Finalisasi - Ambil PIN' />

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

                  <FormSection isFullWidth>
                    <SimpleCard className='divide-y divide-typo-divider bg-light py-0'>
                      <FormSection>
                        <FormSection.Title>Data Pendaftaran</FormSection.Title>
                        <div>
                          <DescriptionList
                            title='Jalur Pengambilan PIN'
                            description={getAmbilPinRouteLabel(
                              userData?.pin_route
                            )}
                          />
                        </div>
                      </FormSection>

                      <FormSection>
                        <FormSection.Title>Data Peserta</FormSection.Title>
                        <div className='space-y-6'>
                          <DescriptionList
                            title='Nomor Induk Siswa Nasional (NISN)'
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
                        </div>
                      </FormSection>

                      <FormSection>
                        <FormSection.Title>
                          Data Surat Keterangan Lulus
                        </FormSection.Title>
                        <div className='space-y-6'>
                          <DropzoneInput
                            id='graduation_letter'
                            label='Foto Surat Keterangan Lulus'
                            readOnly
                            accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          />
                        </div>
                      </FormSection>

                      <FormSection>
                        <FormSection.Title>Data Sekolah SMP</FormSection.Title>
                        <div className='space-y-6'>
                          <DescriptionList
                            title='Nomor Pokok Sekolah Nasional (NPSN)'
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
                            <>
                              <DescriptionList
                                title='Nama Sekolah'
                                description={userData.datas?.smp?.name}
                              />
                              <DescriptionList
                                title='Nilai Akreditasi Sekolah'
                                description={
                                  store.accreditation?.accreditation_grade
                                }
                              />
                              {store.accreditation?.accreditation_letter && (
                                <DropzoneInput
                                  id='accreditation.accreditation_letter'
                                  label='Foto Sertifikat Akreditasi Sekolah'
                                  readOnly
                                  accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </FormSection>

                      <FormSection isFullWidth>
                        <FormSection.Title>Data Nilai Rapor</FormSection.Title>
                        {shouldShowGradesFromBackend ? (
                          <ReportTable
                            className='mt-4'
                            grades={userData.grades}
                          />
                        ) : (
                          <ReportTable
                            className='mt-4'
                            grades={slicedGrade}
                          />
                        )}
                      </FormSection>

                      <FormSection>
                        <FormSection.Title>
                          Data Kartu Keluarga / Domisili
                        </FormSection.Title>
                        <FormSection.TwoColumnContent>
                          <DescriptionList
                            className='@lg:col-span-2'
                            title='Kondisi'
                            description={getDomicileTypeLabel(
                              store.kk?.domicile_type
                            )}
                          />
                          <DescriptionList
                            title='Nomor Induk Kependudukan (NIK)'
                            description={store.kk?.nik}
                          />
                          <DescriptionList
                            title='Nomor HP'
                            description={store.kk?.phone}
                          />

                          {(userData?.pin_route === 'outside_jatim' ||
                            userData?.pin_route === 'previous_year') && (
                            <>
                              <DescriptionList
                                title='Tempat Lahir'
                                description={store.kk?.birth_place}
                              />
                              <DescriptionList
                                title='Jenis Kelamin'
                                description={getGenderLabel(store.kk?.gender)}
                              />
                            </>
                          )}

                          <hr className='@lg:col-span-2' />

                          <DescriptionList
                            title='Provinsi'
                            description={province?.data.name}
                          />
                          <DescriptionList
                            title='Kabupaten/Kota'
                            description={city?.data.name}
                          />
                          <DescriptionList
                            title='Kecamatan'
                            description={subdistrict?.data.name}
                          />
                          <DescriptionList
                            title='Desa/Kelurahan'
                            description={store.kk?.kelurahan}
                          />
                          <DescriptionList
                            className='@lg:col-span-2'
                            title='Alamat Rumah'
                            description={store.kk?.address}
                          />
                          <DescriptionList
                            title='RT'
                            description={store.kk?.rt}
                          />
                          <DescriptionList
                            title='RW'
                            description={store.kk?.rw}
                          />
                          {shouldShowKKNumberInput && (
                            <DescriptionList
                              title='Nomor KK'
                              description={store.kk?.kk_number}
                            />
                          )}
                          <DescriptionList
                            title='Tanggal Terbit'
                            description={
                              store.kk?.kk_date
                                ? formatLocaleDate(store.kk.kk_date, 'FULL')
                                : ''
                            }
                          />
                        </FormSection.TwoColumnContent>
                      </FormSection>

                      <FormSection>
                        <FormSection.Title>Berkas</FormSection.Title>
                        <FormSection.TwoColumnContent>
                          <DropzoneInput
                            id='kk.kk'
                            label={
                              getJenisKartuKeluargaLabel(
                                store.kk?.domicile_type
                              ) ?? 'Kartu Keluarga/Surat Domisili'
                            }
                            readOnly
                            accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          />
                          {shouldShowSuratKeteranganRTInput &&
                            store.kk?.new_kk_letter && (
                              <DropzoneInput
                                id='kk.new_kk_letter'
                                label='Surat Keterangan RT KK Baru'
                                readOnly
                                accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                              />
                            )}
                          {shouldShowSuratKeteranganKondisiInput &&
                            store.surat && (
                              <DropzoneInput
                                id='surat'
                                label={
                                  getJenisSuratLabel(store.kk?.domicile_type) ??
                                  'Surat Keterangan'
                                }
                                readOnly
                                accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                              />
                            )}
                          {!shouldShowGradesFromBackend &&
                            store.grade &&
                            slicedGrade.map((_, i) => (
                              <DropzoneInput
                                key={i}
                                id={`grade.${i}.report_photo`}
                                label={`Foto Rapor Semester ${i + 1}`}
                                readOnly
                                accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                              />
                            ))}
                        </FormSection.TwoColumnContent>
                      </FormSection>
                    </SimpleCard>
                  </FormSection>

                  <FormSection isFullWidth>
                    <FormSection.Title>Lokasi Rumah</FormSection.Title>

                    {store.coordinate ? (
                      <ReadOnlyMap
                        className='mt-8'
                        center={[
                          store.coordinate?.latitude,
                          store.coordinate?.longitude,
                        ]}
                        lockSubtitle="Kembali ke step 'Lokasi Rumah' untuk mengubah"
                      />
                    ) : (
                      <Typography variant='b3'>
                        Terjadi kesalahan dalam menampilkan lokasi rumah
                      </Typography>
                    )}
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
