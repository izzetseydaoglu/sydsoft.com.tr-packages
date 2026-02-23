<?php
   /**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 8.04.2024 01:35
 */

   use _slib_php\sMail\sMail;
   use _slib_php\sSQL;

   include_once $_SERVER["DOCUMENT_ROOT"] . "/_lib/index.php";

   $mainBase = new mainBase();
   mainBase::$mainFunction = static function () {
	  $sSQL = new sSQL();
	  $mailcfg = $sSQL->getResult("_cfg_mail", ["id" => "1"], [], true);

	  $mail = new sMail($mailcfg);

	  $veriler = [
		 "senderName" => "İzzet SEYDAOĞLU",
	  ];
	  $mailTemplate = file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/emailtemplates/genel.html");
	  foreach ($veriler as $key => $value) {
		 $mailTemplate = str_replace('{{' . $key . '}}', $value, $mailTemplate);
	  }

	  if ($mail->mailGonder(["izzetseydaoglu@gmail.com"], date("d.m.y h:i:s"), $mailTemplate)) {
		 mainBase::$return["mail"] = "ok";
	  } else {
		 mainBase::$return["mail"] = $mail->error;
	  }
   };
