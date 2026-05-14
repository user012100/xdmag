(function($) {
  window.fnames = new Array();
  window.ftypes = new Array();
  fnames[0] = 'EMAIL'; ftypes[0] = 'email';
  fnames[1] = 'FNAME'; ftypes[1] = 'text';
  fnames[2] = 'LNAME'; ftypes[2] = 'text';
  fnames[3] = 'ADDRESS'; ftypes[3] = 'address';
  fnames[4] = 'PHONE'; ftypes[4] = 'phone';
  fnames[5] = 'BIRTHDAY'; ftypes[5] = 'birthday';
  fnames[6] = 'COMPANY'; ftypes[6] = 'text';
}(jQuery));
var $mcj = jQuery.noConflict(true);

document.getElementById('mc-embedded-subscribe-form').addEventListener('submit', function() {
  document.getElementById('mc_embed_signup').style.display = 'none';
  document.getElementById('thank-you-message').style.display = 'block';
  setTimeout(function() {
    window.location.href = '/';
  }, 3000);
});
