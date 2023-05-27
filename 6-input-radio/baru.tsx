<FormProvider {...methods}>
  <form>
    <FormSection>
      <div className='space-y-1'>
        <FormSection.Title>Kondisi</FormSection.Title>
      </div>
      <div>
        <div className='flex flex-col gap-4 sm:flex-row sm:flex-wrap'>
          <Radio
            name='kk.domicile_type'
            label='Kartu Keluarga'
            value='kk'
            validation={{ required: 'Kondisi harus diisi' }}
            hideError
          />
          <Radio
            name='kk.domicile_type'
            label='Domisili (Pindah Tugas Ortu/Wali)'
            value='mutation'
            hideError
          />
          <Radio
            name='kk.domicile_type'
            label='Domisili (Bencana Alam/Sosial)'
            value='natural_or_social_disaster'
            hideError
          />
          <Radio
            name='kk.domicile_type'
            label='Domisili (Ponpes/Panti)'
            value='pesantren_or_orphanage'
            hideError
          />
        </div>
        <ErrorMessage className='mt-2' id='kk.domicile_type' />
      </div>
    </FormSection>
  </form>
</FormProvider>;
