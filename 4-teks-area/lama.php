<div class="form-group" style="width: 384px; margin: 400px 0;">
  <label>Alamat Rumah sesuai KK <span style="color:red">*</span></label>
  <textarea class="form-control" id="alamat" name="alamat" rows=3 required></textarea>
</div>

<script type="text/javascript">
$( document ).ready( function () {
  var FormKK_validator = $( "#FormKK" ).validate( {
    rules: {
      alamat: {
        alphanumeric: true,
        maxlength: 127
      },
    },
    messages: {
      alamat: {
        maxlength: "* maksimal 127 huruf"
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
</script> 