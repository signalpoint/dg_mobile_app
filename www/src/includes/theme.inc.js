/**
 * Each time we use drupalgap_goto to change a page, this function is called on
 * the pagebeforehange event. If we're not moving backwards, or navigating to
 * the same page, this will preproccesses the page, then processes it.
 */
$(document).on('pagebeforechange', function(e, data) {
    try {
      // If we're moving backwards, reset drupalgap.back and return.
      if (drupalgap && drupalgap.back) {
        drupalgap.back = false;
        return;
      }
      // If the jqm active page url is the same as the page id of the current
      // path, return.
      if (
        drupalgap_jqm_active_page_url() ==
        drupalgap_get_page_id(drupalgap_path_get())
      ) { return; }
      // We only want to process the page we are going to, not the page we are
      // coming from. When data.toPage is a string that is our destination page.
      if (typeof data.toPage === 'string') {

        // If drupalgap_goto() determined that it is necessary to prevent the
        // default page from reloading, then we'll skip the page
        // processing and reset the prevention boolean.
        if (drupalgap && !drupalgap.page.process) {
          drupalgap.page.process = true;
        }
        else if (drupalgap) {
          // Pre process, then process the page.
          template_preprocess_page(drupalgap.page.variables);
          template_process_page(drupalgap.page.variables);
          if (drupalgap.settings.debug) {
            console.log('pagebeforechange() - processed');
          }
        }
      }
    }
    catch (error) { console.log('pagebeforechange - ' + error); }
});

/**
 * Returns the path to the current DrupalGap theme, false otherwise.
 * @return {String|Boolean}
 */
function path_to_theme() {
  try {
    if (drupalgap.theme_path) {
      return drupalgap.theme_path;
    }
    else {
      console.log('path_to_theme - drupalgap.theme_path is not set!');
      return false;
    }
  }
  catch (error) { console.log('path_to_theme - ' + error); }
}

/**
 * Implementation of theme().
 * @param {String} hook
 * @param {Object} variables
 * @return {String}
 */
function theme(hook, variables) {
  try {

    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (!variables) { variables = {}; }
    if (variables.markup) { return variables.markup; }
    var content = '';

    // First see if the current theme implements the hook, if it does use it, if
    // it doesn't fallback to the core theme implementation of the hook.
    var theme_function = drupalgap.settings.theme + '_' + hook;
    if (!function_exists(theme_function)) {
      theme_function = 'theme_' + hook;
      if (!function_exists(theme_function)) {
        console.log('WARNING: ' + theme_function + '() does not exist');
        return content;
      }
    }

    // If no attributes are coming in, look to variables.options.attributes
    // as a secondary option, otherwise setup an empty JSON object for them.
    if (
      typeof variables.attributes === 'undefined' ||
      !variables.attributes
    ) {
      if (variables.options && variables.options.attributes) {
        variables.attributes = variables.options.attributes;
      }
      else {
        variables.attributes = {};
      }
    }
    // If there is no class name, set an empty one.
    if (!variables.attributes.class) {
      variables.attributes.class = '';
    }
    var fn = window[theme_function];
    content = fn.call(null, variables);
    return content;
  }
  catch (error) { console.log('theme - ' + error); }
}

/**
 * Themes a button.
 * @param {Object} variables
 * @return {String}
 */
function theme_button(variables) {
  try {
    variables.attributes['data-role'] = 'button';
    var html = '<a ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.text +
    '</a>';
    return html;
  }
  catch (error) { console.log('theme_button_link - ' + error); }
}

/**
 * Themes a button link.
 * @param {Object} variables
 * @return {String}
 */
function theme_button_link(variables) {
  try {
    variables.attributes['data-role'] = 'button';
    return theme_link(variables);
  }
  catch (error) { console.log('theme_button_link - ' + error); }
}


/**
 * Implementation of theme_image().
 * @param {Object} variables
 * @return {String}
 */
function theme_image(variables) {
  try {
    // Turn the path, alt and title into attributes if they are present.
    if (variables.path) { variables.attributes.src = variables.path; }
    if (variables.alt) { variables.attributes.alt = variables.alt; }
    if (variables.title) { variables.attributes.title = variables.title; }
    // Make sure the image width doesn't exceed the device's width.
    if (!variables.attributes.style) { variables.attributes.style = ''; }
    variables.attributes.style +=
      ' max-width: ' + drupalgap_max_width() + 'px; ';
    // Render the image.
    return '<img ' + drupalgap_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_image - ' + error); }
}

/**
 * Implementation of theme_image_style().
 * @param {Object} variables
 * @return {String}
 */
function theme_image_style(variables) {
  try {
    variables.path = image_style_url(variables.style_name, variables.path);
    return theme_image(variables);
  }
  catch (error) { console.log('theme_image - ' + error); }
}

/**
 * Theme's an item from an MVC collection.
 * @param {Object} variables
 * @return {String}
 */
function theme_item(variables) {
  try {
    var html = '';
    //var mvc_model_system_fields
    $.each(variables.item, function(field, value) {
        html +=
          '<h2>' + variables.model.fields[field].title + '</h2>' +
          '<p>' + value + '</p>';
    });
    return html;
  }
  catch (error) { console.log('theme_item - ' + error); }

}

/**
 * Implementation of theme_item_list().
 * @param {Object} variables
 * @return {String}
 */
function theme_item_list(variables) {
  try {
    // We'll theme an empty list unordered list by default, if there is a type
    // of list specified we'll use that, and if there are some items we'll
    // theme them too.
    var type = 'ul';
    if (variables.type) { type = variables.type; }
    var html = '<' + type + ' ' +
      drupalgap_attributes(variables.attributes) + '>';
    if (variables.items && variables.items.length > 0) {
      $.each(variables.items, function(index, item) {
          html += '<li>' + item + '</li>';
      });
    }
    html += '</' + type + '>';
    return html;
  }
  catch (error) { console.log('theme_item_list - ' + error); }
}

/**
 * Identical to theme_item_list, except this turns the list into a jQM listview.
 * @param {Object} variables
 * @return {String}
 */
function theme_jqm_item_list(variables) {
  try {
    if (variables.attributes) {
      if (
        variables.attributes['data-role'] &&
        variables.attributes['data-role'] != 'listview'
      ) { }
      else {
        variables.attributes['data-role'] = 'listview';
      }
    }
    else {
      variables.attributes['data-role'] = 'listview';
    }
    return theme_item_list(variables);
  }
  catch (error) { console.log('theme_jqm_item_list - ' + error); }
}

/**
 * Implementation of theme_link().
 * @param {Object} variables
 * @return {String}
 */
function theme_link(variables) {
  try {
    var text = '';
    if (variables.text) { text = variables.text; }
    if (typeof variables.path !== 'undefined' && variables.path != null) {
      // By default our onclick will use a drupalgap_goto(). If we have any
      // incoming link options, then modify the link accordingly.
      var onclick = 'drupalgap_goto(\'' + variables.path + '\');';
      if (variables.options) {
        // Use an InAppBrowser?
        if (variables.options.InAppBrowser) {
          onclick =
            "window.open('" + variables.path + "', '_blank', 'location=yes');";
        }
        else {
          // All other options need to be extracted into a JSON string for the
          // onclick handler.
          var goto_options = '';
          $.each(variables.options, function(option, value) {
              if (option == 'attributes') { return; }
              if (typeof value === 'string') { value = "'" + value + "'"; }
              goto_options += option + ':' + value + ',';
          });
          onclick =
            'drupalgap_goto(\'' +
              variables.path + '\', ' +
              '{' + goto_options + '});';
        }
      }
      return '<a href="#" onclick="javascript:' + onclick + '"' +
        drupalgap_attributes(variables.attributes) + '>' + text + '</a>';
    }
    else {
      // The link has no path, so just render the text and attributes.
      return '<a href="#" ' + drupalgap_attributes(variables.attributes) + '>' +
        text +
      '</a>';
    }
  }
  catch (error) { console.log('theme_link - ' + error); }
}

/**
 * Implementation of theme_submit().
 * @param {Object} variables
 * @return {String}
 */
function theme_submit(variables) {
  try {
    return '<button ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.element.value +
    '</button>';
  }
  catch (error) { console.log('theme_submit - ' + error); }
}

/**
 * Implementation of theme_table().
 * @param {Object} variables
 * @return {String}
 */
function theme_table(variables) {
  try {
    var html = '<table ' + drupalgap_attributes(variables.attributes) + '>';
    if (variables.header) {
      html += '<tr>';
      $.each(variables.header, function(index, column) {
          if (column.data) {
            html += '<th>' + column.data + '</th>';
          }
      });
      html += '</tr>';
    }
    if (variables.rows) {
      $.each(variables.rows, function(row_index, row) {
          html += '<tr>';
          if (row) {
            $.each(row, function(column_index, column) {
                html += '<td>' + column + '</td>';
            });
          }
          html += '</tr>';
      });
    }
    return html + '</table>';
  }
  catch (error) { console.log('theme_table - ' + error); }
}

/**
 * Implementation of template_preprocess_page().
 * @param {Object} variables
 */
function template_preprocess_page(variables) {
  try {
    // Set up default attribute's for the page's div container.
    if (typeof variables.attributes === 'undefined') {
      variables.attributes = {};
    }

    // @todo - is this needed?
    variables.attributes['data-role'] = 'page';

    // Call all hook_preprocess_page functions.
    module_invoke_all('preprocess_page');

    // Place the variables into drupalgap.page
    drupalgap.page.variables = variables;
  }
  catch (error) { console.log('template_preprocess_page - ' + error); }
}

/**
 * Implementation of template_process_page().
 * @param {Object} variables
 */
function template_process_page(variables) {
  try {
    var drupalgap_path = drupalgap_path_get();
    // Execute the active menu handler to assemble the page output. We need to
    // do this before we render the regions below.
    drupalgap.output = menu_execute_active_handler();
    // For each region, render it, then replace the placeholder in the page's
    // html with the rendered region.
    var page_id = drupalgap_get_page_id(drupalgap_path);
    $.each(drupalgap.theme.regions, function(index, region) {
        var page_html = $('#' + page_id).html();
        eval(
          'page_html = page_html.replace(/{:' + region.name + ':}/g,' +
          'drupalgap_render_region(region));'
        );
        $('#' + page_id).html(page_html);
    });
  }
  catch (error) { console.log('template_process_page - ' + error); }
}

