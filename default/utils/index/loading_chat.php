<script>
    // Constants
    const CHAT_PRELOADER_DEFAULT_WIDTH = 350;
    const CHAT_PRELOADER_MINIMIZED_WIDTH = 140;
    const FADE_DURATION = 500;
    const SKIP_NOTIFICATION_DELAY = 240000; // 4 minutes
    const RETRY_NOTIFICATION_DELAY = 480000; // 8 minutes
    const RETRY_CHECK_DELAY = 10000; // 10 seconds
    const MATRIX_CHAT_CHECK_INTERVAL = 100; // 100 ms

    let w;
    if (typeof(Worker) !== "undefined") {
        if (typeof(w) == "undefined") {
            let http = new XMLHttpRequest();
            let url = "plugins/worker.js"
            http.open('HEAD', url, false);
            http.send();
            if (http.status != 404)
                w = new Worker(url);
        }
    } 

    // Window load event
    $(window).on('load', () => {
        $('#ifmatrixchat').removeClass('invisible');
        setTimeout(() => {
            $('.splash-screen').addClass('display-none');
            $('.covered-screen').removeClass('display-none');
            $('#ifmatrixchat').removeClass('position-fixed');
        }, FADE_DURATION);
    });

    // Home panel click handler
    const handleHomePanelClick = () => {
        $('#webapp_workspace').show();
        const $iframe = $('#ifmatrixchat').contents();
        $iframe.find('.mx_ImageView_button_close').click();
        $iframe.find('.mx_Dialog_staticBackground').click();
    };

    // Set chat preloader width
    const setChatPreloaderWidth = () => {
        if (location.hash === '#/home') {
            const storedSize = localStorage.getItem('mx_lhs_size');
            let width = CHAT_PRELOADER_DEFAULT_WIDTH;

            if (storedSize === '0') {
                width = CHAT_PRELOADER_MINIMIZED_WIDTH;
            } else if (storedSize !== null) {
                width = parseInt(storedSize, 10);
            }

            $('#chatPreloader').css('width', width);
        }
    };
    setChatPreloaderWidth();

    // Chat loading check
    let isChatLoaded = false;
    const checkChatLoading = setInterval(() => {
        const matrix = $('#ifmatrixchat').contents().find('.mx_MatrixChat');
        if (matrix.length) {
            $('#chatPreloader, .Initialzing').fadeOut(FADE_DURATION);
            setTimeout(() => {
                $('#chatPreloader, .Initialzing, .bg-notif-cases').remove();
            }, FADE_DURATION);
            isChatLoaded = true;
            clearInterval(checkChatLoading);
        }
    }, MATRIX_CHAT_CHECK_INTERVAL);

    // Notification timers
    setTimeout(() => {
        if (!isChatLoaded) {
            $('.bg-notif-cases, .notif-skip, .btn-skip').removeClass('display-none');
        }
    }, SKIP_NOTIFICATION_DELAY);

    setTimeout(() => {
        if (!isChatLoaded) {
            $('.notif-skip, .btn-skip').addClass('display-none');
            $('.bg-notif-cases, .notif-reload, .btn-reload, .btn-retry').removeClass('display-none');
        }
    }, RETRY_NOTIFICATION_DELAY);

    // Utility functions
    const hideSkipNotification = () => {
        $('.bg-notif-cases, .notif-skip, .btn-skip').addClass('display-none');
    };

    const reloadPage = () => {
        window.location.reload();
    };

    const getRandomProperty = (obj) => {
        const keys = Object.keys(obj);
        return keys[Math.floor(Math.random() * keys.length)];
    };

    const retryChat = () => {
        $('.bg-notif-cases, .notif-reload, .btn-reload, .btn-retry').addClass('display-none');
        const iframe = document.getElementById('ifmatrixchat');
        iframe.src = iframe.src;
        $('#ifmatrixchat').on('load', () => {
            setTimeout(() => {
                const matrixRetry = $('#ifmatrixchat').contents().find('.mx_MatrixChat');
                if (matrixRetry.length === 0) {
                    $('.bg-notif-cases, .notif-logout, .btn-logout').removeClass('display-none');
                } else {
                    $('#chatPreloader, .Initialzing').fadeOut(FADE_DURATION);
                    setTimeout(() => {
                        $('#chatPreloader, .Initialzing, .bg-notif-cases').remove();
                    }, FADE_DURATION);
                }
            }, RETRY_CHECK_DELAY);
        });
    };

    const logoutPage = () => {
        alert('You should clear cache and open incognito browser before login.');
        document.getElementById('logout').click();
    };

    // Fetch quote
    const fetchQuote = () => {
        $.ajax({
            url: "<?php echo Yii::app()->params['matrixapi_url']; ?>/services/getQuote",
            data: { format: 'json' },
            type: 'GET',
            success: (response) => {
                try {
                    const data = JSON.parse(response);
                    const randomQuote = data[getRandomProperty(data)];
                    $('#HomePage_qoute').text(randomQuote.qoute);
                    $('#actor').text(randomQuote.actor);
                } catch (error) {
                    console.error('Error parsing quote data:', error);
                }
            },
            error: (xhr, status, error) => {
                console.error('Error fetching quote:', error);
            }
        });
    };
    fetchQuote();
</script>
