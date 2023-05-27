<div class="form-group" style="margin: 400px 0; width: 384px;">
  <label>Unggah Kartu Keluarga <span style="color:red">*</span></label>
    <div class="input-group">
    <span class="input-group-btn" style="vertical-align: top;">
      <span class="btn btn-default btn-file" id="file-kk" fileupload-result="#file-kk-result">
        Browse...
      </span>
    </span>
    <div id="filename" class="form-control" style="height:fit-content;z-index: 0;">
      Foto Kartu Keluarga
    </div>
  </div>
  <div>
    <input class="file-kk" value="" readonly name="file_kk[]" style="position: absolute;opacity: 0;height: 0;">
  </div>
  <ul class="fileupload-result" id="file-kk-result" style="margin-top: 12;"> 
  </ul>
</div>


<script type="text/javascript">
$( document ).ready( function () {
  new CustomUploadWizard($('#file-kk'), $('#fileupload'), {
      min:1, max:1,
      name: 'KK',
      target_name: 'file_kk',
      target_class: 'file-kk',
    },
    [
      { "name":"tipe_berkas", "value":"foto_kk"},
      { "name":"smp_uasbn", "value":"<?= $smp_uasbn ?>"}
    ],'<h5>Harap mengunggah file berupa gambar jernih (.jpeg/.jpg/.png) dengan ukuran minimum 100 KB dan maksimum 400 KB</h5>'
  );

  var FormKK_validator = $( "#FormKK" ).validate( {
    rules: {
      'file_kk[]': {
        require_from_group: [1, ".file-kk"]
      },
    },
    messages: {
      'file_kk[]': "* Belum melakukan unggah KK",
    },
    success: function(label) {
      label.detach();
    },
    errorElement: "em",
    errorPlacement: function ( error, element ) {
      // Add the `help-block` class to the error element
      error.addClass( "help-block" );

      if ( element.prop( "type" ) === "checkbox" ) {
        error.insertAfter( element.parent( "label" ) );
      } else {
        element.closest('.form-group').append(error);
        // error.insertAfter( element );
      }
    },
    highlight: function ( element, errorClass, validClass ) {
      $( element ).parent().addClass( "has-error" ).removeClass( "has-success" );
    },
    unhighlight: function (element, errorClass, validClass) {
      $( element ).parent().removeClass( "has-error" );
    }
  });

  fw_fv.push(FormKK_validator);
});
</script> 