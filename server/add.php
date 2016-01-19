<?php
$data = array(
    'success'    => true,
    'message'    => "added",
    'data'       => array(
    	'id'	=> rand(10000,99999),
    	'date'	=> $_POST['date'],
    	'time'	=> substr($_POST['date'],11,5),
    	'name'	=> $_POST['name'],
    	'state' => $_POST['state']
    )
);
die( json_encode($data) );
?>