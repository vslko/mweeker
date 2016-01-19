<?php
$data = array(
    'success'    => true,
    'message'    => "updated",
    'data'       => array(
    	'id'	=> $_POST['id'],
    	'date'	=> $_POST['date'],
    	'time'	=> substr($_POST['date'],11,5),
    	'name'	=> $_POST['name'],
    	'state' => $_POST['state']
    )
);
die( json_encode($data) );
?>