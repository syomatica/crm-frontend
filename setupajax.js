var errore = false;
$.ajaxSetup({
    //cache : false,
    //dataType: "json",
    //contentType:"application/json; charset=UTF-8",
    beforeSend: function (xhr,settings){
        if(settings.url.indexOf("secure") >= 0 || settings.url.indexOf("file/") >= 0){
            //xhr.setRequestHeader('token', sessionStorage.getItem('token'));
            xhr.setRequestHeader('Authorization', 'Bearer '+ sessionStorage.getItem('token'));
            //headers = headers.set('Authorization', 'Bearer '+ sessionStorage.getItem("authToken"));
        } 
    },
    error : function(jqXHR, textStatus, errorThrown) {
        var code = jqXHR.status;
        if ( code == 404 || code == 500 || code == 400) {
            errore = true;
            swal({
                title : '',
                type : 'error',
                text : 'Errore interno del server',
                allowEscapeKey : false,
                allowOutsideClick : false,
            }); 
        } else if(code == 401 || code == 0){
            swal({
                title : '',
                type : 'error',
                text : 'Sessione scaduta',
                allowEscapeKey : false,
                allowOutsideClick : false,
                confirmButtonText: "LOGIN"
            },function(){
                window.location.replace('/');
            });
            
        }
    }
});

$('.navbar-nav a').on('click',function(e){
    //Logout
    e.preventDefault();
    sessionStorage.removeItem('token');
    window.location.replace('/index.html');

    /*
    $.ajax({
        url: server+'auth/logout',
        type: 'GET',
        dataType: "json",
        beforeSend: function (request){
            request.setRequestHeader("token", sessionStorage.getItem('token'));
        }
    }).done(function(){
        window.location.replace('/index.html');
    });
    */
});
