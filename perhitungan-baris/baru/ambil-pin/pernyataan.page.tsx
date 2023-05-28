function PernyataanPage() {
  const router = useRouter();
  const dialog = useDialog();

  //#region  //*=========== Ambil Pin Store ===========
  const store = useAmbilPinStore((store) => objectPick(store, ['agreement']));
  const setFields = useAmbilPinStore.useSetFields();
  const userData = useUserDataStore.useAmbilPin();
  //#endregion  //*======== Ambil Pin Store ===========

  //#region  //*=========== Form ===========
  const methods = useForm<SyaratKetentuanForm>({
    mode: 'onTouched',
    defaultValues: {
      agreement: store.agreement,
    },
  });
  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<SyaratKetentuanForm> = (data) => {
    logger({ data });

    setFields({
      agreement: data.agreement,
    });

    handleNextStep({ type: TYPE, router });
  };
  //#endregion  //*======== Form Submit ===========

  return (
    <Layout>
      <Seo templateTitle='Lokasi Rumah - Ambil PIN' />

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
                    <FormSection.Title>Syarat dan Ketentuan</FormSection.Title>
                    <FormSection.Subtitle>
                      Harap membaca dan menyetujui syarat dan ketentuan PPDB
                      Jawa Timur 2023 dengan seksama.
                    </FormSection.Subtitle>

                    <div className='prose prose-sm mt-8 max-w-none'>
                      <p>Dengan sungguh-sungguh menyatakan bahwa saya:</p>

                      <ol>
                        <li>
                          Tidak sedang terlibat dalam tindak pidana dan/atau
                          penyalahgunaan narkoba.
                        </li>
                        <li>
                          Tidak bertato dan/atau tidak bertindik bagi calon
                          peserta didik baru laki-laki dan tidak bertindik bukan
                          pada tempatnya bagi calon peserta didik baru wanita.
                        </li>
                        <li>
                          Seluruh pernyataan data dan informasi beserta seluruh
                          dokumen yang saya lampirkan dalam berkas Pengambilan
                          PIN Peneriman Peserta Didik Baru SMAN/SMKN 2023
                          Provinsi Jawa Timur adalah benar.
                        </li>
                        <li>
                          Apabila diperlukan, saya bersedia memberikan informasi
                          lebih lanjut untuk melengkapi dokumen pendaftaran ini.
                        </li>
                      </ol>

                      <p>
                        Demikian pernyataan ini saya buat dengan sebenarnya dan
                        penuh rasa tanggung jawab.
                      </p>
                      <p>
                        Apabila dikemudian hari atau sewaktu-waktu
                        ditemukan/terbukti bahwa{' '}
                        <b>
                          pernyataan tersebut ternyata tidak benar dan tidak
                          sesuai dengan kondisi faktual, dan bahwa data/dokumen
                          yang saya sampaikan tidak benar dan/atau ada pemalsuan
                        </b>{' '}
                        maka saya bertanggungjawab untuk diproses sesuai dengan
                        aturan hukum yang berlaku dan jika diterima sebagai
                        Calon Peserta Didik Baru, dicabut haknya sebagai peserta
                        didik baru.
                      </p>
                    </div>

                    <div className='mt-4'>
                      <Checkbox
                        name='agreement'
                        label='Saya menyetujui syarat dan ketentuan di atas'
                        value='agree'
                        validation={{
                          required:
                            'Anda harus menyetujui syarat dan ketentuan',
                        }}
                      />
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
