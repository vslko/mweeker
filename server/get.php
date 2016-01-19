<?php
$states = array(1=>'wait', 'done', 'cancel');
$names  = array(1=>'Pit','Sven','John','Mike','Ruby','Naomi','Ivan','Nika','Bob','Dave','Ron','Jenny','Jim','Lisa','Leo');

$data = array(
    'success'    => true,
    'message'    => "ok",
    'data'        => array()
);

$from = mktime( 0, 0, 0,  substr($_GET['_from'],5,2) , substr($_GET['_from'],8,2) , substr($_GET['_from'],0,4) );
$till = mktime( 23, 59, 59,  substr($_GET['_till'],5,2) , substr($_GET['_till'],8,2) , substr($_GET['_till'],0,4) );

$count = rand(3,10);
for($i=0; $i<$count; $i++) {
	$dt = @date("Y-m-d H:i", mt_rand($from, $till));
    $data['data'][] = array(
        'id'        => rand(1,9999),
        'date'		=> $dt,
		'time'		=> substr($dt,11,5),
		'name'		=> $names[ rand(1,15) ],
        'state'		=> $states[ rand(1,3) ],
    );
}

die( json_encode($data) );

?>