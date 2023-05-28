function SelesaiPage() {
  const { data: ambilPinData, refetch } = useGetAmbilPinStateQuery({
    // use userData as initial data to prevent flash of unstyled content
    initialData: {
      code: '200',
      data: useUserDataStore.useAmbilPin() as AmbilPinMeResponse['data'],
    },
  });
  const userData = ambilPinData?.data;

  //#region  //*=========== Form ===========
  const methods = useForm<SelesaiForm>({
    values: {
      kk: convertUrlToFileWithPreview({
        fileName: 'Kartu Keluarga',
        url: userData?.documents.kk,
      }),

      skd: convertUrlToFileWithPreview({
        fileName: 'Surat Keterangan Domisili',
        url: userData?.documents.skd,
      }),

      graduation_letter: convertUrlToFileWithPreview({
        fileName: 'Surat Keterangan Lulus',
        url: userData?.documents.graduation_letter,
      }),

      accreditation_letter: convertUrlToFileWithPreview({
        fileName: 'Sertifikat Akreditasi Sekolah',
        url: userData?.documents.accreditation_letter,
      }),

      new_kk_letter: convertUrlToFileWithPreview({
        fileName: 'Surat Keterangan RT KK Baru',
        url: userData?.documents.new_kk_letter,
      }),

      mutation_letter: convertUrlToFileWithPreview({
        fileName: getJenisSuratLabel('mutation') ?? '',
        url: userData?.documents.mutation_letter,
      }),

      disaster_letter: convertUrlToFileWithPreview({
        fileName: getJenisSuratLabel('natural_or_social_disaster') ?? '',
        url: userData?.documents.disaster_letter,
      }),

      pesantren_or_orphanage_letter: convertUrlToFileWithPreview({
        fileName: getJenisSuratLabel('pesantren_or_orphanage') ?? '',
        url: userData?.documents.pesantren_or_orphanage_letter,
      }),

      grade:
        userData?.grades &&
        userData.grades.map((grade) => ({
          report_photo: convertUrlToFileWithPreview({
            fileName: `Rapor semester ${grade.semester}`,
            url: grade.report_photo ?? undefined,
          }),
        })),
    },
  });
  //#endregion  //*======== Form ===========

  //#region  //*=========== Get Province, City, Subdistrict Name ===========
  const { data: subdistrict } = useGetSubdistrictDetail({
    id: userData?.subdistrict_id,
  });
  const { data: city } = useGetCityDetail({ id: subdistrict?.data.city_id });
  const { data: province } = useGetProvinceDetail({
    id: city?.data.province_id,
  });
  const { data: school_city } = useGetCityDetail({
    id: userData?.datas?.smp?.city_id,
  });
  //#endregion  //*======== Get Province, City, Subdistrict Name ===========

  //#region  //*=========== Conditionals ===========
  const shouldShowPin =
    userData?.pin_verification?.status === 'valid' && userData.pin;

  const shouldShowRejection =
    userData?.pin_verification?.pin_fields.filter(({ type, status }) =>
      (() => {
        switch (type) {
          case 'coordinate':
            return status === 'revise_and_reject';
          default:
            return status === 'invalid';
        }
      })()
    )?.length ?? -1 > 0
      ? true
      : false;

  const shouldShowSuratKeteranganRTInput =
    userData?.documents.new_kk_letter &&
    userData?.datas?.kk_date &&
    parseDateFromAPI(userData?.datas?.kk_date) >= parseDateFromAPI(MIN_KK_DATE);
  //#endregion  //*======== Conditionals ===========

  return (
    <Layout>
      <Seo templateTitle='Selesai - Ambil PIN' />

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

            <MacCard
              mode='light'
              className='mt-16'
              childrenClassName='divide-y divide-typo-divider p-5 sm:p-9'
            >
              <section className='relative flex py-6'>
                <SimpleCard className='flex w-full flex-col justify-between gap-x-2 gap-y-4 overflow-hidden bg-light p-0 md:flex-row'>
                  <div className='z-10 w-full px-5 py-6'>
                    {shouldShowPin ? (
                      <>
                        <Typography
                          as='h2'
                          variant='j2'
                          className='font-semibold'
                        >
                          Pengambilan PIN Berhasil
                        </Typography>
                        <Typography
                          variant='h2'
                          className='mt-4'
                        >
                          <span className='font-medium'>PIN:</span>{' '}
                          {userData.pin}
                        </Typography>
                        <Typography
                          variant='b2'
                          className='mt-4'
                        >
                          Simpan PIN Anda dengan baik. PIN ini akan digunakan
                          untuk melakukan pendaftaran.
                        </Typography>
                      </>
                    ) : shouldShowRejection ? (
                      <>
                        <Typography
                          as='h2'
                          variant='j2'
                          className='font-semibold'
                        >
                          Terdapat Revisi
                        </Typography>
                        <Typography
                          variant='b2'
                          className='mt-4'
                        >
                          Silakan mencermati dan memperbaiki revisi dari
                          operator.
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          as='h2'
                          variant='j2'
                          className='font-semibold'
                        >
                          Pengajuan Sedang Diverifikasi
                        </Typography>
                        <Typography
                          variant='b2'
                          className='mt-4'
                        >
                          Data Anda sedang dalam proses verifikasi. Silakan
                          masuk kembali ke halaman ini dalam 2-3 hari untuk
                          melihat status verifikasi.
                        </Typography>
                      </>
                    )}
                  </div>
                  <Graphics />
                  <Noise />
                </SimpleCard>
              </section>

              {shouldShowRejection && (
                <FormSection isFullWidth>
                  <SimpleCard className='divide-y divide-red-500 overflow-hidden bg-red-50 py-0'>
                    <FormSection isFullWidth>
                      <Typography
                        as='h3'
                        variant='h1'
                        className='font-semibold'
                      >
                        Terdapat penyesuaian oleh operator
                      </Typography>
                      <Typography
                        variant='b2'
                        className='mt-4'
                      >
                        Silakan cermati dan periksa kembali data Anda.
                      </Typography>
                      <SimpleCard className='mt-4'>
                        <DescriptionList
                          title='Pesan Operator'
                          description={userData?.pin_verification?.message}
                        />
                      </SimpleCard>
                    </FormSection>

                    <RevisiLokasiRumah
                      pin_fields={userData?.pin_verification?.pin_fields}
                      latitude={userData?.latitude}
                      longitude={userData?.longitude}
                      onSubmitSuccess={refetch}
                    />

                    <RevisiDocuments
                      pin_fields={userData?.pin_verification?.pin_fields}
                      userData={userData}
                      onSubmitSuccess={refetch}
                    />

                    <RevisiAkreditasi
                      pin_fields={userData?.pin_verification?.pin_fields}
                      userData={userData}
                      onSubmitSuccess={refetch}
                    />

                    <RevisiRapor
                      pin_fields={userData?.pin_verification?.pin_fields}
                      userData={userData}
                      onSubmitSuccess={refetch}
                    />
                  </SimpleCard>
                </FormSection>
              )}

              <FormProvider {...methods}>
                <FormSection isFullWidth>
                  <SimpleCard className='divide-y divide-typo-divider overflow-hidden bg-light py-0'>
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
                          title='Jenis Kelamin'
                          description={getGenderLabel(userData?.gender)}
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

                        {userData?.pin_route === 'outside_jatim' &&
                          userData.datas?.smp && (
                            <>
                              <DescriptionList
                                title='Nama Sekolah'
                                description={userData.datas.smp.name}
                              />
                              <DescriptionList
                                title='Kabupaten/Kota Sekolah'
                                description={school_city?.data.name}
                              />
                              <DescriptionList
                                title='Nilai Akreditasi Sekolah'
                                description={userData.datas.smp.accreditation}
                              />

                              {userData?.documents.accreditation_letter && (
                                <DropzoneInput
                                  id='accreditation_letter'
                                  label='Foto Sertifikat Akreditasi Sekolah'
                                  readOnly
                                  accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                                />
                              )}
                            </>
                          )}
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

                    <FormSection isFullWidth>
                      <FormSection.Title>Data Nilai Rapor</FormSection.Title>
                      <ReportTable
                        className='mt-4'
                        grades={userData?.grades ?? []}
                      />

                      <Typography
                        variant='c1'
                        className='mt-2'
                        color='secondary'
                      >
                        Jika masih ada kesalahan nilai rapor, silakan datang
                        langsung ke kantor layanan Cabang Dinas Pendidikan
                        terdekat.
                      </Typography>
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
                            userData?.datas?.domicile_type
                          )}
                        />
                        <DescriptionList
                          title='Nomor Induk Kependudukan (NIK)'
                          description={userData?.nik}
                        />
                        <DescriptionList
                          title='Nomor HP'
                          description={userData?.phone}
                        />

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
                          description={userData?.datas.kelurahan}
                        />
                        <DescriptionList
                          className='@lg:col-span-2'
                          title='Alamat Rumah'
                          description={userData?.address}
                        />
                        <DescriptionList
                          title='RT'
                          description={userData?.datas.rt}
                        />
                        <DescriptionList
                          title='RW'
                          description={userData?.datas.rw}
                        />

                        {userData?.datas.kk_number && (
                          <DescriptionList
                            title='Nomor KK'
                            description={userData.datas.kk_number}
                          />
                        )}

                        {userData?.datas.kk_date && (
                          <DescriptionList
                            title='Tanggal Terbit KK'
                            description={formatLocaleDate(
                              parseDateFromAPI(userData?.datas.kk_date),
                              'FULL'
                            )}
                          />
                        )}

                        {userData?.datas.skd_date && (
                          <DescriptionList
                            title='Tanggal Terbit Surat Keterangan Domisili'
                            description={formatLocaleDate(
                              parseDateFromAPI(userData?.datas.skd_date),
                              'FULL'
                            )}
                          />
                        )}
                      </FormSection.TwoColumnContent>
                    </FormSection>

                    <FormSection>
                      <FormSection.Title>Berkas</FormSection.Title>
                      <div className='space-y-3'>
                        {userData?.documents.kk && (
                          <DropzoneInput
                            id='kk'
                            label='Kartu Keluarga'
                            readOnly
                            accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          />
                        )}

                        {userData?.documents.skd && (
                          <DropzoneInput
                            id='skd'
                            label='Surat Keterangan Domisili'
                            readOnly
                            accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          />
                        )}

                        {shouldShowSuratKeteranganRTInput && (
                          <DropzoneInput
                            id='new_kk_letter'
                            label='Surat Keterangan RT KK Baru'
                            readOnly
                            accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          />
                        )}

                        {userData?.documents.mutation_letter && (
                          <DropzoneInput
                            id='mutation_letter'
                            label={
                              getJenisSuratLabel('mutation') ??
                              'Surat Keterangan Kondisi'
                            }
                            readOnly
                            accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          />
                        )}
                        {userData?.documents.disaster_letter && (
                          <DropzoneInput
                            id='disaster_letter'
                            label={
                              getJenisSuratLabel(
                                'natural_or_social_disaster'
                              ) ?? 'Surat Keterangan Kondisi'
                            }
                            readOnly
                            accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          />
                        )}
                        {userData?.documents.pesantren_or_orphanage_letter && (
                          <DropzoneInput
                            id='pesantren_or_orphanage_letter'
                            label={
                              getJenisSuratLabel('pesantren_or_orphanage') ??
                              'Surat Keterangan Kondisi'
                            }
                            readOnly
                            accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          />
                        )}

                        {userData?.grades &&
                          userData.grades.length > 0 &&
                          userData.grades.map(
                            (grade) =>
                              grade.report_photo && (
                                <DropzoneInput
                                  key={grade.semester}
                                  id={`grade.${
                                    grade.semester - 1
                                  }.report_photo`}
                                  label={`Foto Rapor Semester ${grade.semester}`}
                                  readOnly
                                  accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                                />
                              )
                          )}
                      </div>
                    </FormSection>
                  </SimpleCard>
                </FormSection>

                <FormSection isFullWidth>
                  <FormSection.Title>Lokasi Rumah</FormSection.Title>

                  {userData?.latitude && userData?.longitude ? (
                    <>
                      <KoordinatAlert
                        pin_fields={userData?.pin_verification?.pin_fields}
                      />
                      <ReadOnlyMap
                        key={userData?.latitude + userData?.longitude}
                        className='mt-8'
                        center={[+userData.latitude, +userData.longitude]}
                        lockSubtitle='Berikut adalah lokasi yang anda pilih'
                      />
                    </>
                  ) : (
                    'Terjadi kesalahan dalam menampilkan lokasi rumah'
                  )}
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
              </FormProvider>
            </MacCard>
          </div>
        </section>
      </main>
    </Layout>
  );
}
