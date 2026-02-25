<?php

/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-24 02:58:27
 */

namespace _sydSOFT_PHPBase;

use DateTime;
use MainBase;

class SYDSQL
{
    private mixed $config_sSQL = null;
    private ?string $mysql_db = null;
    private ?string $cacheID = null;
    private int $cacheTime = 0;    /* 0=indefinite, 60=1 minute*/

    public function __construct(array $config_sSQL = [])
    {
        $this->setLog("Open", __CLASS__);
        if (count($config_sSQL) > 0) {
            $this->config_sSQL = $config_sSQL;
        } elseif ($GLOBALS["config_sSQL"]) {
            $this->config_sSQL = $GLOBALS["config_sSQL"];
        } else {
            die("FATAL ERROR => config_sSQL is not defined...");
        }
        if (is_null($this->mysql_db)) {
            $this->mysql_db = $this->config_sSQL["mysql_db"];
        }
        if (is_null($this->cacheID) && isset($this->config_sSQL["cacheID"])) {
            $this->setCacheID($this->config_sSQL["cacheID"]);
        }
    }

    public function setLog($log, $title = null): void
    {
        MainBase::setDebug($log, $title);
    }

    public function getTime(string|DateTime $datetime = "NOW", string $format = "Y-m-d H:i:s"): string
    {
        try {
            $datetime = new DateTime($datetime);
            return $datetime->format($format);
        } catch (\Exception $e) {
            return false;
        }
    }

    public function setMysqlDb(string $mysql_db): void
    {
        $this->mysql_db = $mysql_db;
        MainBase::setDebug("Set MySQL: " . $mysql_db, "sSQL");
    }

    public function setCacheID(string|int|null $cacheID): void
    {
        $this->cacheID = $cacheID;
        MainBase::setDebug("Set cacheID: " . $cacheID, "sSQL");
    }

    public function setCacheTime(int $cacheTime): void
    {
        $this->cacheTime = $cacheTime;
        MainBase::setDebug("Set cacheTime: " . $cacheTime, "sSQL");
    }

    private function getQueryCacheKey(array $md5): string
    {
        $dbMD5 = $md5["dbMD5"];
        $tableMD5 = $md5["tableMD5"];
        $queryMD5 = $md5["queryMD5"];
        $sMemcache = new SYDMEMCACHE();
        $tableKey = $sMemcache->getCache($dbMD5 . $tableMD5);
        if (!$tableKey) {
            $tableKey = $this->createRandomKey(6);
            $sMemcache->setCache($dbMD5 . $tableMD5, $tableKey, $this->cacheTime);
            $this->setLog("Create tableKey: " . $tableKey, "MEMCACHE");
        } else {
            $this->setLog("tableKey: " . $tableKey, "MEMCACHE");
        }
        $cacheIDKey = null;
        if (!is_null($this->cacheID)) {
            $cacheIDKey = $sMemcache->getCache($dbMD5 . $tableMD5 . $this->cacheID);
            /** $dbMD5 . $tableMD5 . $this->cacheID sıralaması önemli, yenilendiğinde yalnızca o tablodaki cacheleri siliniyor*/
            if (!$cacheIDKey) {
                $cacheIDKey = $this->createRandomKey(6);
                $sMemcache->setCache($dbMD5 . $tableMD5 . $this->cacheID, $cacheIDKey, $this->cacheTime);
                $this->setLog("Create cacheIDKey: " . $cacheIDKey, "MEMCACHE");
            } else {
                $this->setLog("cacheIDKey: " . $cacheIDKey, "MEMCACHE");
            }
        }
        $queryCacheKey = $cacheIDKey . $dbMD5 . $tableKey . $queryMD5;
        $this->setLog("Query Key: " . $queryCacheKey, "MEMCACHE");
        return $queryCacheKey;
    }

    private function reNewQueryCacheKey(array $md5): void
    {
        $dbMD5 = $md5["dbMD5"];
        $tableMD5 = $md5["tableMD5"];
        $sMemcache = new SYDMEMCACHE();
        if (is_null($this->cacheID)) {
            /** cacheID yoksa tableKey yenile, tableKey yenilendiğinde tüm alt CacheID'ler de boşa düşüyor, güncellenmiş oluyor. */
            $tableKey = $this->createRandomKey(6);
            $sMemcache->setCache($dbMD5 . $tableMD5, $tableKey, $this->cacheTime);
            $this->setLog("Renew tableKey: " . $tableKey, "MEMCACHE");
        } else {
            /** cacheID varsa tableKey değişmesin, cacheIDKey yenilensin */
            $cacheIDKey = $this->createRandomKey(6);
            $sMemcache->setCache($dbMD5 . $tableMD5 . $this->cacheID, $cacheIDKey, $this->cacheTime);
            $this->setLog("Renew cacheIDKey: " . $cacheIDKey, "MEMCACHE");
        }
    }

    public function getResult(string $tableName = null, array $where = [], array $otherConfig = null, bool $noCache = false)
    {
        if (empty($tableName) || (!count($where)) > 0) {
            return false;
        }
        $sPDO = new SYDPDO($this->config_sSQL);
        $sPDO->setDb($this->mysql_db);
        $sPDO->setTable($tableName);
        $sPDO->setWhere($where);

        if ($otherConfig) {
            if (isset($otherConfig["SELECT"])) {
                $sPDO->setSelect($otherConfig["SELECT"]);
            }
            if (isset($otherConfig["GROUP"])) {
                $sPDO->setGroup($otherConfig["GROUP"]);
            }
            if (isset($otherConfig["ORDER"])) {
                $sPDO->setOrder($otherConfig["ORDER"]);
            }
            if (isset($otherConfig["LIMIT"])) {
                $sPDO->setLimit($otherConfig["LIMIT"]);
            }
        }
        if ($noCache) {
            $result = $sPDO->fetch();
            if ($result) {
                $this->setLog("Result found via MYSQL", "MYSQL");
            } else {
                $this->setLog("No results found in the database", "MYSQL");
            }
            return $result;
        }

        $getMD5 = $sPDO->getMD5();
        $cacheKey = $this->getQueryCacheKey($getMD5);
        $sMemcache = new SYDMEMCACHE();
        $cached = $sMemcache->getCache($cacheKey);
        if ($cached) {
            $this->setLog("MYSQL QUERY for MEMCACHE => " . $getMD5["query"], "MEMCACHE");
            $result = unserialize($cached, ["allowed_classes" => false]);
            if ($result) {
                $this->setLog("Result found via MEMCACHE", "MEMCACHE");
            } else {
                $this->setLog("No results found in the MEMCACHE. This result, cached", "MEMCACHE");
            }
            return $result;
        }

        $this->setLog("No results found on MEMCACHE. Now, querying in MYSQL.", "MEMCACHE");
        $result = $this->getResult($tableName, $where, $otherConfig, true);
        if ($result) {
            $sMemcache->setCache($cacheKey, serialize($result), $this->cacheTime);
            $this->setLog("Result found and cached", "MYSQL");
        } else {
            $sMemcache->setCache($cacheKey, serialize(false), $this->cacheTime);
            $this->setLog("No results found and cached", "MYSQL");
        }
        return $result;
    }

    public function getResults(string $tableName = null, array $where = [], array $otherConfig = null, bool $noCache = false)
    {
        if (empty($tableName)) {
            return false;
        }
        $sPDO = new SYDPDO($this->config_sSQL);
        $sPDO->setDb($this->mysql_db);
        $sPDO->setTable($tableName);
        if (count($where) > 0) {
            $sPDO->setWhere($where);
        }
        if ($otherConfig) {
            if (isset($otherConfig["SELECT"])) {
                $sPDO->setSelect($otherConfig["SELECT"]);
            }
            if (isset($otherConfig["GROUP"])) {
                $sPDO->setGroup($otherConfig["GROUP"]);
            }
            if (isset($otherConfig["ORDER"])) {
                $sPDO->setOrder($otherConfig["ORDER"]);
            }
            if (isset($otherConfig["LIMIT"])) {
                $sPDO->setLimit($otherConfig["LIMIT"]);
            }
        }
        if ($noCache) {
            $result = $sPDO->fetchAll();
            if ($result) {
                $this->setLog("Results found via MYSQL", "MYSQL");
            } else {
                $this->setLog("No results found in the database", "MYSQL");
            }
            return $result;
        }
        $getMD5 = $sPDO->getMD5();
        $cacheKey = $this->getQueryCacheKey($getMD5);
        $sMemcache = new SYDMEMCACHE();
        $cached = $sMemcache->getCache($cacheKey);
        if ($cached) {
            $this->setLog("MYSQL QUERY for MEMCACHE => " . $getMD5["query"], "MEMCACHE");
            $result = unserialize($cached, ["allowed_classes" => false]);
            if ($result) {
                $this->setLog("Results found via MEMCACHE", "MEMCACHE");
            } else {
                $this->setLog("No results found in the MEMCACHE. This result, cached", "MEMCACHE");
            }
            return $result;
        }
        $this->setLog("No results found on MEMCACHE. Now, querying in MYSQL.", "MEMCACHE");
        $result = $this->getResults($tableName, $where, $otherConfig, true);
        if ($result) {
            $sMemcache->setCache($cacheKey, serialize($result), $this->cacheTime);
            $this->setLog("Result found and cached", "MYSQL");
        } else {
            $sMemcache->setCache($cacheKey, serialize(false), $this->cacheTime);
            $this->setLog("No results found and cached", "MYSQL");
        }
        return $result;
    }

    public function getResultsWithFilter(string $tableName = null, array $where = [], array $otherConfig = null, bool $noCache = false): array
    {
        $result = $this->getResults($tableName, $where, $otherConfig, $noCache);
        if ($result) {
            $count = $this->getResults($tableName, $where, ["SELECT" => "COUNT(*) as count", "LIMIT" => null], $noCache);
            return [
                "rows" => $result,
                "count" => (int) $count[0]["count"],
            ];
        }
        return [
            "rows" => false,
            "count" => 0,
        ];
    }

    public function filter(string $getField = "id", array|bool $queryResult = []): array|bool
    {
        if ($queryResult) {
            $result = [];
            foreach ($queryResult as $oku) {
                if (!(in_array($oku[$getField], $result, true))) {
                    $result[] = $oku[$getField];
                }
            }
            return $result;
        }
        return false;
    }

    public function insert(string $tableName = null, array $data = []): bool|int|string
    {
        if (empty($tableName) || (!count($data)) > 0) {
            return false;
        }
        $sPDO = new SYDPDO($this->config_sSQL);
        $sPDO->setDb($this->mysql_db);
        $sPDO->setTable($tableName);
        $insert = $sPDO->insert($data);
        if ($insert) {
            $this->reNewQueryCacheKey($sPDO->getMD5());
            return $insert;
        }
        return false;
    }

    public function update(string $tableName = null, array $where = [], array $data = []): bool|array
    {
        if (empty($tableName) || (!count($where)) > 0 || (!count($data)) > 0) {
            return false;
        }
        $sPDO = new SYDPDO($this->config_sSQL);
        $sPDO->setDb($this->mysql_db);
        $sPDO->setTable($tableName);
        $sPDO->setWhere($where);
        $update = $sPDO->update($data);
        if ($update) {
            $this->reNewQueryCacheKey($sPDO->getMD5());
            return $update;
        }
        return false;
    }

    public function delete(string $tableName = null, array $where = []): bool
    {
        if (empty($tableName) || (!count($where)) > 0) {
            return false;
        }
        $sPDO = new SYDPDO($this->config_sSQL);
        $sPDO->setDb($this->mysql_db);
        $sPDO->setTable($tableName);
        $sPDO->setWhere($where);
        $delete = $sPDO->delete();
        if ($delete) {
            $this->reNewQueryCacheKey($sPDO->getMD5());
            return true;
        }
        return false;
    }

    public function insertUpdate(string $tableName = null, array $where = [], array $data = []): bool|int|string|array
    {
        if (empty($tableName) || (!count($data)) > 0) {
            return false;
        }
        $check = $this->getResult($tableName, $where, ["SELECT" => "id"], true);
        if ($check) {
            //Varsa güncele
            return $this->update($tableName, $where, $data);
        }
        //Yoksa ekle
        return $this->insert($tableName, $data);
    }

    public function getFields(string $tableName = null, bool $noCache = false)
    {
        if (empty($tableName)) {
            return false;
        }
        $this->setCacheID(null);
        $sPDO = new SYDPDO($this->config_sSQL);
        $sPDO->setDb($this->mysql_db);
        $sPDO->setTable($tableName);
        $sPDO->setSelect("DESCRIBE"); // Cache karışmasın diye eklendi, bir özelliği yok. QueryCache sorgusu için
        if ($noCache) {
            $result = $sPDO->getFields();
            if ($result) {
                $this->setLog("Result found via MYSQL", "MYSQL");
            } else {
                $this->setLog("No results found in the database", "MYSQL");
            }
            return $result;
        }

        $getMD5 = $sPDO->getMD5();
        $cacheKey = $this->getQueryCacheKey($getMD5);
        $sMemcache = new SYDMEMCACHE();
        $cached = $sMemcache->getCache($cacheKey);
        if ($cached) {
            $this->setLog("MYSQL QUERY for MEMCACHE => " . $getMD5["query"], "MEMCACHE");
            $result = unserialize($cached, ["allowed_classes" => false]);
            if ($result) {
                $this->setLog("Result found via MEMCACHE", "MEMCACHE");
            } else {
                $this->setLog("No results found in the MEMCACHE. This result, cached", "MEMCACHE");
            }
            return $result;
        }

        $this->setLog("No results found on MEMCACHE. Now, querying in MYSQL.", "MEMCACHE");
        $result = $this->getFields($tableName, true);
        if ($result) {
            $sMemcache->setCache($cacheKey, serialize($result), $this->cacheTime);
            $this->setLog("Result found and cached", "MYSQL");
        } else {
            $sMemcache->setCache($cacheKey, serialize(false), $this->cacheTime);
            $this->setLog("No results found and cached", "MYSQL");
        }
        return $result;
    }

    public function createRandomKey($length = 10): string
    {
        return str_shuffle(substr(str_repeat(time() . md5(mt_rand()), 21 + (int) $length), 0, (int) $length));
    }

    public function __destruct()
    {
        //        $GLOBALS["config_sSQL"]["pdo_connection"] = "test";
        //        $this->setLog("Close", __CLASS__);
    }

}
