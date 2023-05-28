function DataPesertaPage() {
  const router = useRouter();

  //#region  //*=========== Store ===========
  const userData = useUserDataStore.usePendaftaranAfirmasi();
  //#endregion  //*======== Store ===========

  return (
    <Layout>
      <Seo templateTitle='Data Peserta - Pendaftaran Afirmasi' />

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
                  <FormSection.Subtitle>
                    Berikut data yang akan anda gunakan untuk melakukan
                    Pendaftaran PPDB Jalur Afirmasi
                  </FormSection.Subtitle>
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

              <div
                className={clsx([
                  'pt-6',
                  'flex justify-end gap-2 sm:flex-row sm:items-center',
                ])}
              >
                <Button
                  rightIcon={ArrowRight}
                  onClick={() => handleNextStep({ type: TYPE, router })}
                >
                  Selanjutnya
                </Button>
              </div>
            </MacCard>
          </div>
        </section>
      </main>
    </Layout>
  );
}
