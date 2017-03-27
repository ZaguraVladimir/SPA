/*
spa.css
Модуль корневого пространства имен
*/

/*jslint
    browser: true, continue: true,  
    devel:   true, indent:   2,     maxerr:   50,
    newcap:  true, nomen:    true,  plusplus: true,
    regexp:  true, sloppy:   true,  vars:     false,
    white:   true
*/

// Сообщаем JSLint, что глобальные переменные spa и $ ожидаемы. Поймав себя на добавлении еще каких-то собственных переменных в этот список после spa, задумайтесь, а то ли вы делаете.
/*global $, spa */


// Используем паттерн модуля из главы 2 для создания пространства имен spa. Этот модуль экспортирует единственный метод initModule , который инициализирует приложение.
var spa = (function () {
 var initModule = function ( $container ) {
  $container.html('<h1 style="display:inline-block; margin:50px;">hello world!</h1>');
 };
 return { initModule: initModule };
}());