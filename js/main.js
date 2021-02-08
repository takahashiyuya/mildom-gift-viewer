$(function () {

    // 対象者の Mildom ID
    const mildomId = 10169353;

    // アプリケーション
    const $appBox = $('#appBox');

    // 音
    const $audioBox = $('#audioBox');
    const defaultSounds = ['./audio/men_iei.mp3'];
    const soundsMap = {
        1115: ['./audio/cheers_and_crap.mp3'],
        1116: ['./audio/men_iyaho.mp3']
    };

    // 画像
    const animationsMap = {
        1114: [growUpAnimation]
    };

    // ギフト情報が格納される
    const gift_map = [];

    // コメント
    const $commentBox = $('#commentBox');

    /**
     * ギフト情報の取得
     * (Mildom の API を直接コールする)
     */
    function getGiftInfo() {
        $.ajax({
            type: "get",
            url: "https://cloudac.mildom.com/nonolive/gappserv/gift/find",
        }).then(function (result) {
            for (gift in result.body.models) {
                let model = result.body.models[gift];
                gift_map[model.gift_id] = {
                    "price": model.price,
                    "name": model.name,
                    "url": model.pic
                }
            }
            for (gift in result.body.pack) {
                let model = result.body.pack[gift];
                gift_map[model.gift_id] = {
                    "price": model.price,
                    "name": model.name,
                    "url": model.pic
                }
            }
        });
    }


    // イベントリスナー
    function eventListenner(json, complete_function) {
        console.log(json);

        // ギフトが送信された場合のみ対応
        if (json.cmd === "onGift") {
            createImage(json.giftId, json.count, complete_function);
            playSoundEffect(json.giftId, json.count);
        }

        // コメントを流す
        if (json.cmd === "onChat") {
            displayComment(json);
        }

        // for dev
        // const devGiftId = 1114,
        //     devCount = 1;
        // createImage(devGiftId, devCount, complete_function);
        // playSoundEffect(devGiftId, devCount);

        complete_function()
    }

    function displayComment(data) {
        const $comment = $('<div class="comment"/>');
        $comment.text(data.msg);
        $comment.appendTo($commentBox);

        // ウィンドウとコンテンツの幅を取得
        const commentWidth = $comment.outerWidth(true);
        const commentHeight = $comment.outerHeight(true);
        const appWidth = $appBox.outerWidth(true);
        const appHeight = $appBox.outerHeight(true);
        const displayX = -(commentWidth);
        const displayY = Math.floor((appHeight - commentHeight) * Math.random());
        const movingDistance = appWidth + commentWidth;

        // 座標設定
        $comment.css('right', displayX + "px");
        $comment.css('top', displayY + "px");
        $comment.velocity({
            translateX: -(movingDistance) + "px"
        }, {
            duration: 7000,
            easing: 'linear',
            delay: 1500 * Math.random(),
            complete: function (e) {
                $comment.remove();
            }
        });
    }

    // Img タグの生成
    function createImage(gift_id, count, complete_function) {
        // 対応可能なギフトである場合
        if (gift_map[gift_id]) {
            for (var i = 0; i < count; i++) {
                const image = $("<img/>").addClass("stamp");
                const animation = selectAnimation(gift_id);
                image.bind('load', function () {
                    animation(image, complete_function);
                });
                image.attr("src", gift_map[gift_id].url);
            }
        }
    }

    // Img タグのアニメーション開始
    function showImage(element, complete_function) {

        // 先に追加してサイズを把握
        element.css("left", +200 + "%");
        element.appendTo($appBox);
        var elm_width = element.outerWidth(true);
        var elm_height = element.outerHeight(true);

        // 表示させている幅を取得
        const ib_width = $appBox.outerWidth(true);
        const ib_height = $appBox.outerHeight(true);

        var movey = (ib_height + elm_height);
        var originx = (ib_width - elm_width) * Math.random();
        var originy = (-elm_height);

        // 改めて設定
        element.css("left", originx + "px");
        element.css("top", originy + "px");

        // 新規コメントを左に移動
        element.velocity({
            translateY: movey + "px"
        }, {
            duration: 5000,
            easing: "easeInSine",
            delay: 1500 * Math.random(),
            complete: function (e) {
                element.remove();
            }
        });
    }

    /**
     * 下からニュ〜〜って草が生えるイメージのアニメーション
     * @param element
     * @param complete_function
     */
    function growUpAnimation(element, complete_function) {
        element.css("left", "200%");
        element.appendTo($appBox);
        let elm_width = element.outerWidth(true);
        let elm_height = element.outerHeight(true);
        const ib_width = $appBox.outerWidth(true);
        let originx = (ib_width - elm_width) * Math.random();
        element.css("left", originx + "px");
        element.css("bottom", "-" + elm_height + "px");

        element.velocity({
            translateY: "-" + elm_height + "px"
        }, {
            duration: 5000,
            easing: "ease-out",
            delay: 1500 * Math.random(),
            complete: function (e) {
                element.velocity({
                    opacity: 0
                }, {
                    delay: 5000,
                    easing: "ease",
                    complete: function (e) {
                        element.remove();
                    }
                });
            }
        });
    }

    /**
     * ギフトの音再生
     *
     * @param giftId
     * @param count
     */
    function playSoundEffect(giftId, count) {
        const $audio = $('<audio/>').get(0);
        $audioBox.append($audio);
        $audio.src = selectSound(giftId);
        $audio.volume = 0.2;

        let counter = 0;
        const timerId = setInterval(function () {
            $audio.currentTime = 0;
            $audio.play();

            counter++;
            if (count <= counter) {
                clearInterval(timerId);
            }
        }, 100);

        $audio.remove();
    }


    function selectAnimation(giftId) {
        const animations = animationsMap[giftId];
        if (!animations) {
            return showImage;
        }

        return pickRandomItem(animations);
    }

    function selectSound(giftId) {
        const sounds = soundsMap[giftId];
        if (!sounds) {
            return pickRandomItem(defaultSounds);
        }

        return pickRandomItem(sounds);
    }

    function pickRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getGiftInfo();
    startToLissten(eventListenner);
    startConnectToMildom(mildomId);
});
