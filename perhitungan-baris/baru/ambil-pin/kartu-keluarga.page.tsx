function KartuKeluargaPage() {
  const router = useRouter();
  const dialog = useDialog();

  //#region  //*=========== Ambil Pin Store ===========
  const store = useAmbilPinStore((store) =>
    objectPick(store, ['kk', 'surat', 'province_id', 'city_id'])
  );
  const setFields = useAmbilPinStore.useSetFields();

  const userData = useUserDataStore.useAmbilPin();
  //#endregion  //*======== Ambil Pin Store ===========

  //#region  //*=========== Form ===========
  const methods = useForm<KKForm>({
    mode: 'onTouched',
    defaultValues: {
      province_id: store.province_id ?? JAWA_TIMUR_PROVINCE_ID,
      city_id: store.city_id,
      surat: store.surat,
      kk: {
        ...store.kk,
        domicile_type: store.kk?.domicile_type ?? 'kk',
      },
    },
  });
  const {
    handleSubmit,
    watch,
    formState: { isDirty },
    resetField,
  } = methods;

  const domicile_type = watch('kk.domicile_type');
  const tanggal_terbit = watch('kk.kk_date');

  const province_id = watch('province_id');
  const city_id = watch('city_id');
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const { data: cities } = useGetCitiesByProvince({ province_id });
  const onSubmit: SubmitHandler<KKForm> = (data) => {
    logger({ data });

    // Get base coordinate for lokasi rumah
    const base_latitude = cities?.data.find(
      (city) => city.id + '' === city_id
    )?.base_latitude;
    const base_longitude = cities?.data.find(
      (city) => city.id + '' === city_id
    )?.base_longitude;

    setFields({
      province_id: data.province_id,
      city_id: data.city_id,
      kk: data.kk,
      surat: data.surat,

      base_latitude,
      base_longitude,
    });

    handleNextStep({ type: TYPE, router });
  };
  //#endregion  //*======== Form Submit ===========

  //#region  //*=========== Reset Dependent Select ===========
  React.useEffect(() => {
    resetField('city_id');
  }, [province_id, resetField]);
  React.useEffect(() => {
    resetField('kk.subdistrict_id');
  }, [city_id, resetField]);
  //#endregion  //*======== Reset Dependent Select ===========

  //#region  //*=========== Conditional Copywritings ===========
  const jenisKartu = getJenisKartuKeluargaLabel(domicile_type);
  const jenisSurat = getDomicileTypeLabel(domicile_type);
  const jenisSuratLabel =
    getJenisSuratLabel(domicile_type) ?? 'Surat Keterangan';

  // show if KK diterbitkan setelah MIN_KK_DATE
  // The actual MIN_KK_DATE should also show the surat keterangan RT input
  const shouldShowSuratKeteranganRTInput =
    domicile_type === 'kk' && tanggal_terbit >= parseDateFromAPI(MIN_KK_DATE);
  const shouldShowSuratKeteranganKondisiInput =
    domicile_type !== 'kk' && jenisSurat;
  const shouldShowKKNumberInput = domicile_type === 'kk';
  //#endregion  //*======== Conditional Copywritings ===========

  return (
    <Layout>
      <Seo templateTitle='Kartu Keluarga - Ambil PIN' />

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

                  <div className='py-6'>
                    <Alert>
                      Harap memilih opsi yang sesuai dengan kondisi anda. Opsi
                      yang anda pilih akan menentukan jalur pendaftaran yang
                      dapat anda ikuti
                    </Alert>
                    <KKConditionInfo className='mt-6' />
                  </div>

                  <FormSection>
                    <div className='space-y-1'>
                      <FormSection.Title>Kondisi</FormSection.Title>
                    </div>
                    <div>
                      <div className='flex flex-col gap-4 sm:flex-row sm:flex-wrap'>
                        <Radio
                          name='kk.domicile_type'
                          label={getDomicileTypeLabel('kk') ?? ''}
                          value='kk'
                          validation={{ required: 'Kondisi harus diisi' }}
                          hideError
                        />
                        <Radio
                          name='kk.domicile_type'
                          label={getDomicileTypeLabel('mutation') ?? ''}
                          value='mutation'
                          hideError
                        />
                        <Radio
                          name='kk.domicile_type'
                          label={
                            getDomicileTypeLabel(
                              'natural_or_social_disaster'
                            ) ?? ''
                          }
                          value='natural_or_social_disaster'
                          hideError
                        />
                        <Radio
                          name='kk.domicile_type'
                          label={
                            getDomicileTypeLabel('pesantren_or_orphanage') ?? ''
                          }
                          value='pesantren_or_orphanage'
                          hideError
                        />
                      </div>
                      <ErrorMessage
                        className='mt-2'
                        id='kk.domicile_type'
                      />
                    </div>
                  </FormSection>

                  {shouldShowSuratKeteranganKondisiInput && (
                    <FormSection>
                      <div className='space-y-1'>
                        <FormSection.Title>Surat Keterangan</FormSection.Title>
                      </div>
                      <div>
                        <DropzoneInput
                          id='surat'
                          label={jenisSuratLabel}
                          validation={{
                            required: `${jenisSuratLabel} harus diisi`,
                          }}
                          accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                          helperText={IMAGE_UPLOAD_HELPER_TEXT}
                        />
                      </div>
                    </FormSection>
                  )}

                  <FormSection>
                    <div className='space-y-1'>
                      <FormSection.Title>Data Diri</FormSection.Title>
                    </div>
                    <div className='grid gap-3 lg:grid-cols-2'>
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
                      <Input
                        id='kk.phone'
                        label='Nomor HP'
                        inputMode='tel'
                        validation={{
                          required: 'Nomor HP harus diisi',
                          pattern: {
                            value: REGEX.PHONE_NUMBER,
                            message:
                              'Nomor HP harus menggunakan format 08, contoh: 081234567890',
                          },
                        }}
                        placeholder='Masukkan Nomor HP'
                        helperText='Gunakan format 08, contoh: 081234567890'
                      />
                      {(userData?.pin_route === 'outside_jatim' ||
                        userData?.pin_route === 'previous_year') && (
                        <>
                          <Input
                            id='kk.birth_place'
                            label='Tempat Lahir'
                            validation={{
                              required: 'Tempat Lahir harus diisi',
                            }}
                            placeholder='Masukkan tempat lahir'
                          />
                          <SearchableSelectInput
                            id='kk.gender'
                            label='Jenis Kelamin'
                            placeholder='Pilih jenis kelamin'
                            options={GENDER_OPTIONS}
                            validation={{
                              required: 'Jenis kelamin harus diisi',
                            }}
                          />
                        </>
                      )}
                    </div>
                  </FormSection>

                  <FormSection>
                    <div className='space-y-1'>
                      <FormSection.Title>Data {jenisKartu}</FormSection.Title>
                      <FormSection.Subtitle>
                        Isilah data sesuai dengan {jenisKartu}
                      </FormSection.Subtitle>
                    </div>

                    <FormSection.TwoColumnContent>
                      <TypographyAlert
                        variant='warning'
                        leftIcon={AlertTriangle}
                        className='@lg:col-span-2'
                      >
                        <p>
                          <span className='font-semibold'>
                            Pemilihan Kabupaten/Kota
                          </span>
                          <br />
                          Kabupaten/Kota yang dipilih akan menjadi tempat
                          penitikan awal lokasi rumah anda
                        </p>
                      </TypographyAlert>

                      <ServerSelectInput
                        id='province_id'
                        route='/provinces'
                        label='Provinsi Sekolah Asal'
                        placeholder='Pilih provinsi'
                        validation={{ required: 'Provinsi harus diisi' }}
                      />

                      <ServerSelectInput
                        id='city_id'
                        label='Kabupaten/Kota'
                        placeholder='Pilih Kabupaten/Kota'
                        route={queryString.stringifyUrl({
                          url: '/cities',
                          query: { 'filter[province_id]': province_id },
                        })}
                        enabled={!!province_id}
                        validation={{ required: 'Kabupaten/Kota harus diisi' }}
                      />

                      <ServerSelectInput
                        id='kk.subdistrict_id'
                        label='Kecamatan'
                        placeholder='Pilih kecamatan'
                        route={queryString.stringifyUrl({
                          url: '/subdistricts',
                          query: { 'filter[city_id]': city_id },
                        })}
                        enabled={!!city_id}
                        validation={{ required: 'Kecamatan harus diisi' }}
                      />

                      <Input
                        id='kk.kelurahan'
                        label='Desa/Kelurahan'
                        validation={{
                          required: 'Desa/Kelurahan harus diisi',
                        }}
                        placeholder='Masukkan Desa/Kelurahan'
                      />

                      <TextArea
                        id='kk.address'
                        containerClassName='@lg:col-span-2'
                        label={`Alamat Rumah sesuai ${jenisKartu}`}
                        placeholder='Masukkan alamat rumah'
                        validation={{ required: 'Alamat Rumah harus diisi' }}
                      />

                      <Input
                        id='kk.rt'
                        label='RT'
                        inputMode='numeric'
                        validation={{
                          required: 'RT harus diisi',
                          pattern: {
                            value: REGEX.NUMBER,
                            message: 'RT harus berupa angka',
                          },
                          maxLength: {
                            value: 3,
                            message: 'RT maksimal 3 digit',
                          },
                        }}
                        placeholder='Masukkan RT'
                      />

                      <Input
                        id='kk.rw'
                        label='RW'
                        inputMode='numeric'
                        validation={{
                          required: 'RW harus diisi',
                          pattern: {
                            value: REGEX.NUMBER,
                            message: 'RW harus berupa angka',
                          },
                          maxLength: {
                            value: 3,
                            message: 'RW maksimal 3 digit',
                          },
                        }}
                        placeholder='Masukkan RW'
                      />

                      <DropzoneInput
                        containerClassName='@lg:col-span-2'
                        id='kk.kk'
                        label={`Unggah ${jenisKartu}`}
                        validation={{
                          required: `${jenisKartu} harus diisi`,
                        }}
                        accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                        helperText={IMAGE_UPLOAD_HELPER_TEXT}
                      />

                      {shouldShowKKNumberInput && (
                        <Input
                          id='kk.kk_number'
                          label='Nomor KK'
                          inputMode='numeric'
                          validation={{
                            required: 'Nomor KK harus diisi',
                            pattern: {
                              value: REGEX.NUMBER,
                              message: 'Nomor KK harus berupa angka',
                            },
                            ...exactLength(
                              16,
                              'Nomor KK harus berjumlah 16 digit'
                            ),
                          }}
                          placeholder='Masukkan Nomor KK'
                        />
                      )}

                      <DatePicker
                        id='kk.kk_date'
                        label={`Tanggal Terbit ${jenisKartu}`}
                        maxDate={new Date()}
                        validation={{
                          required: `Tanggal Terbit ${jenisKartu} harus diisi`,
                        }}
                        placeholder='Masukkan tanggal terbit'
                      />

                      {shouldShowSuratKeteranganRTInput && (
                        <div className='@lg:col-span-2'>
                          <Alert variant='secondary'>
                            Untuk Kartu Keluarga Baru yang diterbitkan kurang
                            dari 1 (satu) tahun karena sesuatu hal, harus
                            dilampiri Surat Keterangan yang dikeluarkan oleh
                            Ketua RT serta diketahui oleh Ketua RW dan Kepala
                            Desa/Lurah setempat sesuai dengan Kartu Keluarga
                            Baru, dengan disertai penjelasan alasan perubahan
                            Kartu Keluarga. Atau bisa diganti dengan foto kartu
                            keluarga lama.
                          </Alert>
                          <DropzoneInput
                            containerClassName='mt-1'
                            id='kk.new_kk_letter'
                            label='Unggah Surat Keterangan RT'
                            validation={{
                              required: 'Surat Keterangan RT harus diisi',
                            }}
                            accept={IMAGE_UPLOAD_ALLOWED_EXTENSION}
                            helperText={IMAGE_UPLOAD_HELPER_TEXT}
                          />
                        </div>
                      )}
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
