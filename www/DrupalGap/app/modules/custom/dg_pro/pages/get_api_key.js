$('#dg_pro_page_get_api_key').on('pagebeforeshow', function(){
    $('#get_api_key_site_path').html(dg_pro.settings.site_path);
});

$('#get_new_key').on('click', function(){
    drupalgap_changePage('user_register.html');
});

$('#use_existing_key').on('click', function(){
    drupalgap_changePage('user_login.html');
});

