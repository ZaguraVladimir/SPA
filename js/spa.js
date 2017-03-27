/*
spa.css
Модуль корневого пространства имен
*/

// Используем паттерн модуля из главы 2 для создания пространства имен spa. Этот модуль экспортирует единственный метод initModule , который инициализирует приложение.
var spa = (function () {
    var initModule = function ($container) {
        spa.shell.initModule($container);
    };
    return { initModule: initModule };
}());