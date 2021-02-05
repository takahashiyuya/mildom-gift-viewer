$(function () {

    // 対象者の Mildom ID
    const mildom_id = 10169353;

    // 音
    const $audioBox = $('#audioBox');
    const defaultSoundFile = "./audio/Onmtp-Inspiration02-2.mp3";
    const sounds = {
        1115: './audio/cheers_and_crap.mp3'
    };

    // 画像
    const image_box = $('#image_box');
    const animations = {
        1114: growUpAnimation
    };

    // ギフト
    const gift_map = [];

    /** 
     * ギフト情報の取得
     * (Mildom の API を直接コールする)
     */
    function getGiftInfo() {
        $.ajax({
          type: "get",
          url: "https://cloudac.mildom.com/nonolive/gappserv/gift/find",
        })
        .then(function (result) {
            for (gift in result.body.models) {
                let model = result.body.models[gift];
                gift_map[model.gift_id] = {
                    "price": model.price,
                    "name": model.name,
                    "url": model.pic }
            }
            for (gift in result.body.pack) {
                let model = result.body.pack[gift];
                gift_map[model.gift_id] = {
                    "price": model.price,
                    "name": model.name,
                    "url": model.pic }
            }
        }, function () {});
    }


    // イベントリスナー
    function eventListenner(json, complete_function) {
        console.log(json);

        // ギフトが送信された場合のみ対応
        if (json.cmd === "onGift") {
            createImage(json.giftId, json.count, complete_function);
            playSoundEffect(json.giftId, json.count);
        }

        // for dev
        // const devGiftId = 1114,
        //       devCount = 9;
        // createImage(devGiftId, devCount, complete_function);
        // playSoundEffect(devGiftId, devCount);

        complete_function()
    }

    // Img タグの生成
    function createImage(gift_id, count, complete_function) {

        // 対応可能なギフトである場合
        if (gift_map[gift_id]) {         
            for (var i=0; i<count; i++){
                const image = $("<img/>").addClass("stamp");
                const animation = animations[gift_id];
                if (animation) {
                    image.bind('load', function () {
                        animation(image, complete_function);
                    });
                } else {
                    image.bind('load', function () {
                        showImage(image, complete_function);
                    });
                }
                image.attr("src", gift_map[gift_id].url);
            }
        }
    }

    // Img タグのアニメーション開始
    function showImage(element, complete_function) {

        // 先に追加してサイズを把握
        element.css("left",+200+"%");
        element.appendTo(image_box);
        var elm_width = element.outerWidth(true);
        var elm_height = element.outerHeight(true);

        // 表示させている幅を取得
        const ib_width = image_box.outerWidth(true);
        const ib_height = image_box.outerHeight(true);

        var movey = (ib_height + elm_height);
        var originx = (ib_width - elm_width) * Math.random();
        var originy = (-elm_height);

        // 改めて設定
        element.css("left",originx+"px");
        element.css("top",originy+"px");
        
        // 新規コメントを左に移動
        element.velocity({
            translateY: movey+"px"
        },{
            duration: 5000,
            easing: "easeInSine",
            delay: 1500 * Math.random(),
            complete: function(e) {
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
        element.css("left","200%");
        element.appendTo(image_box);
        let elm_width = element.outerWidth(true);
        let elm_height = element.outerHeight(true);
        const ib_width = image_box.outerWidth(true);
        let originx = (ib_width - elm_width) * Math.random();
        element.css("left",originx+"px");
        element.css("bottom", "-" + elm_height + "px");

        element.velocity({
            translateY: "-" + elm_height + "px"
        },{
            duration: 5000,
            easing: "ease-out",
            delay: 1500 * Math.random(),
            complete: function(e) {
                element.velocity({
                    opacity: 0
                },{
                    delay: 5000,
                    easing: "ease",
                    complete: function(e) {
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
    function playSoundEffect(giftId, count){
        const $audio = $('<audio/>').get(0);
        $audioBox.append($audio);
        $audio.src = sounds[giftId] || defaultSoundFile;
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

    getGiftInfo();
    startToLissten(eventListenner);
    startConnectToMildom(mildom_id);
});
