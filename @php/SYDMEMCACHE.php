<?php

/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-28 23:06:07
 */

namespace _sydSOFT_PHPBase;

use MainBase;
use Memcached;
use MemcachedException;

class SYDMEMCACHE
{
	public static mixed $memcache_connection = null;
	public static ?string $host = null;
	public static ?string $port = null;
	public static int $cacheTime = 0; /* 0=indefinite, 60=1 minute*/

	public function __construct()
	{
		// $this->setLog("Open", __CLASS__);
		if (is_null(self::$host) && isset($GLOBALS['config_sMemcache']['host'])) {
			self::$host = $GLOBALS['config_sMemcache']['host'];
		}
		if (is_null(self::$port) && isset($GLOBALS['config_sMemcache']['port'])) {
			self::$port = $GLOBALS['config_sMemcache']['port'];
		}
		if (isset($GLOBALS['config_sMemcache']['time'])) {
			self::$cacheTime = $GLOBALS['config_sMemcache']['time'];
		}
		$this->connectMemcache();
	}

	public function setLog($log, $title = null): void
	{
		MainBase::setDebug($log, $title);
	}

	public function connectMemcache()
	{
		$connection = self::$memcache_connection;
		$host = self::$host;
		$port = self::$port;
		if (is_null($connection)) {
			if (class_exists('Memcached')) {
				try {
					$connection = new Memcached();
					$connection->addServer($host, $port);
					self::$memcache_connection = $connection;
					$this->setLog('Connected', 'MEMCACHE');
				} catch (MemcachedException $e) {
					die($e->getMessage());
				}
			} else {
				die('Memcached extension not loaded');
			}
		}
		return $this;
	}

	public function setCache($key, $val, int $time = 0): bool
	{
		if (self::$memcache_connection) {
			if ($time === 0 && self::$cacheTime !== 0) {
				$time = self::$cacheTime;
			}
			return self::$memcache_connection->set($key, $val, $time);
		}
		return false;
	}

	public function getCache($key): string|bool
	{
		if (self::$memcache_connection) {
			return self::$memcache_connection->get($key);
		}
		return false;
	}

	public function deleteCache($key): bool
	{
		if (self::$memcache_connection) {
			return self::$memcache_connection->delete($key);
		}
		return false;
	}

	public function resetCache(): bool
	{
		if (!self::$memcache_connection) {
			return false;
		}
		return self::$memcache_connection->flush(0);
		// if (self::$memcache_connection) {
		// 	if (!self::$memcache_connection->flush(0)) {
		// 		$keys = $this->getAllKeys();
		// 		if ($keys) {
		// 			foreach ($keys as $key) {
		// 				$this->deleteCache($key);
		// 			}
		// 		}
		// 	}
		// 	return true;
		// }
		// return false;
	}

	public function getAllKeys(): array|bool
	{
		if (self::$memcache_connection) {
			return self::$memcache_connection->getAllKeys();
		}
		return false;
	}

	public function getStatus(): array|bool
	{
		if (self::$memcache_connection) {
			return self::$memcache_connection->getStats();
		}
		return false;
	}

	public function __destruct()
	{
		self::$memcache_connection = null;
		//        $this->setLog("Close", __CLASS__);
	}
}
