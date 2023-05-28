function PilihSekolahPage() {
  const router = useRouter();
  const dialog = useDialog();

  //#region  //*=========== Store ===========
  const store = useAfirmasiStore();
  const userData = useUserDataStore.usePendaftaranAfirmasi();

  const setFields = useAfirmasiStore.useSetFields();
  const logout = useAuthStore.useLogout();
  //#endregion  //*======== Store ===========

  //#region  //*=========== Form ===========
  const methods = useForm<PilihSekolahAfirmasiForm>({
    mode: 'onTouched',
    defaultValues: {
      school: {
        type: store.school?.type,
        city: store.school?.city,
        school: store.school?.school,
        major: store.school?.major,
      },
    },
  });
  const {
    handleSubmit,
    formState: { isDirty },
    getValues,
  } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Medical Check Validation ===========
  const { data: majorData } = useGetMajorsBySMKMajor({
    smk_major_id: getValues('school.major'),
  });
  const terms = majorData?.data[0].terms;

  const validateMedicalTest = (): boolean => {
    // if the prodi doenst require any terms
    if (!terms || Array.isArray(terms)) return true;

    // if user haven't submit medical test or
    // if user's medical test haven't verified
    if (
      userData?.medical_test?.status === null ||
      userData?.medical_test?.status !== 'valid'
    ) {
      dialog({
        title: 'Membutuhkan Hasil Verifikasi Kesehatan',
        description: (
          <>
            Prodi ini memerlukan hasil tes kesehatan, silahkan melakukan hasil
            verifikasi kesehatan terlebih dahulu.
          </>
        ),
        submitText: 'Verifikasi Kesehatan',
        variant: 'danger',
      }).then(() => {
        router.push('/verifikasi-kesehatan/login');
      });
      return false;
    }

    // if user's current medical test didn't match the required terms
    if (terms.color_blind && userData?.medical_test.is_color_blind === true) {
      toast.error('Anda tidak memenuhi syarat tidak buta warna pada prodi ini');
      return false;
    }

    // if user's current medical test didn't match the required terms
    if (
      (terms.min_height_female &&
        userData.gender === 'P' &&
        userData.medical_test.height < parseInt(terms.min_height_female)) ||
      (terms.min_height_male &&
        userData.gender === 'L' &&
        userData.medical_test.height < parseInt(terms.min_height_male))
    ) {
      toast.error('Anda tidak memenuhi syarat tinggi badan pada prodi ini');
      return false;
    }

    return true;
  };
  //#endregion  //*======== Medical Check Validation ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<PilihSekolahAfirmasiForm> = (data) => {
    logger(userData?.medical_test, 'pilih-sekolah.page.tsx line 103');

    if (data.school.type === 'smk_major') {
      const isMedicalTestValid = validateMedicalTest();
      if (!isMedicalTestValid) {
        return;
      }
    }

    setFields({
      school: data.school,
    });

    handleNextStep({ type: TYPE, router });
  };
  //#endregion  //*======== Form Submit ===========

  if (!userData) {
    logout();
    return null;
  }

  return (
    <Layout>
      <Seo templateTitle='Pilih Sekolah - Pendaftaran Afirmasi' />

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
                  className='mt-16 overflow-visible'
                  childrenClassName='divide-y divide-typo-divider p-5 sm:p-9'
                >
                  <FormStepper
                    type={TYPE}
                    isEdited={isDirty}
                  />
                  <FormSection>
                    <div className='space-y-1'>
                      <FormSection.Title>Pilihan Sekolah</FormSection.Title>
                      <FormSection.Subtitle>
                        Lakukan pemilihan sekolah sesuai dengan ketentuan dan
                        kuota yang diberikan
                      </FormSection.Subtitle>
                    </div>
                    <SingleSchoolSelect
                      userSubdistrictId={userData.subdistrict_id + ''}
                    />
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
