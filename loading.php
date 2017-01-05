<?php

function curl_post_in($url) {
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$data = curl_exec($curl);
	curl_close($curl);
	return $data;
}

if (isset($_GET['type'])) {
	echo curl_post_in("http://v.juhe.cn/toutiao/index?type=" . $_GET['type'] . "&key=467752d169d376ce84dd6a51bafda1fe");
}

?>