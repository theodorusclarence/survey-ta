<div style="margin-bottom: 10px; margin-top: 10px;">
    <input id="agreement-read" disabled type="checkbox" name="agreement" required></input>
    <label for="agreement-read">Saya setuju</label>
</div>

<script type="text/javascript">
$( document ).ready( function () {
  const fancyBox2Trigger = () => {
      $('#sk-konfirmasi').form();
      if ($('#sk-konfirmasi').valid() == true) {
          $('#formulirAkhir').css('display', 'none');
          $('#fancyBoxBtn2').trigger('click');
      }
  }

  $('#sk-konfirmasi').validate({
      message: {
          agreement: "Anda harus mencentang sebelum melanjutkan."
          
      },
      errorPlacement: function(error, element) {
          error.appendTo( $('#errorContainerSK1') );
      }
  });
});
</script> 