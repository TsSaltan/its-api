<?php 
/**
 * itsAPI
 * @version 1.0
 * @link https://dev.tssaltan.top
 */
namespace itsAPI;

class itsAPI {
	private static $baseURI = 'https://dev.tssaltan.top/api/',
				   $apiVersion = 'v1';

	public static function configure(string $baseURI, string $apiVersion){
		if(filter_var($baseURI, FILTER_VALIDATE_URL) !== false){
			self::$baseURI = $baseURI;
		}

		if(preg_match('#v[0-9\.]+#Ui', $apiVersion) !== false){
			self::$apiVersion = $apiVersion;
		}
	}

	public static function getBaseURI(): string {
		return self::$baseURI;
	}

	public static function getApiVersion(): string {
		return self::$apiVersion;
	}

	private $publicKey = null, 
			$privateKey = null;

	public function __construct(?string $publicKey = null, ?string $privateKey = null){
		$this->publicKey = $publicKey;
		$this->privateKey = $privateKey;
	}

	public function put(string $method, array $params = []): array {
		return self::query('PUT', $method, $params);
	}

	public function delete(string $method, array $params = []): array {
		return self::query('DELETE', $method, $params);
	}

	public function get(string $method, array $params = []): array {
		return self::query('GET', $method, $params);
	}

	public function post(string $method, array $params = []): array {
		return self::query('POST', $method, $params);
	}

	private function query(string $httpMethod, string $apiMethod, array $params = []): array {
		$httpMethod = strtoupper($httpMethod);
		$ch = curl_init(self::$baseURI . self::$apiVersion . '/' . $apiMethod . ($httpMethod == 'GET' ? '?' .  http_build_query($params) : ''));
		$headers = [];

		if(strlen($this->publicKey) > 0){
			$headers[] = 'X-API-Key: ' . $this->publicKey;
		}
		
		if(strlen($this->privateKey) > 0){
			$headers[] = 'X-API-Private: ' . $this->privateKey;
		}
		
		curl_setopt_array($ch, [
			CURLOPT_CUSTOMREQUEST => $httpMethod,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_HTTPHEADER => $headers
		]);

		if(sizeof($params) > 0 && $httpMethod != 'GET'){
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
		}

		$answer = curl_exec($ch);
		if(!$answer){
			throw new itsException('Invalid query ' . $httpMethod . ' ' . $apiMethod);
		}

		$httpCode = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
		$result = json_decode($answer, true);

		if(!is_array($result)){
			$result = ['response' => $answer];
		}
		$result['http_code'] = $httpCode;

		return $result;
	}
}
?>