<?php

   /**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 8.04.2024 01:35
 */

   namespace _slib_php;

   use mainBase;
   use Memcached;
   use MemcachedException;

   class sMemcache {
	  public static mixed $memcache_connection = null;
	  public static string|null $host = null;
	  public static string|null $port = null;
	  public static int $cacheTime = 0;    /* 0=indefinite, 60=1 minute*/

	  public function __construct() {
		 // $this->setLog("Open", __CLASS__);
		 if (is_null(self::$host) && $GLOBALS["config_sMemcache"]["host"]) {
			self::$host = $GLOBALS["config_sMemcache"]["host"];
		 }
		 if (is_null(self::$port) && $GLOBALS["config_sMemcache"]["port"]) {
			self::$port = $GLOBALS["config_sMemcache"]["port"];
		 }
		 if (is_null(self::$cacheTime) && $GLOBALS["config_sMemcache"]["time"]) {
			self::$cacheTime = $GLOBALS["config_sMemcache"]["time"];
		 }
		 $this->connectMemcache();
	  }

	  public function setLog($log, $title = null): void {
		 mainBase::setDebug($log, $title);
	  }

	  public function connectMemcache() {
		 $connection = self::$memcache_connection;
		 $host = self::$host;
		 $port = self::$port;
		 if (is_null($connection)) {
			if (class_exists('memcached')) {
			   try {
				  $connection = new Memcached();
				  $connection->addServer($host, $port);
				  self::$memcache_connection = $connection;
				  $this->setLog("Connected", "MEMCACHE");
			   } catch (MemcachedException $e) {
				  die($e->getMessage());
			   }
			} else {
			   die("Memcached extention not loaded");
			}
		 }
		 return $this;
	  }

	  public function setCache($key, $val, int $time = 0): bool {
		 if (self::$memcache_connection) {
			if ($time === 0 && self::$cacheTime !== 0) $time = self::$cacheTime;
			return self::$memcache_connection->set($key, $val, $time);
		 }
		 return false;
	  }

	  public function getCache($key): string|bool {
		 if (self::$memcache_connection) return self::$memcache_connection->get($key);
		 return false;
	  }

	  public function deleteCache($key): bool {
		 if (self::$memcache_connection) return self::$memcache_connection->delete($key);
		 return false;
	  }

	  public function resetCache(): bool {
		 if (self::$memcache_connection) {
			self::$memcache_connection->flush(0);
			$keys = $this->getAllKeys();
			if ($keys) {
			   foreach ($keys as $key) {
				  $this->deleteCache($key);
			   }
			}
			return true;
		 }
		 return false;
	  }

	  public function getAllKeys(): array|bool {
		 if (self::$memcache_connection) return self::$memcache_connection->getAllKeys();
		 return false;
	  }

	  public function getStatus(): array|bool {
		 if (self::$memcache_connection) return self::$memcache_connection->getStats();
		 return false;
	  }

	  public function __destruct() {
		 self::$memcache_connection = null;
		 //        $this->setLog("Close", __CLASS__);
	  }
   }
