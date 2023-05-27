<div class="form-group">
  <label>Provinsi <span style="color:red">*</span></label>
  <select name="provinsi_kk" id="provinsi_kk" class="form-control" required>
    <option value="05_JAWA TIMUR" selected>JAWA TIMUR</option>
    <?php if (isset($all_provinsi)) {
      foreach ($all_provinsi as $provinsi) { ?>
      <option value="<?= $provinsi->kode_provinsi ?>_<?= $provinsi->nama_provinsi ?>"><?= $provinsi->nama_provinsi ?></option>        
    <?php }
    } ?>
  </select>
</div>

<script type="text/javascript">
$( document ).ready( function () {
  $('input[name^=tanggal]').datepicker({
    // defaultDate: new Date(0000, 0, 0),
    minDate: new Date(1999, 6, 12),
    changeMonth: true,
    changeYear: true,
    dateFormat: 'dd-mm-yy',
    currentText: "00-00-0000",
    // assumeNearbyYear: 20,
    yearRange: '2000:2022'
  });

  var FormKK_validator = $( "#FormKK" ).validate( {
    rules: {},
    messages: {
      provinsi_kk:{
        required: "* Silahkan pilih provinsi"
      },
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

$.fn.select2.defaults.set( "theme", "bootstrap" );
$.fn.select2.defaults.set( "width", "100%" );
$("#provinsi_kk").select2({
  placeholder: "Pilih Provinsi KK",
});
</script> 