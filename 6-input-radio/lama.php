<div>
    <h5 style="font-weight:600;">Kondisi</h5>
    <label class="radio-inline">
      <input disabled type="radio" value="normal" name="kondisi">KK
    </label>
    <label class="radio-inline">
      <input disabled type="radio" value="pindah tugas" name="kondisi">Domisili (Pindah Tugas Ortu/Wali)
    </label>
    <label class="radio-inline">
      <input disabled type="radio" value="ponpes panti" name="kondisi">Domisili (Ponpes/Panti)
    </label>
    <label class="radio-inline">
      <input disabled type="radio" value="bencana" name="kondisi">Domisili (Bencana Alam/Sosial)
    </label>
  </div>

<script type="text/javascript">
$( document ).ready( function () {
  var FormKK_validator = $( "#FormKK" ).validate( {
    rules: {},
    messages: {},
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
</script> 