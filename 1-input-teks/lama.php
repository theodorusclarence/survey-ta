<div class="form-group">
  <label>NIK 
    <span style="color:red">*</span>
  </label>
  <input type="text" class="form-control" id="nik" pattern="^\d{16}$" title="NIK terdiri dari 16 angka" name="nik" required value="" />
</div>

<script type="text/javascript">
$( document ).ready( function () {
  var FormKK_validator = $( "#FormKK" ).validate( {
    rules: {
      nik:{
        rangelength: [16, 16],
        digits: true
      },
    },
    messages: {
      nik: "NIK terdiri dari 16 angka"
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
</script> 