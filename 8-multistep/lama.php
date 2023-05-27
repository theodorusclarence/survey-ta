<style>
    .visited {
        color: #00798b !important;
    }

    .visited>.bubble,
    .visited>.bubble:after,
    .visited>.bubble:before {
        background-color: #00a9c0 !important;
    }

    .fw-buttons .disabled {
        cursor: not-allowed !important;
        pointer-events: auto !important;
    }

    .panel-default .panel-heading-custom {
        background-image: none;
        background-color: #0090a2;
        color: #fff;
        border-radius: 0;
    }

    .wizard-content {
        border: none;
    }

    .wizard-pane {
        padding: 0;
        display: none;
    }

    .wizard-pane.active {
        display: block;
    }
</style>
<script>
    var fw_fv = [];
    var lokasi_awal = {
        lat: -7.2471163,
        lon: 112.7351081,
    }
</script>
<script type="text/javascript">
    $(document).ready(function() {
        $('#exampleBasic').wizard({
            step: '.progress-indicator > li.fw-used',
            classes: {
                step: {
                    done: 'visited',
                    active: 'completed'
                }
            },
            buttonLabels: {
                next: 'Berikutnya',
                back: 'Kembali',
                finish: 'Selesai'
            },
            buttonsAppendTo: '.panel-footer',
            templates: {
                buttons: function() {
                    const options = this.options;
                    return `<div class="fw-buttons">
                    <a class="btn btn-danger font-putih" href="#${this.id}" data-wizard="back" role="button">
                        ${options.buttonLabels.back}</a>
                    <a class="btn btn-primary pull-right font-putih" href="#${this.id}" data-wizard="next" role="button">
                        ${options.buttonLabels.next}</a>
                    <a class="btn btn-primary pull-right font-putih" href="#${this.id}" data-wizard="finish" role="button">
                        ${options.buttonLabels.finish}</a></div>`;
                }
            },
            onFinish: function() {
                swal({
                    title: 'Apakah Anda sudah yakin?',
                    html: "<span class='font-reguler'>Data akan disimpan permanen dan tidak dapat diubah!</span>",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Belum yakin',
                    confirmButtonText: 'Ya, Saya Yakin',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showLoaderOnConfirm: true
                }).then(function() {
                    $('#fancyBoxBtn').trigger('click');
                }).catch(function() {

                });
            },
            onNext: function(from, to) {
                $('html, body').animate({
                    scrollTop: 0
                }, 200);
            },
            validator: function(step) {
                if (fw_fv[step.index] === undefined) { //langsung saja kalau gak ada validation e
                    return true;
                }
                fw_fv[step.index].form();
                if (fw_fv[step.index].valid() === true) {
                    const isAkselElement = $('input[name=is_aksel]:checked');

                    if(isAkselElement.length) {
                        $('#resume-rapor').empty();
                        $('ul#resume-berkas-rapor').empty();

                        const jumlahSemester = isAkselElement.val() === '1' ? 3 : 5;

                        Array.from(Array(jumlahSemester).keys()).forEach((i) => {
                            console.log(`input[name="agm[${i}]"]`)

                            const agama = $(`input[name="agm[${i}]"]`).val();
                            const ppkn = $(`input[name="pkn[${i}]"]`).val();
                            const ind = $(`input[name="ind[${i}]"]`).val();
                            const mat = $(`input[name="mat[${i}]"]`).val();
                            const ipa = $(`input[name="ipa[${i}]"]`).val();
                            const ips = $(`input[name="ips[${i}]"]`).val();
                            const ing = $(`input[name="ing[${i}]"]`).val();

                            $('#resume-rapor').append(`
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${agama}</td>
                                    <td>${ppkn}</td>
                                    <td>${ind}</td>
                                    <td>${mat}</td>
                                    <td>${ipa}</td>
                                    <td>${ips}</td>
                                    <td>${ing}</td>
                                </tr>
                            `)
                        });

                        $('ul#resume-berkas-rapor').append($('ul#rapor-result').children().clone());
                        $('#resume-rapor-group').css("display", "block");
                    }

                    const lat = $('input#lat').val();
                    const lon = $('input#lon').val();
                    const nearSchool = $('input#near-school').val();

                    if(lat && lon) {
                        if (nearSchool === "") {
                            let kota_kab_kk = $('select[name=kab_kota_kk]').val()? $('select[name=kab_kota_kk]').val().split("_") : null;
                            let kota_kab_skd = $('select#kab_kota_skd', '#skd').val() ? $('select#kab_kota_skd', '#skd').val().split("_") : null;

                            kota_kab_kk = (kota_kab_kk && kota_kab_kk.length > 1)? kota_kab_kk[0] : ((kota_kab_skd && kota_kab_skd.length > 1) ? kota_kab_skd[0] :'01');
                            let sekolah_kota_kab_payload = [];
                            $.ajax({
                                url: `<?php echo base_url("api/get_sekolah_kota_kab"); ?>/${kota_kab_kk}`,
                                type: "GET",
                                dataType: "json",
                                async: false,
                                success: function(response) {
                                    if (response.data) {
                                        sekolah_kota_kab_payload = response.data;
                                    }
                                }
                            });
                            $.ajax({
                                url: `<?php echo base_url("api/get_rekomendasi_sekolah"); ?>?lat=${lat}&long=${lon}&kota_kab=${kota_kab_kk}`,
                                type: "POST",
                                dataType: "json",
                                contentType : 'application/json',
                                async: false,
                                data: JSON.stringify({
                                    'data': sekolah_kota_kab_payload
                                }),
                                success: function(response) {
                                    // swal sesuaikan
                                    if (response.success) {
                                        let smaTerdekat = response.data.rekomendasi_sma? response.data.rekomendasi_sma.jarak : 999;
                                        let smkTerdekat = response.data.rekomendasi_smk? response.data.rekomendasi_smk.jarak : 999;
                                        let jarakMin = Math.min(smaTerdekat, smkTerdekat);
                                        let sekolahCek = smaTerdekat < smkTerdekat? response.data.rekomendasi_sma : response.data.rekomendasi_smk;
                                        $('input#near-school').val(0);
                                        if (jarakMin <= 70) {
                                            $('input#near-school').val(1);
                                            $('input#near-school-npsn').val(sekolahCek.npsn);
                                            $('input#near-school-jarak').val(sekolahCek.jarak);
                                            swal({
                                                title: 'Peringatan',
                                                text: "Lokasi anda berada dalam area sekolah (SMA/SMK). Silahkan melakukan ganti lokasi.",
                                                type: 'warning',
                                                showCancelButton: true,
                                                cancelButtonText: 'Lanjutkan Pengisian',
                                                confirmButtonText: 'Ganti Lokasi',
                                                allowOutsideClick: false,
                                                allowEscapeKey: false,
                                                allowEnterKey: false,
                                                showLoaderOnConfirm: true
                                            }).then(function (isConfirm) {
                                                $('input#near-school').val(null);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                $('#ganti-lokasi').click();
                                            }, function () {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                $('a[data-wizard=next]').click()
                                            })

                                        } else {
                                            $('a[data-wizard=next]').click()
                                        }
                                    }
                                    return true;
                                },
                                error: function(xhr, status, error) {
                                    // swal error
                                    $('input#near-school').val(0);
                                    console.log(xhr.responseText);
                                }
                            })
                        }
                        showMap(lat, lon);
                        $('#resume-lokasi-group').css("display", "block");
                    }

                    const kondisi = $('input[name=kondisi]:checked').val();

                    const resumeFileContainer = $('ul#resume-berkas');
                    resumeFileContainer.empty()

                    let kotaInput, kecamatanInput, kelurahanInput, rtInput, rwInput, nikInput, noKKInput, alamatInput, hpInput, tanggalTerbitInput, primaryFileInput, kkFiles;

                    if(kondisi === 'normal') {
                        kotaInput = $('select#kab_kota_kk', '#kk').val();
                        kecamatanInput = $('select#kecamatan_kk', '#kk').val()?.split("_")[1] || $('input#kecamatan_kk', '#kk').val();
                        kelurahanInput = $('input#kelurahan', '#kk').val();
                        rtInput = $('input#rt', '#kk').val();
                        rwInput = $('input#rw', '#kk').val();
                        nikInput = $('input#nik', '#kk').val();
                        noKKInput = $('input#no_kk', '#kk').val();
                        alamatInput = $('textarea#alamat', '#kk').val();
                        hpInput = $('input#no_telp', '#kk').val();
                        tanggalTerbitInput = $('input#tanggal_berlaku_kk', '#kk').val();

                        resumeFileContainer.append($('ul#file-kk-result').children().clone());
                        resumeFileContainer.append($('ul#file-sk-disdukcapil-result').children().clone());
                        
                        $('#resume-no-kk').text(noKKInput);
                      } else {
                        kotaInput = $('select#kab_kota_skd', '#skd').val();
                        kecamatanInput = $('select#kecamatan_skd', '#skd').val()?.split("_")[1];
                        kelurahanInput = $('input#kelurahan_skd', '#skd').val();
                        rtInput = $('input#rt_skd', '#skd').val();
                        rwInput = $('input#rw_skd', '#skd').val();
                        nikInput = $('input#nik2', '#skd').val();
                        alamatInput = $('textarea#alamat_skd', '#skd').val();
                        hpInput = $('input#no_telp', '#skd').val();
                        tanggalTerbitInput = $('input#tanggal_berlaku_skd', '#skd').val();

                        resumeFileContainer.append($('ul#file-skd-result').children().clone());

                        if(kondisi === 'ponpes panti')
                            resumeFileContainer.append($('ul#file-sk-pondok-panti-result').children().clone());
                        else if(kondisi === 'bencana')
                            resumeFileContainer.append($('ul#file-sk-bencana-result').children().clone());

                        $('#resume-no-kk-container').css("display", "none");
                    }

                    if (kotaInput) {
                        $('#resume-kota').text(kotaInput?.split("_")[1]);
                        $('#resume-kecamatan').text(kecamatanInput);
                        $('#resume-kelurahan').text(kelurahanInput);
                        $('#resume-rt-rw').text(`${rtInput}/${rwInput}`);
                        $('#resume-nik').text(nikInput);
                        $('#resume-alamat').text(alamatInput);
                        $('#resume-hp').text(hpInput);
                        $('#resume-tanggal-terbit').text(tanggalTerbitInput);

                        $('#resume-kk-group').css("display", "block");
                        $('#resume-berkas-group').css("display", "block");
                    }

                    return true;
                } else {
                    var elem = $('.has-error').first().children().first();
                    $('html, body').animate({
                        scrollTop: elem.offset().top - window.innerHeight / 4
                    }, 200);
                    return false;
                }
            },

        });
    });
</script>
<div class="row font">
    <h2 class="font-tebel text-center">
        <?= $topik ?>
        <?php if (isset($sub_topik)) { ?>
            <span style="font-size: 25px">| <?= $sub_topik ?> </span>
        <?php } ?>
        <small>| <?= $nama ?></small>
    </h2>
    <hr />
    <div class="col-md-12 col-md-border">
        <div id="exampleBasic" class="wizard">
            <ul class="progress-indicator" role="tablist">
                <?php
                $found_first_step = false;
                if (isset($fw_steps)) {
                    foreach ($fw_steps as $step) {
                        if (
                            isset($step["notused"]) and
                            $step["notused"] and
                            !$found_first_step
                        ) {
                            echo '<li class="completed"><span class="bubble"></span>' .
                                $step["step"] .
                                "</li>";
                        } elseif (
                            isset($step["notused"]) and $step["notused"]
                        ) {
                            echo '<li><span class="bubble"></span>' .
                                $step["step"] .
                                "</li>";
                        } elseif (!$found_first_step) {
                            echo '<li class="fw-used completed" role="tab"><span class="bubble"></span>' .
                                $step["step"] .
                                "</li>";
                            $found_first_step = true;
                        } else {
                            echo '<li class="fw-used" role="tab"><span class="bubble"></span>' .
                                $step["step"] .
                                "</li>";
                        }
                    }
                }
                ?>
            </ul>
            <?php if (isset($pesan_penolakan) and $pesan_penolakan) { ?>
                <div>
                    <div class="alert alert-warning text-center font-tipis" style="margin-bottom:10px">
                        <h4><?php echo $pesan_penolakan; ?></h4>
                    </div>
                </div>
            <?php } ?>
            <div>
                <div class="alert alert-info text-center font-tipis" style="margin-bottom:10px">
                    <h4>Masuk sebagai <b><?= $datadiri["data_siswa"]
                        ->smp_nama_siswa ?></b>. Jika data yang tertera tidak sesuai, silahkan lapor pada sekolah asal.</h4> 
                </div>
            </div>
            <div class="panel panel-default card-1">
                <div class="wizard-content">
                    <?php foreach ($fw_contents as $i => $content) {
                        echo '<div class="wizard-pane ' .
                            ($i == 0 ? "active" : "") .
                            '" role="tabpanel">' .
                            $content .
                            "</div>";
                    } ?>
                    <div class="panel-footer">
                    </div>
                    <form action="<?= base_url(
                        $route
                    ) ?>" method="post" accept-charset="utf-8" id="form-utama" enctype="text/plain">
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
