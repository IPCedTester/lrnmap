<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Clickable map example page</title>
        <meta name="description" content="Clickable map from Makeaclickablemap.com">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

		<link href="//cdnjs.cloudflare.com/ajax/libs/qtip2/2.1.1/jquery.qtip.min.css" rel="stylesheet" />
		<link href="css/style.makeaclickablemap.css" rel="stylesheet" />
		<style>		
			body{
				margin:0;
				padding:0;
			}
			#map{
				max-width: 750px;
				max-height:562px;
				margin: 0 auto;
			}			
		</style>
    </head>
    <body>
		<div id="map"></div>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.4/raphael-min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/qtip2/2.1.1/jquery.qtip.min.js"></script>
		<script src="js/app.js"></script>
		<script>
			makeaClickableMap.initialize(document.getElementById("map"));	
		</script>
	</body>