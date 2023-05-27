<div class="form-group" style="margin: 400px 0; width: 384px;">
  <label>Tanggal Penerbitan KK <span style="color:red">*</span></label>
  <div class="input-group">
    <span class="input-group-addon"><i class="fa fa-calendar"></i> </span>
    <input 
      id="tanggal_berlaku_kk" 
      disabled 
      name="tanggal_berlaku_kk" 
      type="text" 
      class="form-control" 
      autocomplete="off" 
      pattern="\d{1,2}-\d{1,2}-\d{4}"
      placeholder="hh-bb-tttt" 
      required 
      style="padding:0px 9px"
    >
  </div>
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
    rules: {
      tanggal_berlaku_kk:{
        dateAfter: true
      },
    },
    messages: {
      tanggal_berlaku_kk:{
        dateAfter: "* Tanggal penerbitan belum diganti"
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