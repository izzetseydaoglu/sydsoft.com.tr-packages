<?php

/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-03-02 00:26:14
 */

namespace _sydSOFT_PHPBase;

use MainBase;

class SYDTOKEN
{
	public static ?string $secretKey = null;
	public static ?array $encDecKeys = null;

	public function __construct()
	{
		$this->setLog('Open', __CLASS__);
		if (is_null(self::$secretKey)) {
			if (isset($GLOBALS['config_sToken']['secretKey'])) {
				self::setSecretKey($GLOBALS['config_sToken']['secretKey']);
			} else {
				self::setSecretKey(
					'globalkeys-helalseydaoglu.4H86CgbGEDvoPw*MWz*fkL.mTpUdjD3aNDeBbL3C@!mnR2MRE*RiBcvaXN9D-v4-pj*z*g@9X7!',
				);
			}
		}

		if (is_null(self::$encDecKeys)) {
			if (isset($GLOBALS['config_sToken']['encDecKeys'])) {
				self::setEncDecKeys($GLOBALS['config_sToken']['encDecKeys']);
			} else {
				self::setEncDecKeys([3, 5, 8, 11, 15, 22]);
			}
		}
	}

	public function setLog($log, $title = null): void
	{
		MainBase::setDebug($log, $title);
	}

	public static function setSecretKey(?string $secretKey): void
	{
		self::$secretKey = $secretKey;
	}

	public static function setEncDecKeys(?array $keys): void
	{
		self::$encDecKeys = $keys;
	}

	public function sign(array $data, int $expSeconds = 60): string|bool
	{
		try {
			$expire = time() + $expSeconds; // Add 60 seconds
			$payload = [
				'exp' => $expire, // Sona ereceği tarih
				'data' => $data,
			];

			$json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
			$base = base64_encode($json);
			$sig = hash_hmac('sha512', $base, self::$secretKey);
			return base64_encode($base . '.' . $sig);
		} catch (\Exception $e) {
			$this->setLog($e->getMessage(), __CLASS__);
			return false;
		}
	}

	public function verify(string $token): mixed
	{
		try {
			$token = base64_decode($token);
			if ($token === false) {
				throw new \Exception('Base64 decode başarısız');
			}
			$parts = explode('.', $token);
			if (count($parts) !== 2) {
				throw new \Exception('Token formatı yanlış');
			}

			[$base, $sig] = $parts;
			$expectedSig = hash_hmac('sha512', $base, self::$secretKey);

			if (!hash_equals($expectedSig, $sig)) {
				throw new \Exception('Token imzası hatalı');
			}

			$decoded = base64_decode($base, true);
			if ($decoded === false) {
				throw new \Exception('Base64 decode başarısız');
			}

			$payload = json_decode($decoded, true, 512, JSON_THROW_ON_ERROR);
			if (!is_array($payload)) {
				throw new \Exception('JSON decode geçersiz');
			}

			if (($payload['exp'] ?? 0) < time()) {
				throw new \Exception('Token süresi dolmuş');
			}

			if (($payload['exp'] ?? 0) < time()) {
				throw new \Exception('Token süresi dolmuş');
			}
			return $payload;
		} catch (\Exception $e) {
			$this->setLog($e->getMessage(), __CLASS__);
			return false;
		}
	}

	public function encData($data): string
	{
		$keys = self::$encDecKeys;

		try {
			// JS'teki gibi { data: value } sarmalaması
			$newJSON = ['data' => $data];

			// JSON stringe çevir + UTF-8
			$utf8Data = mb_convert_encoding(json_encode($newJSON), 'UTF-8', 'UTF-8');

			// base64 encode
			$newData = base64_encode($utf8Data);

			// Keys üzerinden rastgele karakter ekle
			foreach ($keys as $value) {
				$randomChar = chr(rand(97, 122)); // a-z
				if ($value < strlen($newData)) {
					$newData = substr($newData, 0, $value) . $randomChar . substr($newData, $value);
				} else {
					$newData .= $randomChar; // eğer pozisyon yoksa sona ekle
				}
			}

			return $newData;
		} catch (\Exception $e) {
			return '';
		}
	}

	public function decData(string $data)
	{
		$keys = self::$encDecKeys;

		try {
			$decode = $data;

			foreach ($keys as $index => $value) {
				$prevValue = $keys[$index - 1] ?? null;

				if ($prevValue === null) {
					if (strlen($decode) > $value) {
						$decode = substr($decode, 0, $value) . substr($decode, $value + 1);
					}
				} else {
					$pos = $value - $index;
					if (strlen($decode) > $pos) {
						$decode = substr($decode, 0, $pos) . substr($decode, $pos + 1);
					}
				}
			}

			// base64 decode
			$decodedString = base64_decode($decode, true);
			if ($decodedString === false) {
				throw new \Exception('Base64 decode failed');
			}

			// UTF-8 decode
			$utf8DecodedString = mb_convert_encoding($decodedString, 'UTF-8', 'UTF-8');

			// JSON parse
			$parsed = json_decode($utf8DecodedString, true);

			return $parsed['data'] ?? '';
		} catch (\Exception $e) {
			return '';
		}
	}

	public function __destruct()
	{
		$this->setLog('Close', __CLASS__);
	}
}
