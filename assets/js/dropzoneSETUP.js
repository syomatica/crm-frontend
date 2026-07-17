$('#depliantIT').attr('action',server+'secure/prodotti/uploadDepliantIT');
$('#depliantEN').attr('action',server+'secure/prodotti/uploadDepliantEN');
$('#depliantFR').attr('action',server+'secure/prodotti/uploadDepliantFR');
$('#depliantSP').attr('action',server+'secure/prodotti/uploadDepliantSP');
$('#depliantAR').attr('action',server+'secure/prodotti/uploadDepliantAR');

Dropzone.options.depliantIT = {
    paramName: "file",
    maxFiles: 1,
    maxFilesize: 20,
    headers: {"token":sessionStorage.getItem('token')},
    acceptedFiles: 'application/pdf',
    accept: function(file, done) {
        done();
    },
    init: function() {
        this.on("sending", function(file, xhr, formData){
            formData.append("id", $('#idProdotto').text());
        });

        this.on("maxfilesexceeded",function(file){
            swal({
                title : 'Errore',
                type : 'warning',
                text : 'Hai già caricato il depliant per questa lingua.',
                allowEscapeKey : false,
                allowOutsideClick : false,
            });
        });

        this.on("error", function(response){
            if(response.xhr){
                if(JSON.parse(response.xhr.response).ERROR=='File già esistente'){
                    swal({
                        title : 'Errore',
                        type : 'error',
                        text : 'Il file "'+response.name+'" esiste già. Non sarà caricato.',
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    });  
                    this.removeAllFiles(true);
                }else{
                    swal({
                        title : 'Errore',
                        type : 'error',
                        text : JSON.parse(response.xhr.response).ERROR,
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    }); 
                    this.removeAllFiles(true);
                }
            }else if(response.size>20971520){
                swal({
                    title : 'Errore',
                    type : 'warning',
                    text : 'Dimenzione massima: 20 MB',
                    allowEscapeKey : false,
                    allowOutsideClick : false,
                });
                this.removeAllFiles(true);
            }
        });
    }
};

Dropzone.options.depliantEN = {
    paramName: "file",
    maxFiles: 1,
    maxFilesize: 20,
    headers: {"token":sessionStorage.getItem('token')},
    acceptedFiles: 'application/pdf',
    accept: function(file, done) {
        done();
    },
    init: function() {
        this.on("sending", function(file, xhr, formData){
            formData.append("id", $('#idProdotto').text());
        });

        this.on("maxfilesexceeded",function(file){
            swal({
                title : 'Errore',
                type : 'warning',
                text : 'Hai già caricato il depliant per questa lingua.',
                allowEscapeKey : false,
                allowOutsideClick : false,
            });
            this.removeAllFiles(true);
        });

        this.on("error", function(response){

            console.log(response);
            if(response.xhr){
                if(JSON.parse(response.xhr.response).ERROR=='File già esistente'){
                    swal({
                        title : 'Errore',
                        type : 'warning',
                        text : 'Il file "'+response.name+'" esiste già. Non sarà caricato.',
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    });   
                }else{
                    swal({
                        title : 'Errore',
                        type : 'warning',
                        text : JSON.parse(response.xhr.response).ERROR,
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    }); 
                }
            }else if(response.size>20971520){
                swal({
                    title : 'Errore',
                    type : 'warning',
                    text : 'Dimenzione massima: 20 MB',
                    allowEscapeKey : false,
                    allowOutsideClick : false,
                });
            }
            this.removeAllFiles(true);
        });
    }
};
Dropzone.options.depliantFR = {
    paramName: "file",
    maxFiles: 1,
    maxFilesize: 20,
    headers: {"token":sessionStorage.getItem('token')},
    acceptedFiles: 'application/pdf',
    accept: function(file, done) {
        done();
    },
    init: function() {
        this.on("sending", function(file, xhr, formData){
            formData.append("id", $('#idProdotto').text());
        });

        this.on("maxfilesexceeded",function(file){
            swal({
                title : 'Errore',
                type : 'warning',
                text : 'Hai già caricato il depliant per questa lingua.',
                allowEscapeKey : false,
                allowOutsideClick : false,
            });
            this.removeAllFiles(true);
        });

        this.on("error", function(response){

            console.log(response);
            if(response.xhr){
                if(JSON.parse(response.xhr.response).ERROR=='File già esistente'){
                    swal({
                        title : 'Errore',
                        type : 'warning',
                        text : 'Il file "'+response.name+'" esiste già. Non sarà caricato.',
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    });   
                }else{
                    swal({
                        title : 'Errore',
                        type : 'warning',
                        text : JSON.parse(response.xhr.response).ERROR,
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    }); 
                }
            }else if(response.size>20971520){
                swal({
                    title : 'Errore',
                    type : 'warning',
                    text : 'Dimenzione massima: 20 MB',
                    allowEscapeKey : false,
                    allowOutsideClick : false,
                });
            }
            this.removeAllFiles(true);
        });
    }
};
Dropzone.options.depliantSP = {
    paramName: "file",
    maxFiles: 1,
    maxFilesize: 20,
    headers: {"token":sessionStorage.getItem('token')},
    acceptedFiles: 'application/pdf',
    accept: function(file, done) {
        done();
    },
    init: function() {
        this.on("sending", function(file, xhr, formData){
            formData.append("id", $('#idProdotto').text());
        });

        this.on("maxfilesexceeded",function(file){
            swal({
                title : 'Errore',
                type : 'warning',
                text : 'Hai già caricato il depliant per questa lingua.',
                allowEscapeKey : false,
                allowOutsideClick : false,
            });
            this.removeAllFiles(true);
        });

        this.on("error", function(response){

            console.log(response);
            if(response.xhr){
                if(JSON.parse(response.xhr.response).ERROR=='File già esistente'){
                    swal({
                        title : 'Errore',
                        type : 'warning',
                        text : 'Il file "'+response.name+'" esiste già. Non sarà caricato.',
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    });   
                }else{
                    swal({
                        title : 'Errore',
                        type : 'warning',
                        text : JSON.parse(response.xhr.response).ERROR,
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    }); 
                }
            }else if(response.size>20971520){
                swal({
                    title : 'Errore',
                    type : 'warning',
                    text : 'Dimenzione massima: 20 MB',
                    allowEscapeKey : false,
                    allowOutsideClick : false,
                });
            }
            this.removeAllFiles(true);
        });
    }
};
Dropzone.options.depliantAR = {
    paramName: "file",
    maxFiles: 1,
    maxFilesize: 20,
    headers: {"token":sessionStorage.getItem('token')},
    acceptedFiles: 'application/pdf',
    accept: function(file, done) {
        done();
    },
    init: function() {
        this.on("sending", function(file, xhr, formData){
            formData.append("id", $('#idProdotto').text());
        });

        this.on("maxfilesexceeded",function(file){
            swal({
                title : 'Errore',
                type : 'warning',
                text : 'Hai già caricato il depliant per questa lingua.',
                allowEscapeKey : false,
                allowOutsideClick : false,
            });
            this.removeAllFiles(true);
        });

        this.on("error", function(response){

            console.log(response);
            if(response.xhr){
                if(JSON.parse(response.xhr.response).ERROR=='File già esistente'){
                    swal({
                        title : 'Errore',
                        type : 'warning',
                        text : 'Il file "'+response.name+'" esiste già. Non sarà caricato.',
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    });   
                }else{
                    swal({
                        title : 'Errore',
                        type : 'warning',
                        text : JSON.parse(response.xhr.response).ERROR,
                        allowEscapeKey : false,
                        allowOutsideClick : false,
                    }); 
                }
            }else if(response.size>20971520){
                swal({
                    title : 'Errore',
                    type : 'warning',
                    text : 'Dimenzione massima: 20 MB',
                    allowEscapeKey : false,
                    allowOutsideClick : false,
                });
            }
            this.removeAllFiles(true);
        });
    }
};