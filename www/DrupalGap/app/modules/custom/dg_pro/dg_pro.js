var dg_pro = {
  'settings':{
		'site_path':'http://dev.drupalgap.com',
	}
};
/**
 * Implements hook_device_online().
 */
function dg_pro_device_online() {
  // Set the front page to the welcome page.
  //drupalgap.settings.front = drupalgap_get_path('module', 'dg_pro') + '/pages/welcome.html';
  drupalgap.settings.front = 'user_register.html';
}

/**
 * Implements hook_form_alter().
 */
function dg_pro_form_alter(form, form_state, form_id) {
  try {
    console.log(JSON.stringify(form));
    //console.log(JSON.stringify(form_state));
    //console.log(form_id);
    if (form_id == 'user_register') {
      form.elements.name.title = 'El Nombre';
      form.elements.name.required = false;
    }
  }
  catch (error) {
    alert('dg_pro_form_alter - ' + error);
  }
}

