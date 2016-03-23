/**
 * Created by kirill.sadovnikov on 21.03.16.
 */
var page = require('webpage').create();
system = require('system');

page.viewportSize = { width: 1920, height: 1080 };
page.open('http://grandex-roof.ru');

page.onLoadFinished = function(status) {
    if (status === "success") {
        page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {

            //вот тут аккуратнее, ибо метод evaluate не поддерживает замыкания
            page.evaluate(function(args) {
                function Parse(args) {
                    this.args = args;
                }

                Parse.prototype.parseCssParams = function(type) {
                    return Number($('.house_block').css(type).match(/[\d]*!/));
                }

                Parse.prototype.parseGet = function() {
                    var args = this.args || {};
                    var getUrl = args[1];
                    var massParse = {};
                    var siteId = 1007288;

                    var massGet = getUrl.split('&').map(function(v) { //getUrl.split('?')[1].split('&').map(function(v) {
                        var temp = v.split('=');
                        massParse[temp[0]] = temp[1];
                    });



                    for (var i in massParse) {
                        var element = $('.house_details_' + i);
                        var img_path = $('#' + massParse[i]).data('image');


                        if (element.find('img').length) {
                            console.log(1)
                            element.find('img').attr('src', img_path);
                        } else {
                            console.log(2)
                            element.append('<img src="" alt="" />');
                            element.find('img').attr('src', '' + img_path + '');
                        }



                        console.log(element.html(), i, img_path)
                    }

                    console.log($('body').html())
                }

                Parse.prototype.pageReady = function() {
                    this.parseGet();

                    $('body .site_wrap').children(':not(.house_block)').remove();
                    $('.house_block .centered').children(':not(.house_details)').remove();
                    $('.tooltip_trigger').hide();

                    var height = this.parseCssParams('height');
                    var width = this.parseCssParams('width');

                    $('body').css('height', height);
                }

                var parse = new Parse(args);

                parse.pageReady();
            }, system.args);

            page.render('img' + '.png');
            phantom.exit();
        });

        page.clipRect = { left: 500, top: 0, width: 900, height: 650 };
    }
}

//выводит сообщения из evaluate
page.onConsoleMessage = function(msg) {
    console.log(msg);
}

//обработчик ошибок
page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
        });
    }

    console.error(msgStack.join('\n'));
};