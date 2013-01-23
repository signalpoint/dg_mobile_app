// When the site url text field is clicked.
$('#setup_site_url').on('click',function(){
  // Remove 'drupalgap.org' from the text field for quick-n-easy user experience
  if ($('#setup_site_url').val() == "http://www.drupalgap.com") {
    $('#setup_site_url').val("http://www.");
  }
});

$('#setup_connect').on('click',function(){
  try {
    // Grab input url and validate.
    // TODO - better validation here
    var url = $('#setup_site_url').val();
    if (!url) {
      navigator.notification.alert(
        'Enter your Drupal site URL.',
        function(){ },
        'Invalid Site URL',
        'OK'
      );
      return false;
    }
    
    // Save the site path the user is trying to connect to.
    dg_pro.settings.site_path = url;
    
    // Ask ES3 if this user has an API key?
    drupalgap.services.system.connect.call({
      'site_path':'http://www.easystreet3.com',
      'endpoint':'es3',
      'success':function(result){
        // If the user is anonymous at ES3.
        if (drupalgap.user.uid == 0) {
          // Tell them they need an api key.
          navigator.notification.alert(
            'You need an API Key to connect!',
            function(){
              drupalgap_changePage(drupalgap_get_path('module', 'dg_pro') + '/pages/get_api_key.html');
            },
            'API Key Needed',
            'Get API Key'
          );
        }
      },
    });
  }
  catch (error) {
    alert("setup_connect - " + error);
  }
  return false;
});

$('#setup_help').on('click',function(){
  navigator.notification.alert(
      'Please visit the DrupalGap website for help topics.',
      function(){ },
      'www.drupalgap.com',
      'OK'
  );
  return false;
});

