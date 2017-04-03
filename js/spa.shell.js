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
            chatRetractedTitle: 'Щелкните чтобы развернуть',
            anchorSchemaMap: { chat: { open: true, closed: true } },
        },
        stateMap = {// Помещаем динамическую информацию о состоянии, доступную внутри модуля, в объект stateMap.
            $container: null,
            isChatRetracted: true,
            anchorMap: {},
        },
        jqueryMap = {}, setJqeryMap,// Кэшируем коллекции jQuery в объекте jqueryMap в функции "setJqeryMap".
        toggjeChat, onClickChat,
        copyAnchorMap, changeAnchorPart, onHashChange,
        initModule;
    // -----------------------------КОНЕЦ ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ-----------------------------

    // -----------------------------НАЧАЛО СЛУЖЕБНЫХ МЕТОДОВ-----------------------------
    copyAnchorMap = function(){
        return $.extend(true, {}, stateMap.anchorMap);
    };
    // -----------------------------КОНЕЦ СЛУЖЕБНЫХ МЕТОДОВ-----------------------------

    // -----------------------------НАЧАЛО МЕТОДОВ DOM-----------------------------
    // В секцию «Методы DOM» помещаются функции, которые создают элементы на странице и манипулируют ими.


    /* Функция changeAnchorPart() изменяет якорь в URI-адресе.
        Этот метод:
            * Создает копию хэша, вызывая copyAnchorMap().
            * Модифицирует пары ключ–значение с помощью arg_map.
            * Управляет различием между зависимыми и независимыми значениями в кодировке.
            * Пытается изменить URI, используя uriAnchor.
        Аргументы: arg_map – хэш, описывающий, какую часть якоря мы хотим изменить.
        Возвращает : true  – якорь в URI обновлен, false – не удалось обновить якорь в URI
        Действие: Текущая часть якоря сохранена в stateMap.anchor_map. Обсуждение кодировки см. в документации по uriAnchor.*/
    changeAnchorPart = function (argMap) {
        var
            anchorMapRevise = copyAnchorMap(),
            boolReturn = true,
            keyName, keyNameDep;

        // Начало объединения изменений в хэше якорей
        KEYVAL:
        for (keyName in argMap) {
            if (argMap.hasOwnProperty(keyName)) {
                if (keyName.indexOf('_') === 0) { continue KEYVAL; }// Пропустить зависимые ключи
                anchorMapRevise[keyName] = argMap[keyName];// Обновить значение независимого ключа

                // Обновить соответствующий зависимый ключ
                keyNameDep = '_' + keyName;
                if (argMap[keyNameDep]) {
                    anchorMapRevise[keyNameDep] = argMap[keyNameDep];
                } else {
                    delete anchorMapRevise[keyNameDep];
                    delete anchorMapRevise['_s' + keyNameDep];
                }
            }
        }
        // Конец объединения изменений в хэше якорей

        // Начало попытки обновления URI; в случае ошибки.
        // Не устанавливаем якорь, если он несоответствует схеме (uriAnchor возбудит исключение). В таком случае возвращаем якорь в исходное состояние

        // восстановить исходное состояние
        try {
            $.uriAnchor.setAnchor(anchorMapRevise);
        } catch (e) {
            // восстановить исходное состояние в URI
            $.uriAnchor.setAnchor(stateMap.anchorMap, null, true);
            boolReturn = false;
        }
        // Конец попытки обновления URI

        return boolReturn;
    };

    /* Функция "setJqueryMap" служит для кэширования коллекций jQuery.
        Она должна присутствовать практически во всех написанных нами оболочках и функциональных модулях.
        Кэш jqueryMap позволяет существенно уменьшить количество проходов jQuery по документу и повысить производительность.*/
    setJqeryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $chat: $container.find('.spa-shell-chat')
        };
    };

    /* Функция "toggjeChat" сворачивает или развертывает окно чата
        Аргументы  :doExtend – true-развернуть окно; false – свернуть окно. callback – необязательная функция, которая вызывается в конце анимации
        Возвращает : true  – окно свернуто или раскрыто, false – окно находится в процессе анимации */
    toggjeChat = function (doExtend, callback) {
        var
            pxChatHeight = jqueryMap.$chat.height(),
            isOpen = pxChatHeight === configMap.chatExtendHeight,
            isClosed = pxChatHeight === configMap.chatRetractHeight,
            isSliding = !isOpen && !isClosed;

        // Предотвращаем гонку, отказываясь начинать операцию, если окно чата уже находится в процессе анимации
        if (isSliding) { return false; }

        var
            height = doExtend ? configMap.chatExtendHeight : configMap.chatRetractHeight,
            time = doExtend ? configMap.chatExtendTime : configMap.chatRetractTime,
            title = doExtend ? configMap.chatExtendedTitle : configMap.chatRetractedTitle;

        jqueryMap.$chat.animate(
            { height: height },
            time,
            function () {
                jqueryMap.$chat.attr('title', title);
                stateMap.isChatRetracted = !doExtend;
                if (callback) { callback(jqueryMap.$chat); }
            }
        );
        return true;
    };
    // -----------------------------КОНЕЦ МЕТОДОВ DOM-----------------------------

    // -----------------------------НАЧАЛО ОБРАБОТЧИКОВ СОБЫТИЙ-----------------------------

    /* Обработчик события "onHashchange"
         Аргументы: event – объект события jQuery.
         Параметры: нет
         Возвращает: false
         Действие:
            * Разбирает якорь в URI.
            * Сравнивает предложенное состояние приложения с текущим.
            * Вносит изменения, только если предложенное состояние отличается от текущего.*/
    onHashChange = function (event) {
        var
            anchorMapPrevious = copyAnchorMap(),
            anchorMapProposed,
            _sChatPrevious, _sChatProposed, sChatProposed;

        try { anchorMapProposed = $.uriAnchor.makeAnchorMap(); }
        catch (e) { $.uriAnchor.setAnchor(anchorMapPrevious, null, true); return false; }
        stateMap.anchorMap = anchorMapProposed;

        // вспомогательные переменные
        _sChatPrevious = anchorMapPrevious._s_chat;
        _sChatProposed = anchorMapProposed._s_chat;

        // Начало изменения компонента Chat
        if (!anchorMapPrevious || _sChatPrevious !== _sChatProposed) {
            sChatProposed = anchorMapProposed.chat;
            switch (sChatProposed) {
                case 'open':
                    toggjeChat(true);
                    break;
                case 'closed':
                    toggjeChat(false);
                    break;
                default:
                    toggjeChat(false);
                    delete anchorMapProposed.chat;
                    $.uriAnchor.setAnchor(anchorMapProposed, null, true);
            }
        }
        // Конец изменения компонента Chat
        return false;
    };
   
    /* Обработчик события "onHashchange" */
    onClickChat = function (event) {
        changeAnchorPart({ chat: (stateMap.isChatRetracted ? 'open' : 'closed') });
        return false;
    };
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

        $.uriAnchor.configModule({ schema_map: configMap.anchorSchemaMap });
        $(window)
        .bind('hashchange', onHashChange)
        .trigger('hashchange');
    };

    // Явно экспортируем открытые методы, возвращая их в хэше. В настоящее время есть только один открытый метод – initModule 
    return { initModule: initModule };
    // -----------------------------КОНЕЦ ОТКРЫТЫХ МЕТОДОВ-----------------------------
}());