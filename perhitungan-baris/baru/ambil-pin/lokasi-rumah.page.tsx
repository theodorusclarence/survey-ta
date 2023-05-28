function LokasiRumahPage() {
  const router = useRouter();
  const dialog = useDialog();

  //#region  //*=========== Ambil Pin Store ===========
  const store = useAmbilPinStore((store) =>
    objectPick(store, [
      'base_latitude',
      'base_longitude',
      'coordinate',
      'isLocked',
    ])
  );
  const setFields = useAmbilPinStore.useSetFields();
  const userData = useUserDataStore.useAmbilPin();
  //#endregion  //*======== Ambil Pin Store ===========

  //#region  //*=========== Form ===========
  // Default to city coordinate, with ITS's coordinate as fallback
  const defaultLatitude = store.base_latitude
    ? +store.base_latitude
    : -7.282936;
  const defaultLongitude = store.base_longitude
    ? +store.base_longitude
    : 112.795172;

  const methods = useForm<LokasiRumahForm>({
    mode: 'onTouched',
    defaultValues: {
      coordinate: {
        latitude: store.coordinate?.latitude ?? defaultLatitude,
        longitude: store.coordinate?.longitude ?? defaultLongitude,
      },

      // also added on the MovableMap props
      isLocked: store.isLocked ?? false,
    },
  });
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = methods;
  const latitude = watch('coordinate.latitude');
  const longitude = watch('coordinate.longitude');
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<LokasiRumahForm> = (data) => {
    logger({ data });

    setFields({
      coordinate: data.coordinate,
      isLocked: data.isLocked,
    });

    handleNextStep({ type: TYPE, router });
  };
  function handleListenLock(isLocked: boolean) {
    // Validate when from unlocked to locked (to remove error message)
    if (isLocked) setValue('isLocked', isLocked, { shouldValidate: true });
    else setValue('isLocked', isLocked, { shouldDirty: true });
  }
  const preventLock =
    latitude === defaultLatitude && longitude === defaultLongitude;
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
                    <FormSection.Title>Lokasi Rumah</FormSection.Title>
                    <FormSection.Subtitle>
                      Harap menentukan lokasi rumah berdasarkan Kartu Keluarga
                      atau Surat Domisili
                    </FormSection.Subtitle>

                    <div>
                      <MovableMap
                        className='mt-8'
                        initialCenter={[latitude, longitude]}
                        formId={['coordinate.latitude', 'coordinate.longitude']}
                        lockSubtitle="Tekan tombol 'Buka Kunci Titik' untuk mengubah kembali"
                        listenIsLocked={handleListenLock}
                        defaultIsLocked={store.isLocked}
                        onPreventLock={
                          preventLock
                            ? () => toast.error('Titik belum digeser')
                            : undefined
                        }
                      />

                      <Checkbox
                        containerClassName='hidden'
                        label='Kunci Lokasi'
                        name='isLocked'
                        validation={{ required: 'Titik harus dikunci' }}
                      />
                      <ErrorMessage
                        className='mt-2'
                        id='isLocked'
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
