<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 18/11/2018
 * Time: 00:51
 */
?>
@if(config('app.env') === 'production')
    <!-- CBRain integration -->
    <script type="application/javascript">var brain_client_id = 1000022;</script>
    <script src="https://brain-website-data.s3.ca-central-1.amazonaws.com/js/brain-script.js"></script>
@endif
