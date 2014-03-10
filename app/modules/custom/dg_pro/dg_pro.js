drupalgap.demo = {
  mode: false, /* Demo mode boolean */
  site_path: 'http://localhost/demo.drupalgap.org'
};

/**
 * Implements hook_menu().
 */
function dg_pro_menu() {
  var items = {};
  items['dg_pro_welcome'] = {
    title: 'Welcome',
    page_callback: 'dg_pro_welcome_page',
  };
  items['dg_pro_setup'] = {
    title: 'Setup',
    page_callback: 'drupalgap_get_form',
    page_arguments: ['dg_pro_setup_form']
  };
  items['dg_pro_demo'] = {
    title: 'Setup',
    page_callback: 'dg_pro_demo_page',
  };
  items['dg_pro_dashboard'] = {
    title: 'Dashboard',
    page_callback: 'dg_pro_dashboard_page',
  };
  return items;
}

/**
 * Implements hook_mvc_model().
 */
function dg_pro_mvc_model() {
  var models = {
    site: {
      fields: {
        url: {
          type: 'text',
          title: 'URL',
          /*description: 'Enter the URL to your Drupal 7 site',*/
          required: true
        }
      }
    }
  };
  return models;
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
    else {
      // Not in demonstration mode...
      
      if (form_id == 'mvc_model_create_form') {
        form.prefix += '<p>Enter the URL to your Drupal 7 site.</p>';
        form.elements.submit.value = 'Add New Site';
        form.elements.submit.options.attributes['data-icon'] = 'plus';
        form.action = 'dg_pro_setup';
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

function dg_pro_setup_form(form, form_state) {
  try {
    form.elements.site = {
      title: 'Sites',
      type: 'select',
      required: true,
      options: []
    };
    var sites = collection_load('dg_pro', 'site');
    $.each(sites, function(index, site){
        form.elements.site.options[site.id] = site.url;
    });
    form.elements.submit = {
      type: 'submit',
      value: 'Connect',
      options: {
        attributes: {
          'data-icon': 'action',
          'data-iconpos': 'top'
        }
      }
    };
    form.suffix += 
    '<p>' +
      l('Add Another Site', 'mvc/item-add/dg_pro/site', { attributes: { 'data-icon': 'plus', 'data-role': 'button' } }) +
      l('Manage Sites', 'mvc/collection/list/dg_pro/site', { attributes: { 'data-icon': 'bars', 'data-role': 'button' } }) +
    '</p>';
    return form;
  }
  catch (error) { console.log('dg_pro_setup_form - ' + error); }
}

/*function dg_pro_setup_form_validate(form, form_state) {
  try {
  }
  catch (error) { console.log('dg_pro_setup_form_validate - ' + error); }
}*/

function dg_pro_setup_form_submit(form, form_state) {
  try {
    var site = item_load('dg_pro', 'site', form_state.values['site']);
    Drupal.settings.site_path = site.url;
    system_connect({
        success: function(result) {
          drupalgap_set_message('Connection successful, enjoy!');
          if (drupalgap.demo.site_path == site.url) {
            drupalgap.demo.mode = true;
          }
          drupalgap.settings.front = 'dg_pro_dashboard';  
          drupalgap_goto(drupalgap.settings.front);
        },
        error: function(xhr, status, message) {
          var msg = 'The connection to ' + site.url + ' has failed!\n\n' + message;
          drupalgap_alert(msg);
        }
    });
  }
  catch (error) { console.log('dg_pro_setup_form_submit - ' + error); }
}

/**
 *
 */
function drupalgap_demo_click() {
  try {
    // Fake a submission on the setup form.
    dg_pro_setup_form_submit(null, {
        values: {
          site_url: drupalgap.demo.site_path
        }
    });
  }
  catch (error) { console.log('drupalgap_demo - ' + error); }
}

/**
 *
 */
function dg_pro_welcome_page() {
  try {
    var content = {};
    content.header = {
      markup: '<div data-role="header"><h2>DrupalGap</h2></div>'
    };
    content.intro = {
      markup: '<div style="text-align: center;"><p>The Open Source Mobile App Development Kit for Drupal</p>' +
        theme('image', { path: 'themes/easystreet3/images/drupalgap.jpg'})
    };
    content.setup = {
      theme: 'button_link',
      text: 'Setup',
      options: {
        attributes: {
          'data-theme': 'b',
          'data-icon': 'gear',
          'data-iconpos': 'right',
          onclick: 'dg_pro_setup_button_click()'
        }
      }
    };
    content.demo = {
      theme: 'button_link',
      text: 'Try a demo',
      path: 'dg_pro_demo',
      options: {
        transition: 'slide'
      },
      attributes: {
        'data-icon': 'carat-r',
        'data-iconpos': 'right'
      }
    };
    return content;
  }
  catch (error) { console.log('dg_pro_welcome_page - ' + error); }
}

/**
 *
 */
function dg_pro_setup_button_click() {
  try {
    // If there aren't any sites added yet, send them directly to the add site
    // form, otherwise send them to the setup page.
    var sites = collection_load('dg_pro', 'site');
    if (sites.length == 0) {
      drupalgap_goto('mvc/item-add/dg_pro/site');
      return;
    }
    drupalgap_goto('dg_pro_setup');
    
  }
  catch (error) { console.log('dg_pro_setup_button_click - ' + error); }
}

/**
 *
 */
function dg_pro_demo_page() {
  try {
    var content = {};
    content.header = {
      markup: '<div data-role="header"><h2>demo.drupalgap.org</h2></div>'
    };
    content.intro = {
      markup: '<div style="text-align: center;">' +
        '<p>Try this demo Drupal 7 website, with DrupalGap.</p>' +
        theme('image', { path: 'themes/easystreet3/images/drupalgap.jpg'}) + '</div>'
    };
    content.connect = {
      theme: 'button_link',
      text: 'Connect',
      attributes: {
        onclick: 'drupalgap_demo_click()',
        'data-icon': 'action',
        'data-iconpos': 'top',
        'data-theme': 'b'
      }
    };
    return content;
  }
  catch (error) { console.log('dg_pro_demo_page - ' + error); }
}

/**
 *
 */
function dg_pro_dashboard_page() {
  try {
  }
  catch (error) { console.log('dg_pro_dashboard_page - ' + error); }
}



