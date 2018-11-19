<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 25/02/2018
 * Time: 00:51
 */
?>
@if(config('app.env') === 'production')
    <!-- Google analytics -->
    <script defer>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-106873842-1', 'auto');
        ga('send', 'pageview');
    </script>
@endif
