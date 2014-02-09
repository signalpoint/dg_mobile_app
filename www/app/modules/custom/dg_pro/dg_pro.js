drupalgap.demo = {
  mode: false, /* Demo mode boolean */
  site_path: 'http://localhost/drupal-7.23'
};

/**
 * Implements hook_menu().
 */
function dg_pro_menu() {
  var items = {};
  items['dg_pro_welcome'] = {
    title: 'DrupalGap',
    page_callback: 'dg_pro_welcome_page',
  };
  items['dg_pro_setup'] = {
    title: 'Setup',
    page_callback: 'drupalgap_get_form',
    page_arguments: ['drupalgap_setup_form']
  };
  return items;
}

/**
 *
 */
function dg_pro_welcome_page() {
  try {
    var content = {};
    content.setup = {
      theme: 'button_link',
      text: 'Setup',
      path: 'dg_pro_setup',
      options: {
        attributes: {
          'data-theme': 'b'
        }
      }
    };
    content.demo = {
      theme: 'button_link',
      text: 'Try a demo',
      attributes: {
        onclick: 'drupalgap_demo()'
      }
    };
    return content;
  }
  catch (error) { console.log('dg_pro_welcome_page - ' + error); }
}

function drupalgap_setup_form(form, form_state) {
  try {
    form.prefix = '<p>Enter the URL to your Drupal site.</p>';
    form.elements.site_url = {
      type: 'textfield',
      title: 'Site URL',
      required: true,
      default_value: drupalgap.demo.site_path
    };
    form.elements.submit = {
      type: 'submit',
      value: 'Connect'
    };
    return form;
  }
  catch (error) { console.log('drupalgap_setup_form - ' + error); }
}

/*function drupalgap_setup_form_validate(form, form_state) {
  try {
  }
  catch (error) { console.log('drupalgap_setup_form_validate - ' + error); }
}*/

function drupalgap_setup_form_submit(form, form_state) {
  try {
    var site_url = form_state.values['site_url'];
    Drupal.settings.site_path = site_url;
    system_connect({
        success: function(result) {
          drupalgap_set_message('Connection successful, enjoy!');
          if (drupalgap.demo.site_path == site_url) {
            drupalgap.demo.mode = true;
          }
          drupalgap.settings.front = 'dashboard';  
          drupalgap_goto(drupalgap.settings.front);
        },
        error: function(xhr, status, message) {
          var msg = 'The connection to ' + site_url + ' has failed!';
          alert(msg);
        }
    });
  }
  catch (error) { console.log('drupalgap_setup_form_submit - ' + error); }
}

/**
 *
 */
function drupalgap_demo() {
  try {
    // Fake a submission on the setup form.
    drupalgap_setup_form_submit(null, {
        values: {
          site_url: drupalgap.demo.site_path
        }
    });
  }
  catch (error) { console.log('drupalgap_demo - ' + error); }
}

/**
 * Implements hook_form_alter().
 */
function dg_pro_form_alter(form, form_state, form_id) {
  try {
    if (drupalgap.demo.mode) {
      if (form_id == 'user_login_form') {
        form.elements.name.default_value = 'demo';
        form.elements.pass.default_value = 'd3m0drup41g4p';
      }
    }
  }
  catch (error) { console.log('dg_pro_form_alter - ' + error); }
}

/**
 * Implements hook_services_postprocess().
 */
function dg_pro_services_postprocess(options, result) {
  try {
    if (options.service == 'user' && options.resource == 'logout') {
      drupalgap.settings.front = 'dg_pro_welcome';
    }
  }
  catch (error) { console.log('dg_pro_services_postprocess - ' + error); }
}

