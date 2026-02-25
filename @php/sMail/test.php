<?php

/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-24 02:58:27
 */


use _sydSOFT_PHPBase\sMail\SYDMAIL;
use _sydSOFT_PHPBase\SYDSQL;

include_once $_SERVER["DOCUMENT_ROOT"] . "/_lib/index.php";

$mainBase = new MainBase();
MainBase::$mainFunction = static function () {
    $sSQL = new SYDSQL();
    $mailcfg = $sSQL->getResult("_cfg_mail", ["id" => "1"], [], true);

    $mail = new SYDMAIL($mailcfg);

    $veriler = [
        "senderName" => "İzzet SEYDAOĞLU",
    ];
    $mailTemplate = file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/emailtemplates/genel.html");
    foreach ($veriler as $key => $value) {
        $mailTemplate = str_replace('{{' . $key . '}}', $value, $mailTemplate);
    }

    if ($mail->mailGonder(["izzetseydaoglu@gmail.com"], date("d.m.y h:i:s"), $mailTemplate)) {
        MainBase::$return["mail"] = "ok";
    } else {
        MainBase::$return["mail"] = $mail->error;
    }
};
