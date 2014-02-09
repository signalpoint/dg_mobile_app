/**
 * Implements hook_block_info().
 * @return {Object}
 */
function system_block_info() {
  try {
    // System blocks.
    var blocks = {
      'main': {
        'delta': 'main',
        'module': 'system'
      },
      messages: {
        delta: 'messages',
        module: 'system'
      },
      'logo': {
        'delta': 'logo',
        'module': 'system'
      },
      'title': {
        'delta': 'title',
        'module': 'system'
      },
      'powered_by': {
        'delta': 'powered_by',
        'module': 'system'
      },
      'help': {
        'delta': 'help',
        'module': 'system'
      }
    };
    // Make additional blocks for each system menu.
    var system_menus = menu_list_system_menus();
    $.each(system_menus, function(menu_name, menu) {
        var block_delta = menu.menu_name;
        eval(
          'blocks.' + block_delta + ' = ' +
            '{"name":"' + block_delta + '", "delta":"' + block_delta + '", ' +
            '"module":"menu"};'
        );
    });
    return blocks;
  }
  catch (error) { console.log('system_block_info - ' + error); }
}

/**
 * Implements hook_block_view().
 * @param {String} delta
 * @return {String}
 */
function system_block_view(delta) {
  try {
    switch (delta) {
      case 'main':
        // This is the main content block, it is required to be in a theme's
        // region for the content of a page to show up (nodes, users, taxonomy,
        // comments, etc). Depending on the menu link router, we need to route
        // this through the appropriate template files and functions.
        return drupalgap_render_page();
        break;
      case 'messages':
        // If there are any messages waiting to be displayed, render them, then
        // clear out the messages array.
        var html = '';
        if (drupalgap.messages.length == 0) { return html; }
        $.each(drupalgap.messages, function(index, msg) {
            html += '<div class="messages ' + msg.type + '">' +
              msg.message +
            '</div>';
        });
        drupalgap.messages = [];
        return html;
        break;
      case 'logo':
        if (drupalgap.settings.logo) {
          return '<div>' +
            l(theme('image', {'path': drupalgap.settings.logo}), '') +
          '</div>';
        }
        return '';
        break;
      case 'title':
        var title_id = system_title_block_id(drupalgap_path_get());
        return '<h1 id="' + title_id + '"></h1>';
        break;
      case 'powered_by':
        return '<p style="text-align: center;">Powered by: ' +
          l('DrupalGap', 'http://www.drupalgap.org', {InAppBrowser: true}) +
        '</p>';
        break;
      case 'help':
        return l('Help', 'http://www.drupalgap.org/support');
        break;
      default:
        return '';
        break;
    }
  }
  catch (error) { console.log('system_block_info - ' + error); }
}

/**
 * Implements hook_menu().
 * @return {Object}
 */
function system_menu() {
  try {
    var items = {
      'dashboard': {
        'title': 'Dashboard',
        'page_callback': 'system_dashboard_page'
      },
      'error': {
        'title': 'Error',
        'page_callback': 'system_error_page'
      },
      'offline': {
        'title': 'Offline',
        'page_callback': 'system_offline_page'
      },
      '401': {
        title: '401 - Not Authorized',
        page_callback: 'system_401_page'
      },
      '404': {
        title: '404 - Not Found',
        page_callback: 'system_404_page'
      }
    };
    return items;
  }
  catch (error) { console.log('system_menu - ' + error); }
}

/**
 * Page callback for the 401 page.
 * @param {String} path
 * @return {String}
 */
function system_401_page(path) {
  try { return 'Sorry, you are not authorized to view this page.'; }
  catch (error) { console.log('system_401_page - ' + error); }
}

/**
 * Page callback for the 404 page.
 * @param {String} path
 * @return {String}
 */
function system_404_page(path) {
  try { return 'Sorry, the page you requested was not found.'; }
  catch (error) { console.log('system_404_page - ' + error); }
}

/**
 * Page callback for the dashboard page.
 * @return {Object}
 */
function system_dashboard_page() {
  try {
    var content = {};
    content.site_info = {
      markup: '<h4 style="text-align: center;">' +
        Drupal.settings.site_path +
      '</h4>'
    };
    content.welcome = {
      markup: '<h2 style="text-align: center;">Welcome to DrupalGap</h2>' +
        '<p>The open source mobile application development kit for Drupal!</p>'
    };
    if (drupalgap.settings.logo) {
      content.logo = {
        markup: '<center>' +
                 theme('image', {path: drupalgap.settings.logo}) +
               '</center>'
      };
    }
    content.get_started = {
      theme: 'button_link',
      text: 'Getting Started Guide',
      path: 'http://www.drupalgap.org/get-started',
      options: {InAppBrowser: true}
    };
    content.support = {
      theme: 'button_link',
      text: 'Support',
      path: 'http://www.drupalgap.org/support',
      options: {InAppBrowser: true}
    };
    return content;
  }
  catch (error) { console.log('system_dashboard_page - ' + error); }
}

/**
 * The page callback for the error page.
 * @return {Object}
 */
function system_error_page() {
  try {
    var content = {
      info: {
        markup: '<p>An unexpected error has occurred! Review console.log() ' +
               'messages for more information!</p>'
      }
    };
    return content;
  }
  catch (error) { console.log('system_error_page - ' + error); }
}

/**
 * Call back for the offline page.
 * @return {Object}
 */
function system_offline_page() {
  try {
    var content = {
      'message': {
        'markup': '<h2>Failed Connection</h2>' +
          "<p>Oops! We couldn't connect to:</p>" +
          '<p>' + Drupal.settings.site_path + '</p>'
      },
      'try_again': {
        'theme': 'button',
        'text': 'Try Again',
        'attributes': {
          'onclick': 'javascript:offline_try_again();'
        }
      },
      'footer': {
        'markup': "<p>Check your device's network settings and try again.</p>"
      }
    };
    return content;
  }
  catch (error) { console.log('system_offline_page - ' + error); }
}

/**
 * When the 'try again' button is clicked, check for a connection and if it has
 * one make a call to system connect then go to the front page, otherwise just
 * inform user the device is still offline.
 * @return {*}
 */
function offline_try_again() {
  try {
    var connection = drupalgap_check_connection();
    if (drupalgap.online) {
      system_connect({
        success: function() {
          drupalgap_goto('');
        }
      });
    }
    else {
      navigator.notification.alert(
          'Sorry, no connection found! (' + connection + ')',
          function() { },
          'Offline',
          'OK'
      );
      return false;
    }
  }
  catch (error) { console.log('offline_try_again - ' + error); }
}

/**
 * Returns an array of region names defined by the system that themes must use.
 * We do this so Core and Contrib Modules can use these regions for UI needs.
 * @return {Array}
 */
function system_regions_list() {
  try {
    var regions = ['header', 'content', 'footer'];
    return regions;
  }
  catch (error) { console.log('system_regions_list - ' + error); }
}

/**
 * Add default buttons to a form and set its prefix.
 * @param {Object} form
 * @param {Object} form_state
 * @return {Object}
 */
function system_settings_form(form, form_state) {
  try {
    // Add submit button to form if one isn't present.
    if (!form.elements.submit) {
      form.elements.submit = {
        type: 'submit',
        value: 'Save configuration'
      };
    }
    // Add cancel button to form if one isn't present.
    if (!form.buttons.cancel) {
      form.buttons['cancel'] = drupalgap_form_cancel_button();
    }
    // Attach submit handler.
    form.submit.push('system_settings_form_submit');
    return form;
  }
  catch (error) { console.log('system_settings_form - ' + error); }
}

/**
 * Execute the system_settings_form.
 * @param {Object} form
 * @param {Object} form_state
 */
function system_settings_form_submit(form, form_state) {
  try {
    if (form_state.values) {
      $.each(form_state.values, function(variable, value) {
          variable_set(variable, value);
      });
    }
    // @todo - a nice spot to have a drupal_set_message function, eh?
    alert('The configuration options have been saved.');
  }
  catch (error) { console.log('system_settings_form_submit - ' + error); }
}

/**
 * Returns the block id used on the system's title block.
 * @param {String} path
 * @return {String}
 */
function system_title_block_id(path) {
  try {
    var id = 'drupalgap_page_title_' + drupalgap_get_page_id(path);
    return id;
  }
  catch (error) { console.log('system_title_block_id - ' + error); }
}

