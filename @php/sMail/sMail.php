<?php
   /**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 8.04.2024 01:35
 */

   namespace _slib_php\sMail;

   use PHPMailer\PHPMailer\Exception;
   use PHPMailer\PHPMailer\PHPMailer;

   class sMail {
	  public string|null $sendername = null;
	  public string|null $username = null;
	  public string|null $password = null;
	  public int $SMTPDebug = 0; // hata ayiklama: 1 = hata ve mesaj, 2 = sadece mesaj
	  public bool $SMTPAuth = true;
	  public string $smtpsecure = "ssl";
	  public string $host = "smtp.gmail.com";
	  public int $port = 465;
	  public bool $isHTML = true;
	  public mixed $error = null;

	  public function __construct($cfg = null) {
		 if ($cfg) {
			foreach ($cfg as $key => $value) {
			   if (property_exists($this, $key)) $this->{$key} = $value;
			}
		 }
	  }

	  public function mailGonder(array $alicilar, string $konu, string $metin, $ekler = [], $bcc = []): bool {
		 require_once 'phpmailer/Exception.php';
		 require_once 'phpmailer/PHPMailer.php';
		 require_once 'phpmailer/SMTP.php';

		 $mail = new PHPMailer(true);
		 $mail->setLanguage('tr', $_SERVER["DOCUMENT_ROOT"] . '_slib_php/sMail/phpmailler/');

		 try {
			//Server settings
			$mail->SMTPDebug = $this->SMTPDebug;
			$mail->isSMTP();
			$mail->Host = $this->host;
			$mail->Port = $this->port;
			$mail->SMTPAuth = $this->SMTPAuth;
			$mail->Username = $this->username;
			$mail->Password = $this->password;
			$mail->SMTPSecure = $this->smtpsecure;
			$mail->CharSet = PHPMailer::CHARSET_UTF8;
			$mail->Priority = 1;

			//Recipients
			$mail->setFrom($this->username, $this->sendername);
			foreach ($alicilar as $alici) {
			   $mail->addAddress($alici);
			}

			if (count($bcc) > 0) {
			   foreach ($bcc as $bccMail) {
				  $mail->addBCC($bccMail);
			   }
			}

			// $mail->addReplyTo('info@example.com', 'Information'); //Alernative geri dönüş
			// $mail->addCC('cc@example.com');
			// $mail->addBCC('bcc@example.com');

			//Attachments
			if (count($ekler) > 0) {
			   foreach ($ekler as $name => $path) {
				  $mail->addAttachment($_SERVER["DOCUMENT_ROOT"] . $path, $name);
			   }
			}

			//Content
			$mail->isHTML($this->isHTML);
			$mail->Subject = $konu;
			$mail->msgHTML($metin);
//            $mail->Body = $metin;
//            $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\r\n", $metin));
			$mail->send();
			return true;
		 } catch (Exception $e) {
			$this->error = $e->getMessage();
			return false;
		 }
	  }
   }