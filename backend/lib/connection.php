<?php
class DB extends mysqli {
	public function __construct($host, $user, $pass, $db, $port, $socket, $charset) {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        parent::__construct($host, $user, $pass, $db, $port, $socket);
        $this->set_charset($charset);
		if($this->connect_error)
		{
			die("$this->connect_errno: $this->connect_error");
		}
    }
	public function record_exists($table, $conditions) {
		$req = "SELECT * FROM `$table` ".$this->conditions_to_string($conditions);
		return $this->record_exists_sql($req);
	}
	public function record_exists_sql($sql) {
		$res = $this->query($sql);
		if(!$res) return false;
		$fetch = $res->fetch_all();
		if(count($fetch) == 0) return false;
		return true;
	}
	public function has_field($table, $field, $conditions) {
		$req = "SELECT `$field` FROM `$table` ".$this->conditions_to_string($conditions);
		if(!$this->query($req)) return false;
		return true;
	}
	public function has_field_sql($sql) {
		$res = $this->query($sql);
		if(!$res) return false;
		$fetch = $res->fetch_all();
		if(count($fetch) == 0) return false;
		return true;
	}
	public function set_field($table, $field, $newvalue, $conditions=array()) {
		if(!$this->has_field($table, $field, $conditions))return false;
		$req = "UPDATE `$table` SET `$field`='$newvalue' ".$this->conditions_to_string($conditions);
		$test = $this->query($req);
		if(!$test) {
			printf("Invalid query: %s\nWhole query: %s<br>", $this->error, $req);
		}
		return $test;
	}
	public function insert_record($table, $record) {
		$req = "INSERT INTO `$table` (";
		end($record);
		$endkey = key($record);
		foreach($record as $key=>$rec) {
			$req .= "`".$key."`";
			if($key != $endkey) $req .= ", ";
		}
		$req.= ") VALUES (";
		
		foreach($record as $key=>$rec) {
			$req .= "'".$rec."'";
			if($key != $endkey) $req .= ", ";
		}
		$req .= ")";
		return $this->query($req);
	}
	public function insert_records($table, $recordarray) {
		foreach($recordarray as $record) {
			$this->insert_record($table, $record);
		}
		return true;
	}
	public function get_field_sql($sql) {
		$result = $this->query($sql);
		if(!$result) return false;
		$fetch = $result->fetch_all();
		if(count($fetch) == 0)
			return false;
		$return = $fetch[0][0];
		if($this->more_results())
			$this->next_result();
		else 
			$result->close();
		return $return;
	}
	public function get_field($table, $field, $conditions) {
		if(!$this->has_field($table, $field, $conditions)) return false;
		$req = "SELECT `$field` FROM `$table` ".$this->conditions_to_string($conditions);
		return $this->get_field_sql($req);
	}
	public function get_record($table, $conditions) {
		if(!$this->record_exists($table, $conditions)) return false;
		$req = "SELECT * FROM `$table` ".$this->conditions_to_string($conditions);
		return $this->get_record_sql($req);
	}
	public function get_record_sql($sql) {
		$result = $this->query($sql);
		$return = $result->fetch_array(MYSQLI_ASSOC);
		if($this->more_results())
			$this->next_result();
		else
			$result->close();
		return $return;
	}
	public function get_records($table, $conditions=array()) {
		if(!$this->record_exists($table, $conditions)) return false;
		$req = "SELECT * FROM `$table` ".$this->conditions_to_string($conditions);
		return $this->get_records_sql($req);
	}
	public function get_records_sql($sql) {
		$result = $this->query($sql);
		$allrecords = array();
		while($record = $result->fetch_array(MYSQLI_ASSOC)) {
			array_push($allrecords, $record);
		}
		while($this->more_results())
			$this->next_result();
		$result->close();
		
		return $allrecords;
	}
	public function print_table($table, $conditions=array()) {
		$tablecontent = $this->get_records($table, $conditions);
		$return = "<div style='overflow-x: auto;'><table class='t01'>";
		$return .= "<tr>";
		foreach($tablecontent[0] as $key => $trash) {
			$return .= "<th>".$key."</th>";
		}
		$return .= "</tr>";
		foreach($tablecontent as $key=>$row) {
			$return .= "<tr>";
				foreach($row as $entry) {
					$return .= "<td>".$entry."</td>";
				}
			$return .= "</tr>";
		}
		$return .= "</table></div>";
		return $return;
	}
	public function conditions_to_string($conditions=array()) {
		$conditionString = "WHERE ";
		if(count($conditions) == 0) {
			$conditionString .= '1';
			return $conditionString;
		}
		foreach($conditions as $name=>$condition) {
			$conditionString .= "`".$name."`='".$condition."'";
			if(key(array_slice($conditions, -1, 1, true)) != $name) $conditionString .= " AND ";
		}
		return $conditionString;
	}
}
date_default_timezone_set('Europe/Zurich');
$hostname="p:localhost";
$dbname="--------";
$username="--------";
$password="--------";
$DB = new DB($hostname, $username, $password, $dbname, 3306, null, 'utf8mb4');



?>
