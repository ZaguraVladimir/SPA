//Включаем параметры JSLint.Мы пользуемся JSLint для проверки отсутствия в нашем коде типичных ошибок.Сейчас не так важно, что эти параметры означают.Более подробно JSLint рассмотрена в приложении А.
/*jslint        browser : true, continue : true,  
    devel  : true, indent : 2,      maxerr : 50,
    newcap : true, nomen  : true, plusplus : true,
    regexp : true, sloppy : true,     vars : true,
    white  : true
*/
/*global jQuery */

// Модуль spa Обеспечивает функциональность выплывающего чата
var spa = (function ($) {// Помещаем весь наш код в пространство имен spa.Дополнительные сведения об этом приеме приведены в главе 2.
    // Объявляем все переменные до использования. Сохраняем конфигурационные параметры модуля в configMap, а переменные состояния в stateMap.
    // Переменные в области видимости модуля 
    var
        // Задать константы
        configMap = {
            extended_height: 434,
            extended_title: 'Click to retract',
            retracted_height: 16,
            retracted_title: 'Click to extend',
            template_html: '<div class="spa-slider"><\/div>'
        },
        // Объявить все прочие переменные в области видимости модуля
        $chatSlider,
        toggleSlider, onClickSlider, initModule;

    // Метод DOM toggleSlider изменяет высоту окна чата. Помещаем все методы манипуляции DOM в одну секцию.
    toggleSlider = function () {
        var
            slider_height = $chatSlider.height();
        // раскрыть окно чата, если оно свернуто. Этот код раскрывает окно чата.Он сравнивает текущую высоту окна с минимальной, чтобы понять, свернуто ли оно полностью.Если это так, то с помощью имеющегося в jQuery механизма анимации раскрывает его.        
        if (slider_height === configMap.retracted_height) {
            $chatSlider
                .animate({ height: configMap.extended_height })
                .attr('title', configMap.extended_title);
            return true;
        }
        // свернуть окно чата, если оно раскрыто. Этот код сворачивает окно чата.Он сравнивает текущую высоту окна с макимальной, чтобы понять, раскрыто ли оно полностью.Если это так, то с помощью имеющегося в jQuery механизма анимации сворачивает его.          
        else if (slider_height === configMap.extended_height) {
            $chatSlider
                .animate({ height: configMap.retracted_height })
                .attr('title', configMap.retracted_title);
            return true;
        }
        // ничего не делать, если окно чата в процессе перехода
        return false;
    }

    // Обработчик события /onClickSlider/            
    // получает событие щелчка и вызывает toggleSlider
    onClickSlider = function (event) {
        toggleSlider();
        return false;
    };
    // Открытый метод /initModule/       
    // устанавливает начальное состояние и предоставляет функциональность
    //
    initModule = function ($container) {
        // отрисовать HTML
        $container.html(configMap.template_html);
        $chatSlider = $container.find('.spa-slider');
        // инициализировать высоту и описание окна чата
        // привязать обработчик к событию щелчка мышью
        $chatSlider
            .attr('title', configMap.retracted_title)
            .click(onClickSlider);
        return true;
    };
    return { initModule: initModule };
}(jQuery));
// запустить spa, когда модель DOM будет готова
//
jQuery(document).ready(
    function () { spa.initModule(jQuery('#spa')); }
);