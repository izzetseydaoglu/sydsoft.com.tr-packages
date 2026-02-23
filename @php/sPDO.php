<?php
   /**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 8.04.2024 01:35
 */

   namespace _slib_php;

   use Exception;
   use JetBrains\PhpStorm\ArrayShape;
   use mainBase;
   use PDO;

   class sPDO {

	  // Connection Params
	  public static mixed $connectionConfig = null;
	  public static mixed $connection = null;
	  public static string|null $mysql_host = null;
	  public static string|null $mysql_user = null;
	  public static string|null $mysql_password = null;

	  // SQL Params
	  private string|null $db = null;
	  private string|null $table = null;
	  private string|null $where = null;
	  private string|null $select = "*";
	  private string|null $order = "ORDER BY id asc";
	  private string|null $group = null;
	  private string|null $limit = null;
	  private string|null $query = null;
	  private array $queryParams = [];
	  private array $queryParamsType = [];

	  public function __construct(array $config_sSQL = []) {
//        $this->setLog("Open", __CLASS__);
//		 if (is_null(self::$mysql_host) && $GLOBALS["config_sSQL"]["mysql_host"]) {
//			self::$mysql_host = $GLOBALS["config_sSQL"]["mysql_host"];
//		 }
//		 if (is_null(self::$mysql_user) && $GLOBALS["config_sSQL"]["mysql_user"]) {
//			self::$mysql_user = $GLOBALS["config_sSQL"]["mysql_user"];
//		 }
//		 if (is_null(self::$mysql_password) && $GLOBALS["config_sSQL"]["mysql_password"]) {
//			self::$mysql_password = $GLOBALS["config_sSQL"]["mysql_password"];
//		 }
//		 if (is_null($this->db) && $GLOBALS["config_sSQL"]["mysql_db"]) {
//			$this->db = $GLOBALS["config_sSQL"]["mysql_db"];
//		 }

		 if (count($config_sSQL) > 0) {
			self::$connectionConfig = $config_sSQL;
		 }
		 if ((is_null(self::$mysql_host) || is_null(self::$mysql_user) || is_null(self::$mysql_password)) &&
			$config_sSQL["mysql_host"] && $config_sSQL["mysql_user"] && $config_sSQL["mysql_password"]) {
			$this->setConnection($config_sSQL["mysql_host"], $config_sSQL["mysql_user"], $config_sSQL["mysql_password"]);
		 }
	  }

	  public function setLog($log, $title = null): void {
		 mainBase::setDebug($log, $title);
	  }

	  private function setQueryParams($parameter, mixed $type = PDO::PARAM_STR): void {
		 $this->queryParams [] = $parameter;
		 $this->queryParamsType [] = $type;
	  }

	  public function setConnection(string $host, string $user, string $password): void {
		 self::$mysql_host = $host;
		 self::$mysql_user = $user;
		 self::$mysql_password = $password;
	  }

	  public function setDb(string $db): void {
		 $this->db = $db;
	  }

	  public function setTable(string $table): void {
		 $this->table = $table;
	  }

	  public function setSelect(string $select): void {
		 $this->select = $this->cleanSpace($select);
	  }

	  public function setWhere(array $where): void {
		 $whereList = null;
		 if (is_array($where[array_key_first($where)])) {
			foreach ($where as $list) {
			   $whereList = [];
			   $inside_operator = $list["inside_operator"] ?? "and";
			   $outside_operator = $list["outside_operator"] ?? "or";
			   foreach ($list["list"] as $row) {
				  $key = $row[0];
				  $operator = strtolower(trim($row[1]));
				  $value = $row[2];
				  switch ($operator) {
					 case "not find_in_set":
					 case "find_in_set":
						$whereList[] = $operator . '(?, ' . $key . ')';
						$this->setQueryParams($value);
						break;
					 case "not in":
					 case "in":
						$value_soruisareti = [];
						foreach (explode(",", $value) as $value_row) {
						   $value_soruisareti[] = '?';
						   $this->setQueryParams($value_row, PDO::PARAM_INT);
						}
						$whereList[] = $key . ' ' . $operator . ' (' . implode(",", $value_soruisareti) . ')';
						break;
					 default:
						$whereList[] = $key . ' ' . $operator . ' ?';
						$this->setQueryParams($value);
						break;
				  }
			   }
			   $combine = "(" . implode(" " . $inside_operator . " ", $whereList) . ")";
			   if (is_null($this->where)) {
				  $this->where = "WHERE " . $combine;
			   } else {
				  $this->where .= " " . $outside_operator . " " . $combine;
			   }
			}
		 } else {
			foreach ($where as $key => $value) {
			   $whereList[] = $key . '=?';
			   $this->setQueryParams($value);
			}
			$combine = "(" . implode(" and ", $whereList) . ")";
			$this->where = "WHERE " . $combine;
		 }
	  }

	  public function setOrder(string $order): void {
		 $this->order = "ORDER BY " . $this->cleanSpace($order);
	  }

	  public function setGroup(string $group): void {
		 $this->group = "GROUP BY " . $this->cleanSpace($group);
	  }

	  public function setLimit(string $limit): void {
		 $this->limit = "LIMIT " . $this->cleanSpace($limit);
	  }

	  private function connectMySQL(): void {
		 global $sSQL_Connections;
		 $conKey = self::$mysql_host . $this->db;
		 /** Boş veya tanımlanan ana DB'den farklıysa tekrar bağlan */
		 if (empty($sSQL_Connections[$conKey]) || $this->db !== self::$connectionConfig["mysql_db"]) {
			if (class_exists('PDO')) {
			   try {
				  self::$connection = new PDO("mysql:host=" . self::$mysql_host . ";dbname=" . $this->db, self::$mysql_user, self::$mysql_password);
				  self::$connection->exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
				  self::$connection->exec("SET sql_mode=''");
//                  self::$pdo_connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
				  self::$connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
				  self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				  self::$connection->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
				  if ($this->db === self::$connectionConfig["mysql_db"]) {
					 $sSQL_Connections[$conKey] = self::$connection;
				  }
				  $this->setLog("Connected", "MYSQL");
				  $this->setLog("Connected DB: " . $this->db, "MYSQL_DB");
			   } catch (Exception $e) {
				  $this->setLog("Can not connect DB: " . $this->db, "MYSQL");
				  $this->setLog("FATAL ERROR => " . $e->getMessage(), "MYSQL");
				  die($e->getMessage());
			   }
			} else {
			   die("PDO extention not loaded");
			}
		 } else {
			$this->setLog("Already connected", "MYSQL");
			$this->setLog("Connected DB:" . $this->db, "MYSQL_DB");
			self::$connection = $sSQL_Connections[$conKey];
		 }
	  }

	  private function setQuery($query): void {
		 $this->query = $query;
		 $this->setQueryWhere();
		 $this->setQueryGroup();
		 $this->setQueryOrder();
		 $this->setQueryLimit();
		 $this->setLog($this->query, "MYSQL_QUERY_PREPARE");
		 $this->setLog(implode(",", $this->queryParams), "MYSQL_QUERY_PARAMS");
		 $this->setLog($this->fillQuery($this->query, $this->queryParams), "MYSQL_QUERY_FILLED");
	  }

	  private function setQueryWhere(): void {
		 if (!is_null($this->where)) {
			$this->query .= " " . $this->where;
		 }
	  }

	  private function setQueryGroup(): void {
		 if (!is_null($this->group)) {
			$this->query .= " " . $this->group;
		 }
	  }

	  private function setQueryOrder(): void {
		 if (!is_null($this->order)) {
			$this->query .= " " . $this->order;
		 }
	  }

	  private function setQueryLimit(): void {
		 if (!is_null($this->limit)) {
			$this->query .= " " . $this->limit;
		 }
	  }

	  public function setInsertUpdateQuery(string $operation, array $data): void {
		 if (empty($operation)) {
			die("Choose a operation => insert or update");
		 }
		 /** Öncelikle $this->queryParams = [] olarak ayarlanmalı. setWhere önce yazılmış ise sıra karışır **/
		 $params = [];
		 $paramsType = [];
		 $dataList = [];
		 foreach ($data as $key => $value) {
			$dataList[] = $key . "=?";
			$params[] = $value;
			$paramsType[] = PDO::PARAM_STR;
		 }
		 if ($operation === "insert") {
			$query = "INSERT INTO " . $this->db . "." . $this->table . " SET ";
			$query .= implode(", ", $dataList);
			$this->query = $query;
			$this->queryParams = $params;
			$this->queryParamsType = $paramsType;
			$this->setLog($this->query, "MYSQL_QUERY_PREPARE");
			$this->setLog($this->fillQuery($this->query, $params), "MYSQL_QUERY_FILLED");
		 }
		 if ($operation === "update") {
			$query = "UPDATE " . $this->db . "." . $this->table . " SET ";
			$query .= implode(", ", $dataList);
			/** Paramsları birleştir, önce params, sonra where paramslarını içeren queryParams yazılır*/
			$this->queryParams = array_merge($params, $this->queryParams);
			$this->queryParamsType = array_merge($paramsType, $this->queryParamsType);
			$this->setQuery($query);
		 }
	  }

	  #[ArrayShape(["dbMD5" => "string", "tableMD5" => "string", "queryMD5" => "string", "query" => "string"])]
	  public function getMD5(): array|false {
		 $combineQueryParams = "SELECT " . $this->select;
		 $combineQueryParams .= " FROM " . $this->db;
		 $combineQueryParams .= "." . $this->table;
		 $combineQueryParams .= " " . $this->fillQuery($this->where, $this->queryParams);
		 $combineQueryParams .= " " . $this->group;
		 $combineQueryParams .= " " . $this->order;
		 $combineQueryParams .= " " . $this->limit;
		 return [
			"dbMD5" => md5(strtolower($this->db)),
			"tableMD5" => md5(strtolower($this->table)),
			"queryMD5" => md5(strtolower($combineQueryParams)),
			"query" => $combineQueryParams,
		 ];
	  }

	  public function fetch(): array|bool {
		 try {
			$this->connectMySQL();
			$this->setLimit("1");
			$this->setQuery("SELECT " . $this->select . " FROM " . $this->db . "." . $this->table);
			$sql = self::$connection->prepare($this->query);
//            $sql->execute($this->queryParams);
			foreach ($this->queryParams as $key => $value) {
			   $sql->bindValue($key + 1, $value, $this->queryParamsType[$key]);
			}
			$sql->execute();
			$this->setLog($sql->queryString, "MYSQL_FINALIZE_QUERY");
			$query = $sql->fetch(PDO::FETCH_ASSOC);
			if ($query) {
			   return $query;
			}
		 } catch (Exception $e) {
			$this->setLog("ERROR => " . $e->getMessage(), "MYSQL");
		 }
		 return false;
	  }

	  public function fetchAll(): array|bool {
		 try {
			$this->connectMySQL();
			$this->setQuery("SELECT " . $this->select . " FROM " . $this->db . "." . $this->table);
			$sql = self::$connection->prepare($this->query);
//            $sql->execute($this->queryParams);
			foreach ($this->queryParams as $key => $value) {
			   $sql->bindValue($key + 1, $value, $this->queryParamsType[$key]);
			}
			$sql->execute();
			if ($sql->rowCount()) {
			   return $sql->fetchAll();
			}
		 } catch (Exception $e) {
			$this->setLog("ERROR => " . $e->getMessage(), "MYSQL");
		 }
		 return false;
	  }

	  public function insert(array $data): string|int|bool {
		 try {
			$this->connectMySQL();
			$this->setInsertUpdateQuery("insert", $data);
			$sql = self::$connection->prepare($this->query);
//            $insert = $sql->execute($this->queryParams);
			foreach ($this->queryParams as $key => $value) {
			   $sql->bindValue($key + 1, $value, $this->queryParamsType[$key]);
			}
			if ($sql->execute()) {
			   $lastID = self::$connection->lastInsertId();
			   $this->setLog("Successful => Last Insert ID: " . $lastID, "MYSQL");
			   return $lastID;
			}
		 } catch (Exception $e) {
			$this->setLog("ERROR => " . $e->getMessage(), "MYSQL");
		 }
		 return false;
	  }

	  public function update(array $data): array|false {
		 try {
			$this->connectMySQL();
			$this->setInsertUpdateQuery("update", $data);
			$sql = self::$connection->prepare($this->query);
//            $update = $sql->execute($this->queryParams);
			foreach ($this->queryParams as $key => $value) $sql->bindValue($key + 1, $value, $this->queryParamsType[$key]);
			if ($sql->execute()) {
			   $this->setLog("Successful => Update", "MYSQL");
			   return [
				  "result" => true,
				  "rowCount" => $sql->rowCount(),
			   ];
			}
		 } catch (Exception $e) {
			$this->setLog("ERROR => " . $e->getMessage(), "MYSQL");
		 }
		 return false;
	  }

	  public function delete(): bool|array {
		 try {
			$this->connectMySQL();
			$this->setQuery("DELETE FROM " . $this->db . "." . $this->table);
			$sql = self::$connection->prepare($this->query);
			foreach ($this->queryParams as $key => $value) {
			   $sql->bindValue($key + 1, $value, $this->queryParamsType[$key]);
			}
			if ($sql->execute()) {
			   $this->setLog("Successful => Delete", "MYSQL");
			   return [
				  "result" => true,
				  "rowCount" => $sql->rowCount(),
			   ];
			}
		 } catch (Exception $e) {
			$this->setLog("ERROR => " . $e->getMessage(), "MYSQL");
		 }
		 return false;
	  }

	  public function getFields(): bool|array {
		 try {
			$this->connectMySQL();
			$sql = self::$connection->prepare("DESCRIBE " . $this->db . "." . $this->table);
			$sql->execute();
			return $sql->fetchAll(PDO::FETCH_COLUMN);
		 } catch (Exception $e) {
			$this->setLog("ERROR => " . $e->getMessage(), "MYSQL");
		 }
		 return false;
	  }

	  public function queryExec($query): bool|array {
		 try {
			$this->connectMySQL();
			return self::$connection->exec($query);
		 } catch (Exception $e) {
			$this->setLog("ERROR => " . $e->getMessage(), "MYSQL");
		 }
		 return false;
	  }

	  public function fillQuery($query, $params): array|string|null {
		 if (empty($query)) {
			return null;
		 }
		 $keys = [];
		 $values = $params;
		 # build a regular expression for each parameter
		 foreach ($params as $key => $value) {
			if (is_string($key)) {
			   $keys[] = '/:' . $key . '/';
			} else {
			   $keys[] = '/[?]/';
			}
			if (is_string($value)) {
			   $values[$key] = "'" . $value . "'";
			} else if (is_array($value)) {
			   $values[$key] = "'" . implode("','", $value) . "'";
			} else if (is_null($value)) {
			   $values[$key] = 'NULL';
			} else if (empty($value)) {
			   $values[$key] = '';
			} else {
			   $values[$key] = $value;
			}
		 }
		 return preg_replace($keys, $values, $query, 1);
	  }

	  public function cleanSpace($data): string {
		 return trim(preg_replace("/\s+/", " ", $data));
	  }

	  public function __destruct() {
		 self::$connection = null;
	  }
   }





   /* ----Where Şemaları----
        $wherelist = [
            [
                "list" => [
                    ["id", "=", "1"],
                    ["email", "=", "izzetseydaoglu@gmail.com"],
                ],
                "inside_operator" => "and",
            ], [
                "list" => [
                    ["id", "=", "2"],
                    ["email", "=", "seydaogluizzet@gmail.com"],
                ],
                "inside_operator" => "and",
                "outside_operator" => "or",
            ]
        ];

        $wherelist = ["id" => "1","email"=>"izzet"];
     */

