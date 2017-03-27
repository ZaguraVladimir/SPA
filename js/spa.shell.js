/*
spa.shell.css
Модуль SHELL для SPA
*/

// Объявляем все переменные, доступные внутри пространства имен, – в данном случае "spa.shell" – в секции «Область видимости модуля». Обсуждение этой и других секций шаблона см. в приложении А.
spa.shell = (function () {
    // -----------------------------НАЧАЛО ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ-----------------------------
    var
        configMap = {
            mainHTML: String()
            + '<div class="spa-shell-head">'
            + '   <div class="spa-shell-head-logo"></div>'
            + '    <div class="spa-shell-head-acct"></div>'
            + '    <div class="spa-shell-head-search"></div>'
            + '</div>'
            + '<div class="spa-shell-main">'
            + '    <div class="spa-shell-main-nav"></div>'
            + '    <div class="spa-shell-main-content"></div>'
            + '</div>'
            + '<div class="spa-shell-foot"></div>'
            + '<div class="spa-shell-chat"></div>'
            + '<div class="spa-shell-modal"></div>',
            chatExtendTime: 1000,// Время разворачивания окна чата
            chatRetractTime: 300,// Время сворачивания окна чата
            chatExtendHeight: 450,// Высота развернутого окна чата
            chatRetractHeight: 15,// Высота свернутого окна чата
            chatExtendedTitle: 'Щелкните чтобы свернуть',
            chatRetractedTitle: 'Щелкните чтобы развернуть'
        },
        stateMap = { $container: null, isChatRetracted: true },// Помещаем динамическую информацию о состоянии, доступную внутри модуля, в объект stateMap.
        jqueryMap = {}, setJqeryMap,// Кэшируем коллекции jQuery в объекте jqueryMap в функции "setJqeryMap".
        toggjeChat, onClickChat,
        initModule;
    // -----------------------------КОНЕЦ ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ-----------------------------

    // -----------------------------НАЧАЛО СЛУЖЕБНЫХ МЕТОДОВ-----------------------------
    // В секцию «Служебные методы» помещаются функции, которые не взаимодействуют с элементами страницы.
    // -----------------------------КОНЕЦ СЛУЖЕБНЫХ МЕТОДОВ-----------------------------

    // -----------------------------НАЧАЛО МЕТОДОВ DOM-----------------------------
    // В секцию «Методы DOM» помещаются функции, которые создают элементы на странице и манипулируют ими.

    /*Функция "setJqueryMap" служит для кэширования коллекций jQuery.
    Она должна присутствовать практически во всех написанных нами оболочках и функциональных модулях.
    Кэш jqueryMap позволяет существенно уменьшить количество проходов jQuery по документу и повысить производительность.*/
    setJqeryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $chat: $container.find('.spa-shell-chat')
        };
    };

    // Назначение : свернуть или развернуть окно чата
    // Аргументы  :
    //   * doExtend – true-развернуть окно; false – свернуть окно
    //   * callback – необязательная функция, которая вызывается в конце анимации
    // Возвращает :
    //   * true  – окно свернуто
    //   * false – окно раскрыто
    toggjeChat = function (doExtend, callback) {
        var
            pxChatHeight = jqueryMap.$chat.height(),
            isOpen = pxChatHeight === configMap.chatExtendHeight,
            isClosed = pxChatHeight === configMap.chatRetractHeight,
            isSliding = !isOpen && !isClosed;

        // Предотвращаем гонку, отказываясь начинать операцию, если окно чата уже находится в процессе анимации
        if (isSliding) { return false; }

        if (doExtend) {// Развернуть окно чата
            jqueryMap.$chat.animate(
                { height: configMap.chatExtendHeight },
                configMap.chatExtendTime,
                function () {
                    jqueryMap.$chat.attr('title', configMap.chatExtendedTitle);
                    stateMap.isChatRetracted = false;
                    if (callback) { callback(jqueryMap.$chat); }
                }
            );
            return true;
        } else {// Cвернуть окно чата
            jqueryMap.$chat.animate(
                { height: configMap.chatRetractHeight },
                configMap.chatRetractTime,
                function () {
                    jqueryMap.$chat.attr('title', configMap.chatRetractedTitle);
                    stateMap.isChatRetracted = true;
                    if (callback) { callback(jqueryMap.$chat); }
                }
            );
            return true;
        }
    };
    // -----------------------------КОНЕЦ МЕТОДОВ DOM-----------------------------

    // -----------------------------НАЧАЛО ОБРАБОТЧИКОВ СОБЫТИЙ-----------------------------
    onClickChat = function (event) {
        toggjeChat(stateMap.isChatRetracted);
        return false;
    }
    // -----------------------------КОНЕЦ ОБРАБОТЧИКОВ СОБЫТИЙ-----------------------------

    // -----------------------------НАЧАЛО ОТКРЫТЫХ МЕТОДОВ-----------------------------

    // Открытый метод initModule используется для инициализации модуля.
    initModule = function ($container) {
        // загрузить HTML и кэшировать коллекции jQuery
        stateMap.$container = $container;
        $container.html(configMap.mainHTML);
        setJqeryMap();

        stateMap.isChatRetracted = true;
        jqueryMap.$chat
            .attr('title', configMap.chatRetractedTitle)
            .click(onClickChat);
    };

    // Явно экспортируем открытые методы, возвращая их в хэше. В настоящее время есть только один открытый метод – initModule 
    return { initModule: initModule };
    // -----------------------------КОНЕЦ ОТКРЫТЫХ МЕТОДОВ-----------------------------
}());