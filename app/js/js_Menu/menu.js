$(function(){

    let header = document.getElementById('header');
    let headroom =  new Headroom(header);
    headroom.init();

    //Menu Responsive
    //Calculamos el ancho de la pagina
    let ancho = $(window).width(),
        enlaces = $('#enlaces'),
        btnMenu = $('#btn-menu'),
        icono = $('#btn-menu .icono');

        if (ancho < 700){
           enlaces.hide();
           icono.addClass('fa-bars');   
        }

        btnMenu.on('click', function(e){
                enlaces.slideToggle();
                icono.toggleClass('fa-bars');
                icono.toggleClass('fa-times');
                
        });

        $(window).on('resize', function(){
            if($(this).width() > 700){
                enlaces.show();
                icono.addClass('fa-times');
                icono.removeClass('fa-bars');
            } else {
                enlaces.hide();
                icono.addClass('fa-bars');
                icono.removeClass('fa-times');
            }
        });


});