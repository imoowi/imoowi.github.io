---
layout: default
title:  "EasyPHP Framework"
parent: Lib
---

# EasyPHP Framework
- distributedLock.php

```bash
  <?php
/**
 * @desc 添加分布式锁
 * @author yuanjun<imoowi@qq.com>
 * @param int $signId
 * @return bool
 */
function addDistributedLock($uid=0){
    $redis = redis_connect();
    $redis->select(2);
    $key = 'sign:signlock:'.$uid;
    $expire = 10;
    $lock = $redis->set($key, $uid, ["NX", "EX" => $expire]);
    return $lock;
}

/**
 * @desc 删除分布式锁
 * @author yuanjun<imoowi@qq.com>
 * @param int $signId
 */
function delDistributedLock($uid=0){
    $redis = redis_connect();
    $redis->select(2);
    $key = 'sign:signlock:'.$uid;
    $identification = $uid;
    $script = <<< EOF
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
EOF;
    $redis->evaluate($script, [$key, $identification], 1);
}
  ```
- EasyConfig.php
  
```php
<?php
namespace lib\easy_php;
class EasyConfig {
	private $confDir = '';
	/**
	 * 构造函数
	 * 
	 * @param
	 *        	NULL
	 * @return NULL
	 */
	public function __construct() {
		$this->confDir = CONFIG_DIR;
		if (! file_exists ( $this->confDir )) {
			exit ( 'ERROR: 亲，请设定配置文件目录[CONFIG_DIR]先！' );
		}
	}
	public function setConfDir($dir){
		$Config = self::_getInstance ();
		$Config->confDir = CONFIG_DIR.'/'.$dir;
	}
	/**
	 * 获取配置文件的内容
	 *
	 * @param string $keyName
	 *        	配置字段的值
	 * @return mixd[]
	 * @example EasyConfig::get('db.mysql.host')
	 */
	public static function get($keyName) {
		// 注册模式
		static $confReg = array ();
		static $keyNameReg = array ();
		
		if (isset ( $keyNameReg [$keyName] )) {
			return $keyNameReg [$keyName];
		}
		
		$Config = self::_getInstance ();
		$confArr = explode ( '.', $keyName );
		$fileName = array_shift ( $confArr );
		$fileName = strtolower ( $fileName );
		
		if (! isset ( $confReg [$fileName] )) {
			$confPath = $Config->confDir . '/' . $fileName . '.php';
			if (! file_exists ( $confPath )) {
				exit ( 'ERROR: 亲，配置文件[' . $fileName . ']不存在！' );
			}
			
			$CONF = null;
			require $confPath;
			
			$confReg [$fileName] = $CONF;
		} else {
			$CONF = $confReg [$fileName];
		}
		
		if (! $CONF) {
			return null;
		}
		foreach ( $confArr as $key ) {
			if (! isset ( $CONF [$key] )) {
				EasyLog::error ( 'The config of ' . $keyName . ' is undefine' );
				exit ( 'ERROR: 亲，[' . $keyName . ']没有定义！' );
			}
			$CONF = $CONF [$key];
		}
		
		$keyNameReg [$keyName] = $CONF;
		return $CONF;
	}
	
	/**
	 * 单件
	 *
	 * @return object
	 */
	private static function _getInstance() {
		if (isset ( $this ) && is_object ( $this ) && $this instanceof EasyConfig) {
			return $this;
		}
		static $Config = null;
		if (! $Config) {
			$Config = new EasyConfig ();
		}
		return $Config;
	}
}
```
- EasyDocParser.php
  
```php
<?php
namespace lib\easy_php;
/**
 * 文档解析类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
class EasyDocParser{
	public function parse_doc($php_doc_comment){
		$p = new DocParser();
		return $p->parse($php_doc_comment);
	}
}
```
- EasyFile.php
  
```php
<?php
namespace lib\easy_php;
/**
 * @desc 文件操作类
 * 
 * expample:
 * 
 * EasyFile::mkDir('a/1/2/3');					测试建立文件夹	建一个a/1/2/3文件夹
 * EasyFile::touch('b/1/2/3');					测试建立文件		在b/1/2/文件夹下面建一个3文件
 * EasyFile::touch('b/1/2/3.exe');				测试建立文件		在b/1/2/文件夹下面建一个3.exe文件
 * EasyFile::cp('b','d/e');						测试复制文件夹	建立一个d/e文件夹，把b文件夹下的内容复制进去
 * EasyFile::cp('b/1/2/3.exe','b/b/3.exe');		测试复制文件		建立一个b/b文件夹，并把b/1/2文件夹中的3.exe文件复制进去
 * EasyFile::mv('a/','b/c');						测试移动文件夹	建立一个b/c文件夹,并把a文件夹下的内容移动进去，并删除a文件夹
 * EasyFile::mv('b/1/2/3.exe','b/d/3.exe');		测试移动文件		建立一个b/d文件夹，并把b/1/2中的3.exe移动进去					
 * EasyFile::rm('b/d/3.exe');					测试删除文件		删除b/d/3.exe文件
 * EasyFile::rm('d');							测试删除文件夹	删除d文件夹
 * 
 * EasyFile::write('b/c/d', 'test', 'ab');					测试写入一个文件
 * while($rs = EasyFile::readLine('b/c/d')) {echo $rs}		测试从文件中读取一行
 * echo EasyFile::readAll('b/c/d')							测试从文件中读取所有
 */
class EasyFile {
	/**
	 * 构造函数
	 *
	 */
	public function __construct() {
		exit('ERROR: The class is static');
	}
	
	/**
	 * 扫描目录
	 *
	 * @param unknown_type $dirPath
	 * @return unknown
	 */
	static public function readDir($dirPath) {
		static $dirArr = array();
		if (substr($dirPath, -1) != '/') {
			$dirPath .= '/';
		}
		
		if (!isset($dirArr[$dirPath]) || !$dirArr[$dirPath]) {
			$dirArr[$dirPath] = opendir($dirPath);
		}
		$fp = $dirArr[$dirPath];
		
		if (!$fp) {
			return false;
		}
		
		if (false !== ($file = readdir($fp))) {
			return $file == '.' || $file == '..' ? EasyFile::readDir($dirPath) : $dirPath . $file;
		}
		closedir($fp);
		unset($dirArr[$dirPath]);
		return false;
	}
	
	/**
	 * PHP下递归创建目录的函数
	 *
	 * @param string $dir - 需要创建的目录路径，可以是绝对路径或者相对路径
	 * @return boolean 返回是否写入成功
	 */
	static public function mkDir($dir) {
		return is_dir($dir) or (self::mkDir(dirname($dir)) and mkdir($dir, 0777)); 
	}
	
	/**
	 * 建立文件
	 *
	 * @param	string	$aimUrl 
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static public function touch($aimUrl, $overWrite = false) {
		if (self::isExists($aimUrl) && $overWrite == false) {
			return false;
		} elseif (self::isExists($aimUrl) && $overWrite == true) {
			self::rmFile($aimUrl);
		}
		$aimDir = dirname($aimUrl);
		if (!self::isExists($aimDir)) {
			self::mkDir($aimDir);
		}
		touch($aimUrl);
		return true;
	}
	
	/**
	 * 移动文件(或文件夹)
	 *
	 * @param string $filePath
	 * @param string $aimPath
	 * @param boolean $overWrite
	 * @return boolean
	 */
	static public function mv($filePath, $aimPath, $overWrite = false) {
		if (self::isDir($filePath)) {
			return self::mvDir($filePath, $aimPath, $overWrite);
		} else {
			return self::mvFile($filePath, $aimPath, $overWrite);
		}
	}
	
	/**
	 * 复制文件(或文件夹)
	 *
	 * @param string $filePath
	 * @param string $aimPath
	 * @param boolean $overWrite
	 * @return boolean
	 */
	static public function cp($filePath, $aimPath, $overWrite = false) {
		if (self::isDir($filePath)) {
			return self::cpDir($filePath, $aimPath, $overWrite);
		} else {
			return self::cpFile($filePath, $aimPath, $overWrite);
		}
	}
	
	/**
	 * 删除文件(或文件夹)
	 *
	 * @param string $filePath
	 * @return boolean
	 */
	static public function rm($filePath) {
		if (self::isDir($filePath)) {
			return self::rmDir($filePath);
		} else {
			return self::rmFile($filePath);
		}
	}
	
	/**
	 * 判断当前文件是否是一个文件夹
	 *
	 * @param string $path
	 * @return boolean
	 */
	static public function isDir($path) {
		return @is_dir($path);
	}
	
	/**
	 * 判断当前文件是否存在
	 *
	 * @param string $path
	 * @return boolean
	 */
	static public function isExists($path) {
		return @file_exists($path);
	}
	
	/**
	 * 将数据写入(或追加入)文件
	 *
	 * @param string $file
	 * @param string $content
	 * @param string $type
	 * @return boolean
	 */
	static public function write($file, $content, $append = false) {
		
		self::mkDir(dirname($file));
		
		if ($append) {
			$type = 'ab';
			// 如果无法写入文件，则返回false
			if (!$fp = @fopen($file, $type)) {
				return false;
			}
			$ok = @fwrite($fp, $content); // 写入
			@fclose($fp); // 关闭
		} else {
			$type = 'wb';
			$tmpFile = $file . 'tmp';
			// 如果无法写入文件，则返回false
			if (!$fp = @fopen($tmpFile, $type)) {
				return false;
			}
			$ok = @fwrite($fp, $content); // 写入
			@fclose($fp); // 关闭
			
			self::mv($tmpFile, $file, true);
		}
		
		return $ok;
	}
	
	/**
	 * 读取文件中的一行数据
	 *
	 * @param string $file
	 * @param string $size
	 * @return string
	 */
	static public function readLine($file, $size = 4096) {
		static $fileArr = array();
		
		if (!isset($fileArr[$file]) || !$fileArr[$file]) {
			$fileArr[$file] = @fopen($file, "r");
		}
		$fp = $fileArr[$file];
		
		if ($fp && !feof($fp)) {
			return fgets($fp, $size);
		}
		fclose($fp);
		unset($fileArr[$file]);
		return false;
	}
	
	/**
	 * 读取文件中的所有数据
	 *
	 * @param string $file
	 * @param string $size
	 * @return string
	 */
	static public function readAll($file) {
		if (!self::isExists($file)) {
			return false;
		}
		return file_get_contents($file);
	}
	
	/**
	 * 移动文件夹
	 *
	 * @param	string	$oldDir
	 * @param	string	$aimDir
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static private function mvDir($oldDir, $aimDir, $overWrite) {
		$aimDir = str_replace('\\', '/', $aimDir);
		$aimDir = substr($aimDir, -1) == '/' ? $aimDir : $aimDir . '/';
		$oldDir = str_replace('\\', '/', $oldDir);
		$oldDir = substr($oldDir, -1) == '/' ? $oldDir : $oldDir . '/';
		if (!is_dir($oldDir)) {
			return false;
		}
		if (!self::isExists($aimDir)) {
			self::mkDir($aimDir);
		}
		@$dirHandle = opendir($oldDir);
		if (!$dirHandle) {
			return false;
		}
		while (false !== ($file = readdir($dirHandle))) {
			if ($file == '.' || $file == '..') {
				continue;
			}
			if (!is_dir($oldDir . $file)) {
				self::mvFile($oldDir . $file, $aimDir . $file, $overWrite);
			} else {
				self::mvDir($oldDir . $file, $aimDir . $file, $overWrite);
			}
		}
		closedir($dirHandle);
		return rmdir($oldDir);
	}
	
	/**
	 * 移动文件
	 *
	 * @param	string	$fileUrl
	 * @param	string	$aimUrl
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static private function mvFile($fileUrl, $aimUrl, $overWrite) {
		if (!self::isExists($fileUrl)) {
			return false;
		}
		if (self::isExists($aimUrl) && $overWrite = false) {
			return false;
		} elseif (self::isExists($aimUrl) && $overWrite = true) {
			self::rmFile($aimUrl);
		}
		$aimDir = dirname($aimUrl);
		self::mkDir($aimDir);
		rename($fileUrl, $aimUrl);
		return true;
	}
	
	/**
	 * 删除文件夹
	 *
	 * @param	string	$aimDir
	 * @return	boolean
	 */
	static private function rmDir($aimDir) {
		$aimDir = str_replace('\\', '/', $aimDir);
		$aimDir = substr($aimDir, -1) == '/' ? $aimDir : $aimDir . '/';
		if (!is_dir($aimDir)) {
			return false;
		}
		$dirHandle = opendir($aimDir);
		while (false !== ($file = readdir($dirHandle))) {
			if ($file == '.' || $file == '..') {
				continue;
			}
			if (!is_dir($aimDir . $file)) {
				self::rmFile($aimDir . $file);
			} else {
				self::rmDir($aimDir . $file);
			}
		}
		closedir($dirHandle);
		return rmdir($aimDir);
	}
	
	/**
	 * 删除文件
	 *
	 * @param	string	$aimUrl
	 * @return	boolean
	 */
	static private function rmFile($aimUrl) {
		if (self::isExists($aimUrl)) {
			@unlink($aimUrl);
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 复制文件夹
	 *
	 * @param	string	$oldDir
	 * @param	string	$aimDir
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static private function cpDir($oldDir, $aimDir, $overWrite) {
		$aimDir = str_replace('\\', '/', $aimDir);
		$aimDir = substr($aimDir, -1) == '/' ? $aimDir : $aimDir . '/';
		$oldDir = str_replace('\\', '/', $oldDir);
		$oldDir = substr($oldDir, -1) == '/' ? $oldDir : $oldDir . '/';
		if (!is_dir($oldDir)) {
			return false;
		}
		if (!self::isExists($aimDir)) {
			self::mkDir($aimDir);
		}
		$dirHandle = opendir($oldDir);
		while (false !== ($file = readdir($dirHandle))) {
			if ($file == '.' || $file == '..') {
				continue;
			}
			if (!is_dir($oldDir . $file)) {
				self::cpFile($oldDir . $file, $aimDir . $file, $overWrite);
			} else {
				self::cpDir($oldDir . $file, $aimDir . $file, $overWrite);
			}
		}
		return closedir($dirHandle);
	}
	
	/**
	 * 复制文件
	 *
	 * @param	string	$fileUrl
	 * @param	string	$aimUrl
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static private function cpFile($fileUrl, $aimUrl, $overWrite) {
		if (!self::isExists($fileUrl)) {
			return false;
		}
		if (self::isExists($aimUrl) && $overWrite == false) {
			return false;
		} elseif (self::isExists($aimUrl) && $overWrite == true) {
			self::rmFile($aimUrl);
		}
		$aimDir = dirname($aimUrl);
		self::mkDir($aimDir);
		copy($fileUrl, $aimUrl);
		return true;
	}
}
```
- EasyFileCache.php
  
```php
<?php
namespace lib\easy_php;
/**
 * 文件缓存类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
class EasyFileCache {
	private static $cache_dir =  FILE_CACHE_ROOT;// 缓存目录
	private static $cache_time = 3600;// 缓存时间 3600
	
	public static function __get_filename($key = false, $cache_dir = false){
		if (!$key){
			return false;
		}
		$cache_dir = !$cache_dir ? self::$cache_dir : $cache_dir;
		$key = md5($key);
		return rtrim($cache_dir,'/').'/'.substr($key,0,2).'/'.substr($key,2,2).'/'.substr($key,4,2).'/'.$key;
	}
	public static function __mkdir($dir = false){
		if (!$dir){
			return false;
		}
		if (file_exists($dir)){
			@chmod($dir, 0777);
			return true;
		}
		if (@mkdir($dir, 0777, true)){
			@chmod($dir, 0777);
			return true;
		}
		return false;
	}
	/**
	 * 取出key对应的value
	 * @param string $key 缓存key
	 * @param string $cache_dir 缓存目录
	 * @return boolean|mixed
	 */
	public static function get($key = false, $cache_dir = false){
		if (!$key){
			return false;
		}
		$cache_filename = self::__get_filename($key, $cache_dir);
		if (!file_exists($cache_filename)){
			return false;
		}
		$data = file_get_contents($cache_filename);
		$data = unserialize($data);
		if ((int)$data['timestamp'] > time()){
			return $data['data'];
		}
		return false;
	}
	/**
	 * 设置key对应的value
	 * @param string $key 缓存key
	 * @param string $value 缓存值
	 * @param int $cache_time 缓存时长
	 * @param string $cache_dir 缓存目录
	 * @return boolean
	 */
	public static function set($key = false, $value = false, $cache_time = 0, $cache_dir = false){
		if (!$key || !$value){
			return false;
		}
		$cache_time = $cache_time ? $cache_time : self::$cache_time;
		$cache_filename = self::__get_filename($key, $cache_dir);
		if (!self::__mkdir(dirname($cache_filename))){
			return false;
		}
		@chmod($cache_filename, 0777);
		$data['timestamp'] = time() + $cache_time;
		$data['data'] = $value;
		$data = serialize($data);
		if (PHP_VERSION >= '5'){
			file_put_contents($cache_filename, $data);
		}else {
			$handle = fopen($cache_filename, 'wb');
			fwrite($handle, $data);
			fclose($handle);
		}
        @chmod($cache_filename, 0777);
		return true;
	}
	/**
	 * 删除key对应的value
	 * @param string $key
	 * @param string $cache_dir
	 * @return boolean
	 */
	public static function del($key = false, $cache_dir = false){
		if (!$key){
			return false;
		}
		@unlink(self::__get_filename($key , $cache_dir));
		return true;
	}
}
```
- EasyImage.php

```php
<?php
namespace lib\easy_php;
/**
 * EasyImage类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 *
 * @example:
 *  $img = new EasyImage('path/to/yourimage.jpg');
 *  // Create from scratch
 *	$img->create(200, 100, '#f00')->save('processed/create-from-scratch.gif');
 *	// Convert to GIF
 *	$img->load('butterfly.jpg')->save('processed/butterfly-convert-to-gif.gif');
 *	// Strip exif data (just load and save)
 *	$img->load('butterfly.jpg')->save('processed/butterfly-strip-exif.jpg');
 *	// Flip horizontal
 *	$img->load('butterfly.jpg')->flip('x')->save('processed/butterfly-flip-horizontal.jpg');
 *	// Flip vertical
 *	$img->load('butterfly.jpg')->flip('y')->save('processed/butterfly-flip-vertical.jpg');
 *	// Flip both
 *	$img->load('butterfly.jpg')->flip('x')->flip('y')->save('processed/butterfly-flip-both.jpg');
 *	// Rotate 90
 *	$img->load('butterfly.jpg')->rotate(90)->save('processed/butterfly-rotate-90.jpg');
 *	// Auto-orient
 *	$img->load('butterfly.jpg')->auto_orient()->save('processed/butterfly-auto-orient.jpg');
 *	// Resize
 *	$img->load('butterfly.jpg')->resize(320, 239)->save('processed/butterfly-resize.jpg');
 *	// Adaptive resize
 *	$img->load('butterfly.jpg')->adaptive_resize(100, 75)->save('processed/butterfly-adaptive-resize.jpg');
 *	// Fit to width
 *	$img->load('butterfly.jpg')->fit_to_width(100)->save('processed/butterfly-fit-to-width.jpg');
 *	// Fit to height
 *	$img->load('butterfly.jpg')->fit_to_height(100)->save('processed/butterfly-fit-to-height.jpg');
 *	// Best fit
 *	$img->load('butterfly.jpg')->best_fit(100, 400)->save('processed/butterfly-best-fit.jpg');
 *	// Crop
 *	$img->load('butterfly.jpg')->crop(160, 110, 460, 360)->save('processed/butterfly-crop.jpg');
 *	// Desaturate
 *	$img->load('butterfly.jpg')->desaturate()->save('processed/butterfly-desaturate.jpg');
 *	// Invert
 *	$img->load('butterfly.jpg')->invert()->save('processed/butterfly-invert.jpg');
 *	// Brighten
 *	$img->load('butterfly.jpg')->brightness(100)->save('processed/butterfly-brighten.jpg');
 *	// Darken
 *	$img->load('butterfly.jpg')->brightness(-100)->save('processed/butterfly-darken.jpg');
 *	// Contrast
 *	$img->load('butterfly.jpg')->contrast(-50)->save('processed/butterfly-contrast.jpg');
 *	// Colorize
 *	$img->load('butterfly.jpg')->colorize('#F00', .5)->save('processed/butterfly-colorize.jpg');
 *	// Edge Detect
 *	$img->load('butterfly.jpg')->edges()->save('processed/butterfly-edges.jpg');
 *	// Mean Removal
 *	$img->load('butterfly.jpg')->mean_remove()->save('processed/butterfly-mean-remove.jpg');
 *	// Emboss
 *	$img->load('butterfly.jpg')->emboss()->save('processed/butterfly-emboss.jpg');
 *	// Selective Blur
 *	$img->load('butterfly.jpg')->blur('selective', 10)->save('processed/butterfly-blur-selective.jpg');
 *	// Gaussian Blur
 *	$img->load('butterfly.jpg')->blur('gaussian', 10)->save('processed/butterfly-blur-gaussian.jpg');
 *	// Sketch
 *	$img->load('butterfly.jpg')->sketch()->save('processed/butterfly-sketch.jpg');
 *	// Smooth
 *	$img->load('butterfly.jpg')->smooth(6)->save('processed/butterfly-smooth.jpg');
 *	// Pixelate
 *	$img->load('butterfly.jpg')->pixelate(8)->save('processed/butterfly-pixelate.jpg');
 *	// Sepia
 *	$img->load('butterfly.jpg')->sepia(8)->save('processed/butterfly-sepia.jpg');
 *	// Overlay
 *	$img->load('butterfly.jpg')->overlay('overlay.png', 'bottom right', .8)->save('processed/butterfly-overlay.jpg');
 *	// Text
 *	$img->load('butterfly.jpg')->text('Butterfly', __DIR__.'/delicious.ttf', 32, '#FFFFFF', 'bottom', 0, -20)->save('processed/butterfly-text.jpg');
 */
class EasyImage {
	/**
	 *
	 * @var int Default output image quality
	 */
	public $quality = 80;
	protected $image, $filename, $original_info, $width, $height;
	
	/**
	 * Create instance and load an image, or create an image from scratch
	 *
	 * @param null|string $filename
	 *        	image file (may be omitted to create image from scratch)
	 * @param int $width
	 *        	(is used for creating image from scratch)
	 * @param int|null $height
	 *        	- assumed equal to $width (is used for creating image from
	 *        	scratch)
	 * @param null|string $color
	 *        	string, array(red, green, blue) or array(red, green, blue,
	 *        	alpha).
	 *        	Where red, green, blue - integers 0-255, alpha - integer
	 *        	0-127<br>
	 *        	(is used for creating image from scratch)
	 *        	
	 * @return EasyImage
	 * @throws Exception
	 */
	function __construct($filename = null, $width = null, $height = null, $color = null) {
		if ($filename) {
			$this->load ( $filename );
		} elseif ($width) {
			$this->create ( $width, $height, $color );
		}
		return $this;
	}
	/**
	 * Destroy image resource
	 */
	function __destruct() {
		if ($this->image) {
			imagedestroy ( $this->image );
		}
	}
	/**
	 * Load an image
	 *
	 * @param string $filename
	 *        	image file
	 *        	
	 * @return EasyImage
	 * @throws Exception
	 */
	function load($filename) {

		// Require GD library
		if (! extension_loaded ( 'gd' )) {
			throw new Exception ( 'Required extension GD is not loaded.' );
		}
		$this->filename = $filename;
		$info = getimagesize ( $this->filename );
		switch ($info ['mime']) {
			case 'image/gif' :
				$this->image = @imagecreatefromgif ( $this->filename );
				break;
			case 'image/jpeg' :
				$this->image = @imagecreatefromjpeg ( $this->filename );
				break;
			case 'image/png' :
				$this->image = @imagecreatefrompng ( $this->filename );
				break;
			case 'image/x-ms-bmp':
				$this->image = $this->ImageCreateFromBMP($this->filename);
				break;
			default :
				throw new Exception ( 'Invalid image: ' . $this->filename );
				break;
		}
		$this->original_info = array (
				'width' => $info [0],
				'height' => $info [1],
				'orientation' => $this->get_orientation (),
				'exif' => function_exists ( 'exif_read_data' ) && $info ['mime'] === 'image/jpeg' ? $this->exif = @exif_read_data ( $this->filename ) : null,
				'format' => preg_replace ( '/^image\//', '', $info ['mime'] ),
				'mime' => $info ['mime'] 
		);
		$this->width = $info [0];
		$this->height = $info [1];
		@imagesavealpha ( $this->image, true );
		@imagealphablending ( $this->image, true );
		return $this;
	}
	/**
	 * Create an image from scratch
	 *
	 * @param int $width        	
	 * @param int|null $height
	 *        	- assumed equal to $width
	 * @param null|string $color
	 *        	string, array(red, green, blue) or array(red, green, blue,
	 *        	alpha).
	 *        	Where red, green, blue - integers 0-255, alpha - integer 0-127
	 *        	
	 * @return EasyImage
	 */
	function create($width, $height = null, $color = null) {
		$height = $height ? $height : $width;
		$this->width = $width;
		$this->height = $height;
		$this->image = imagecreatetruecolor ( $width, $height );
		$this->original_info = array (
				'width' => $width,
				'height' => $height,
				'orientation' => $this->get_orientation (),
				'exif' => null,
				'format' => 'png',
				'mime' => 'image/png' 
		);
		if ($color) {
			$this->fill ( $color );
		}
		return $this;
	}
	/**
	 * Fill image with color
	 *
	 * @param string $color
	 *        	string, array(red, green, blue) or array(red, green, blue,
	 *        	alpha).
	 *        	Where red, green, blue - integers 0-255, alpha - integer 0-127
	 *        	
	 * @return EasyImage
	 */
	function fill($color = '#000000') {
		$rgba = $this->normalize_color ( $color );
		$fill_color = imagecolorallocatealpha ( $this->image, $rgba ['r'], $rgba ['g'], $rgba ['b'], $rgba ['a'] );
		imagefilledrectangle ( $this->image, 0, 0, $this->width, $this->height, $fill_color );
		return $this;
	}
	/**
	 * Save an image
	 *
	 * The resulting format will be determined by the file extension.
	 *
	 * @param null|string $filename
	 *        	- original file will be overwritten
	 * @param null|int $quality
	 *        	quality in percents 0-100
	 *        	
	 * @return EasyImage
	 * @throws Exception
	 */
	function save($filename = null, $quality = null) {
		$quality = $quality ? $quality : $this->quality;
		$filename = $filename ? $filename : $this->filename;
		imageinterlace ( $this->image, true );
        //*
		// Determine format via file extension (fall back to original format)
		$format = $this->file_ext ( $filename ) ? $this->file_ext ( $filename ) : $this->original_info ['format'];
		// Determine output format
		switch ($format) {
			case 'gif' :
				$result = @imagegif ( $this->image, $filename );
				break;
			case 'jpg' :
			case 'jpeg' :
				$result = @imagejpeg ( $this->image, $filename, round ( $quality ) );
				break;
			case 'png' :
				$result = @imagepng ( $this->image, $filename, round ( 9 * $quality / 100 ) );
				break;
			case 'bmp' : 
//				$this->image = $this->ImageCreateFromBMP($this->image);
				$result = @imagepng($this->image,$filename, round(9*$quality/100));
				break;
			default :
				throw new Exception ( 'Unsupported format' );
		}
		//*/
        /*
        $info = getimagesize ( $filename );
//        echo $info['mime'];exit;
        switch ($info ['mime']) {
            case 'image/gif' :
                $result = @imagegif ( $this->image, $filename );
                break;
            case 'image/jpeg' :
                $result = @imagejpeg ( $this->image, $filename, round ( $quality ) );
                break;
            case 'image/png' :
                $result = @imagepng ( $this->image, $filename, round ( 9 * $quality / 100 ) );
                break;
            case 'image/x-ms-bmp':
//                echo $info['mime'];exit;
                $this->image = $this->ImageCreateFromBMP($filename);
//                echo $filename;exit;
//                echo '<pre>';
//                var_dump($this->image);
//                exit;
                $result = @imagepng($this->image,$filename, round(9*$quality/100));
//                $result = @imagepng($this->image, $filename);
//                echo $info['mime'];exit;
                break;
            default :
                throw new Exception ( 'Invalid image: ' . $this->filename );
                break;
        }
        //*/
		if (! $result) {
			throw new Exception ( 'Unable to save image: ' . $filename );
		}
		return $this;
	}
	function ImageCreateFromBMP($filename) {
        //Ouverture du fichier en mode binaire
        if (!$f1 = fopen($filename, "rb"))
            return FALSE;
        //1 : Chargement des ent�tes FICHIER
        $FILE = unpack("vfile_type/Vfile_size/Vreserved/Vbitmap_offset", fread($f1, 14));
        if ($FILE['file_type'] != 19778)
            return FALSE;

        //2 : Chargement des ent�tes BMP
        $BMP = unpack('Vheader_size/Vwidth/Vheight/vplanes/vbits_per_pixel' .
            '/Vcompression/Vsize_bitmap/Vhoriz_resolution' .
            '/Vvert_resolution/Vcolors_used/Vcolors_important', fread($f1, 40));

//        $BMP['width'] = $this->width;
//        $BMP['height'] = $this->height;
        $BMP['colors'] = pow(2, $BMP['bits_per_pixel']);
        if ($BMP['size_bitmap'] == 0)
            $BMP['size_bitmap'] = $FILE['file_size'] - $FILE['bitmap_offset'];
        $BMP['bytes_per_pixel'] = $BMP['bits_per_pixel'] / 8;
        $BMP['bytes_per_pixel2'] = ceil($BMP['bytes_per_pixel']);
        $BMP['decal'] = ($BMP['width'] * $BMP['bytes_per_pixel'] / 4);
        $BMP['decal'] -= floor($BMP['width'] * $BMP['bytes_per_pixel'] / 4);
        $BMP['decal'] = 4 - (4 * $BMP['decal']);
        if ($BMP['decal'] == 4)
            $BMP['decal'] = 0;

//        echo '<pre>';
//        var_dump($this);
//        exit;
        //3 : Chargement des couleurs de la palette
        $PALETTE = array();
        if ($BMP['colors'] < 16777216) {
            $PALETTE = unpack('V' . $BMP['colors'], fread($f1, $BMP['colors'] * 4));
        }

        //4 : Cr�ation de l'image
//        echo $BMP['size_bitmap'];exit;
        $IMG = fread($f1, $BMP['size_bitmap']);
        $VIDE = chr(0);

        $res = imagecreatetruecolor($BMP['width'], $BMP['height']);
        $P = 0;
        $Y = $BMP['height'] - 1;
        while ($Y >= 0) {
            $X = 0;
            while ($X < $BMP['width']) {
                if ($BMP['bits_per_pixel'] == 24)
                    $COLOR = unpack("V", substr($IMG, $P, 3) . $VIDE);
                elseif ($BMP['bits_per_pixel'] == 16) {
                    $COLOR = unpack("n", substr($IMG, $P, 2));
                    $COLOR[1] = $PALETTE[$COLOR[1] + 1];
                } elseif ($BMP['bits_per_pixel'] == 8) {
                    $COLOR = unpack("n", $VIDE . substr($IMG, $P, 1));
                    $COLOR[1] = $PALETTE[$COLOR[1] + 1];
                } elseif ($BMP['bits_per_pixel'] == 4) {
                    $COLOR = unpack("n", $VIDE . substr($IMG, floor($P), 1));
                    if (($P * 2) % 2 == 0)
                        $COLOR[1] = ($COLOR[1] >> 4);
                    else
                        $COLOR[1] = ($COLOR[1] & 0x0F);
                    $COLOR[1] = $PALETTE[$COLOR[1] + 1];
                }
                elseif ($BMP['bits_per_pixel'] == 1) {
                    $COLOR = unpack("n", $VIDE . substr($IMG, floor($P), 1));
                    if (($P * 8) % 8 == 0)
                        $COLOR[1] = $COLOR[1] >> 7;
                    elseif (($P * 8) % 8 == 1)
                        $COLOR[1] = ($COLOR[1] & 0x40) >> 6;
                    elseif (($P * 8) % 8 == 2)
                        $COLOR[1] = ($COLOR[1] & 0x20) >> 5;
                    elseif (($P * 8) % 8 == 3)
                        $COLOR[1] = ($COLOR[1] & 0x10) >> 4;
                    elseif (($P * 8) % 8 == 4)
                        $COLOR[1] = ($COLOR[1] & 0x8) >> 3;
                    elseif (($P * 8) % 8 == 5)
                        $COLOR[1] = ($COLOR[1] & 0x4) >> 2;
                    elseif (($P * 8) % 8 == 6)
                        $COLOR[1] = ($COLOR[1] & 0x2) >> 1;
                    elseif (($P * 8) % 8 == 7)
                        $COLOR[1] = ($COLOR[1] & 0x1);
                    $COLOR[1] = $PALETTE[$COLOR[1] + 1];
                } else
                    return FALSE;
                imagesetpixel($res, $X, $Y, $COLOR[1]);
                $X++;
                $P += $BMP['bytes_per_pixel'];
            }
            $Y--;
            $P+=$BMP['decal'];
        }

        //Fermeture du fichier
        fclose($f1);
//        echo $filename;exit;

//        $filename = str_replace('.bmp','.png',$filename);
//        $result = @imagepng($res,$filename);
//        $this->filename = $filename;
//        $this->image = $result;
        return $res;
	}
	/**
	 * Get info about the original image
	 *
	 * @return array <pre> array(
	 *         width		=> 320,
	 *         height		=> 200,
	 *         orientation	=> ['portrait', 'landscape', 'square'],
	 *         exif		=> array(...),
	 *         mime		=> ['image/jpeg', 'image/gif', 'image/png'],
	 *         format		=> ['jpeg', 'gif', 'png']
	 *         )</pre>
	 */
	function get_original_info() {
		return $this->original_info;
	}
	/**
	 * Get the current width
	 *
	 * @return int
	 */
	function get_width() {
		return imagesx ( $this->image );
	}
	/**
	 * Get the current height
	 *
	 * @return int
	 */
	function get_height() {
		return imagesy ( $this->image );
	}
	/**
	 * Get the current orientation
	 *
	 * @return string
	 */
	function get_orientation() {
		if (imagesx ( $this->image ) > imagesy ( $this->image )) {
			return 'landscape';
		}
		if (imagesx ( $this->image ) < imagesy ( $this->image )) {
			return 'portrait';
		}
		return 'square';
	}
	/**
	 * Flip an image horizontally or vertically
	 *
	 * @param string $direction        	
	 * @return EasyImage
	 */
	function flip($direction) {
		$new = imagecreatetruecolor ( $this->width, $this->height );
		imagealphablending ( $new, false );
		imagesavealpha ( $new, true );
		switch (strtolower ( $direction )) {
			case 'y' :
				for($y = 0; $y < $this->height; $y ++) {
					imagecopy ( $new, $this->image, 0, $y, 0, $this->height - $y - 1, $this->width, 1 );
				}
				break;
			default :
				for($x = 0; $x < $this->width; $x ++) {
					imagecopy ( $new, $this->image, $x, 0, $this->width - $x - 1, 0, 1, $this->height );
				}
				break;
		}
		$this->image = $new;
		return $this;
	}
	/**
	 * Rotate an image
	 *
	 * @param int $angle        	
	 * @param string $bg_color
	 *        	string, array(red, green, blue) or array(red, green, blue,
	 *        	alpha).
	 *        	Where red, green, blue - integers 0-255, alpha - integer 0-127
	 *        	
	 * @return EasyImage
	 */
	function rotate($angle, $bg_color = '#000000') {
		$rgba = $this->normalize_color ( $bg_color );
		$bg_color = imagecolorallocatealpha ( $this->image, $rgba ['r'], $rgba ['g'], $rgba ['b'], $rgba ['a'] );
		$new = imagerotate ( $this->image, - ($this->keep_within ( $angle, - 360, 360 )), $bg_color );
		imagesavealpha ( $new, true );
		imagealphablending ( $new, true );
		$this->width = imagesx ( $new );
		$this->height = imagesy ( $new );
		$this->image = $new;
		return $this;
	}
	/**
	 * Rotates and/or flips an image automatically so the orientation will be
	 * correct (based on exif 'Orientation')
	 *
	 * @return EasyImage
	 */
	function auto_orient() {
		// Adjust orientation
		switch ($this->original_info ['exif'] ['Orientation']) {
			case 1 : // Do nothing
				break;
			case 2 : // Flip horizontal
				$this->flip ( 'x' );
				break;
			case 3 : // Rotate 180 counterclockwise
				$this->rotate ( - 180 );
				break;
			case 4 : // vertical flip
				$this->flip ( 'y' );
				break;
			case 5 : // Rotate 90 clockwise and flip vertically
				$this->flip ( 'y' );
				$this->rotate ( 90 );
				break;
			case 6 : // Rotate 90 clockwise
				$this->rotate ( 90 );
				break;
			case 7 : // Rotate 90 clockwise and flip horizontally
				$this->flip ( 'x' );
				$this->rotate ( 90 );
				break;
			case 8 : // Rotate 90 counterclockwise
				$this->rotate ( - 90 );
				break;
		}
		return $this;
	}
	/**
	 * Resize an image to the specified dimensions
	 *
	 * @param int $width        	
	 * @param int $height        	
	 * @return EasyImage
	 */
	function resize($width, $height, $ratio = true) {
		if ($ratio) {
			// 比较缩放比例，得到要缩放大小，然后按缩放比例大的缩放
			$ratio = max ( $height / $this->height, $width / $this->width );
			$height = $ratio * $this->height;
			$width = $ratio * $this->width;
		}
		$new = imagecreatetruecolor ( $width, $height );
		imagealphablending ( $new, false );
		imagesavealpha ( $new, true );
		imagecopyresampled ( $new, $this->image, 0, 0, 0, 0, $width, $height, $this->width, $this->height );
		$this->width = $width;
		$this->height = $height;
		$this->image = $new;
		return $this;
	}
	/**
	 * Adaptive resize
	 *
	 * This function attempts to get the image to as close to the provided
	 * dimensions as possible, and then crops the
	 * remaining overflow (from the center) to get the image to be the size
	 * specified
	 *
	 * @param int $width        	
	 * @param int|null $height
	 *        	- assumed equal to $width
	 *        	
	 * @return EasyImage
	 */
	function adaptive_resize($width, $height = null) {
		$height = $height ? $height : $width;
		$current_aspect_ratio = $this->height / $this->width;
		$new_aspect_ratio = $height / $width;
		if ($new_aspect_ratio > $current_aspect_ratio) {
			$this->fit_to_height ( $height );
		} else {
			$this->fit_to_width ( $width );
		}
		$left = ($this->width / 2) - ($width / 2);
		$top = ($this->height / 2) - ($height / 2);
		return $this->crop ( $left, $top, $width + $left, $height + $top );
	}
	/**
	 * Fit to width (proportionally resize to specified width)
	 *
	 * @param int $width        	
	 * @return EasyImage
	 */
	function fit_to_width($width) {
		$aspect_ratio = $this->height / $this->width;
		$height = $width * $aspect_ratio;
		return $this->resize ( $width, $height );
	}
	/**
	 * Fit to height (proportionally resize to specified height)
	 *
	 * @param int $height        	
	 * @return EasyImage
	 */
	function fit_to_height($height) {
		$aspect_ratio = $this->height / $this->width;
		$width = $height / $aspect_ratio;
		return $this->resize ( $width, $height );
	}
	/**
	 * Best fit (proportionally resize to fit in specified width/height)
	 *
	 * Shrink the image proportionally to fit inside a $width x $height box
	 *
	 * @param int $max_width        	
	 * @param int $max_height        	
	 * @return EasyImage
	 */
	function best_fit($max_width, $max_height) {
		// If it already fits, there's nothing to do
		if ($this->width <= $max_width && $this->height <= $max_height) {
			return $this;
		}
		// Determine aspect ratio
		$aspect_ratio = $this->height / $this->width;
		// Make width fit into new dimensions
		if ($this->width > $max_width) {
			$width = $max_width;
			$height = $width * $aspect_ratio;
		} else {
			$width = $this->width;
			$height = $this->height;
		}
		// Make height fit into new dimensions
		if ($height > $max_height) {
			$height = $max_height;
			$width = $height / $aspect_ratio;
		}
		return $this->resize ( $width, $height );
	}
	/**
	 * Crop an image
	 *
	 * @param int $x1        	
	 * @param int $y1        	
	 * @param int $x2        	
	 * @param int $y2        	
	 * @return EasyImage
	 */
	function crop($x1, $y1, $x2, $y2) {
		// Determine crop size
		if ($x2 < $x1) {
			list ( $x1, $x2 ) = array (
					$x2,
					$x1 
			);
		}
		if ($y2 < $y1) {
			list ( $y1, $y2 ) = array (
					$y2,
					$y1 
			);
		}
		$crop_width = $x2 - $x1;
		$crop_height = $y2 - $y1;
		$new = imagecreatetruecolor ( $crop_width, $crop_height );
		imagealphablending ( $new, false );
		imagesavealpha ( $new, true );
		imagecopyresampled ( $new, $this->image, 0, 0, $x1, $y1, $crop_width, $crop_height, $crop_width, $crop_height );
		$this->width = $crop_width;
		$this->height = $crop_height;
		$this->image = $new;
		return $this;
	}
	/**
	 * Desaturate (grayscale)
	 *
	 * @return EasyImage
	 */
	function desaturate() {
		imagefilter ( $this->image, IMG_FILTER_GRAYSCALE );
		return $this;
	}
	/**
	 * Invert
	 *
	 * @return EasyImage
	 */
	function invert() {
		imagefilter ( $this->image, IMG_FILTER_NEGATE );
		return $this;
	}
	/**
	 * Brightness
	 *
	 * @param int $level
	 *        	-255, lightest = 255
	 *        	
	 * @return EasyImage
	 */
	function brightness($level) {
		imagefilter ( $this->image, IMG_FILTER_BRIGHTNESS, $this->keep_within ( $level, - 255, 255 ) );
		return $this;
	}
	/**
	 * Contrast
	 *
	 * @param int $level
	 *        	-100, max = 100
	 *        	
	 * @return EasyImage
	 *
	 */
	function contrast($level) {
		imagefilter ( $this->image, IMG_FILTER_CONTRAST, $this->keep_within ( $level, - 100, 100 ) );
		return $this;
	}
	/**
	 * Colorize
	 *
	 * @param string $color
	 *        	string, array(red, green, blue) or array(red, green, blue,
	 *        	alpha).
	 *        	Where red, green, blue - integers 0-255, alpha - integer 0-127
	 * @param float|int $opacity        	
	 * @return EasyImage
	 */
	function colorize($color, $opacity) {
		$rgba = $this->normalize_color ( $color );
		$alpha = $this->keep_within ( 127 - (127 * $opacity), 0, 127 );
		imagefilter ( $this->image, IMG_FILTER_COLORIZE, $this->keep_within ( $rgba ['r'], 0, 255 ), $this->keep_within ( $rgba ['g'], 0, 255 ), $this->keep_within ( $rgba ['b'], 0, 255 ), $alpha );
		return $this;
	}
	/**
	 * Edge Detect
	 *
	 * @return EasyImage
	 */
	function edges() {
		imagefilter ( $this->image, IMG_FILTER_EDGEDETECT );
		return $this;
	}
	/**
	 * Emboss
	 *
	 * @return EasyImage
	 */
	function emboss() {
		imagefilter ( $this->image, IMG_FILTER_EMBOSS );
		return $this;
	}
	/**
	 * Mean Remove
	 *
	 * @return EasyImage
	 */
	function mean_remove() {
		imagefilter ( $this->image, IMG_FILTER_MEAN_REMOVAL );
		return $this;
	}
	/**
	 * Blur
	 *
	 * @param string $type        	
	 * @param int $passes
	 *        	times to apply the filter
	 *        	
	 * @return EasyImage
	 */
	function blur($type = 'selective', $passes = 1) {
		switch (strtolower ( $type )) {
			case 'gaussian' :
				$type = IMG_FILTER_GAUSSIAN_BLUR;
				break;
			default :
				$type = IMG_FILTER_SELECTIVE_BLUR;
				break;
		}
		for($i = 0; $i < $passes; $i ++) {
			imagefilter ( $this->image, $type );
		}
		return $this;
	}
	/**
	 * Sketch
	 *
	 * @return EasyImage
	 */
	function sketch() {
		imagefilter ( $this->image, IMG_FILTER_MEAN_REMOVAL );
		return $this;
	}
	/**
	 * Smooth
	 *
	 * @param int $level
	 *        	-10, max = 10
	 *        	
	 * @return EasyImage
	 */
	function smooth($level) {
		imagefilter ( $this->image, IMG_FILTER_SMOOTH, $this->keep_within ( $level, - 10, 10 ) );
		return $this;
	}
	/**
	 * Pixelate
	 *
	 * @param int $block_size
	 *        	pixels of each resulting block
	 *        	
	 * @return EasyImage
	 */
	function pixelate($block_size = 10) {
		imagefilter ( $this->image, IMG_FILTER_PIXELATE, $block_size, true );
		return $this;
	}
	/**
	 * Sepia
	 *
	 * @return EasyImage
	 */
	function sepia() {
		imagefilter ( $this->image, IMG_FILTER_GRAYSCALE );
		imagefilter ( $this->image, IMG_FILTER_COLORIZE, 100, 50, 0 );
		return $this;
	}
	/**
	 * Overlay
	 *
	 * Overlay an image on top of another, works with 24-bit PNG
	 * alpha-transparency
	 *
	 * @param string $overlay_file        	
	 * @param string $position
	 *        	right|bottom left|bottom right
	 * @param float|int $opacity
	 *        	0-1
	 * @param int $x_offset
	 *        	in pixels
	 * @param int $y_offset
	 *        	in pixels
	 *        	
	 * @return EasyImage
	 */
	function overlay($overlay_file, $position = 'center', $opacity = 1, $x_offset = 0, $y_offset = 0) {
		// Load overlay image
		$overlay = new EasyImage ( $overlay_file );
		// Convert opacity
		$opacity = $opacity * 100;
		// Determine position
		switch (strtolower ( $position )) {
			case 'top left' :
				$x = 0 + $x_offset;
				$y = 0 + $y_offset;
				break;
			case 'top right' :
				$x = $this->width - $overlay->width + $x_offset;
				$y = 0 + $y_offset;
				break;
			case 'top' :
				$x = ($this->width / 2) - ($overlay->width / 2) + $x_offset;
				$y = 0 + $y_offset;
				break;
			case 'bottom left' :
				$x = 0 + $x_offset;
				$y = $this->height - $overlay->height + $y_offset;
				break;
			case 'bottom right' :
				$x = $this->width - $overlay->width + $x_offset;
				$y = $this->height - $overlay->height + $y_offset;
				break;
			case 'bottom' :
				$x = ($this->width / 2) - ($overlay->width / 2) + $x_offset;
				$y = $this->height - $overlay->height + $y_offset;
				break;
			case 'left' :
				$x = 0 + $x_offset;
				$y = ($this->height / 2) - ($overlay->height / 2) + $y_offset;
				break;
			case 'right' :
				$x = $this->width - $overlay->width + $x_offset;
				$y = ($this->height / 2) - ($overlay->height / 2) + $y_offset;
				break;
			case 'center' :
			default :
				$x = ($this->width / 2) - ($overlay->width / 2) + $x_offset;
				$y = ($this->height / 2) - ($overlay->height / 2) + $y_offset;
				break;
		}
		$this->imagecopymerge_alpha ( $this->image, $overlay->image, $x, $y, 0, 0, $overlay->width, $overlay->height, $opacity );
		return $this;
	}
	/**
	 * Add text to an image
	 *
	 * @param string $text        	
	 * @param string $font_file        	
	 * @param float|int $font_size        	
	 * @param string $color        	
	 * @param string $position        	
	 * @param int $x_offset        	
	 * @param int $y_offset        	
	 * @return EasyImage
	 * @throws Exception
	 */
	function text($text, $font_file, $font_size = 12, $color = '#000000', $position = 'bottom right', $x_offset = 0, $y_offset = 0, $angle=0) {
		// todo - this method could be improved to support the text angle
//		$angle = 0;
		$rgba = $this->normalize_color ( $color );
		$color = imagecolorallocatealpha ( $this->image, $rgba ['r'], $rgba ['g'], $rgba ['b'], $rgba ['a'] );
		// Determine textbox size
		$box = imagettfbbox ( $font_size, $angle, $font_file, $text );
		if (! $box) {
			throw new Exception ( 'Unable to load font: ' . $font_file );
		}
		$box_width = abs ( $box [6] - $box [2] );
		$box_height = abs ( $box [7] - $box [1] );
		// Determine position
		switch (strtolower ( $position )) {
			case 'top left' :
				$x = 0 + $x_offset;
				$y = 0 + $y_offset + $box_height;
				break;
			case 'top right' :
				$x = $this->width - $box_width + $x_offset;
				$y = 0 + $y_offset + $box_height;
				break;
			case 'top' :
				$x = ($this->width / 2) - ($box_width / 2) + $x_offset;
				$y = 0 + $y_offset + $box_height;
				break;
			case 'bottom left' :
				$x = 0 + $x_offset;
				$y = $this->height - $box_height + $y_offset + $box_height;
				break;
			case 'bottom right' :
				$x = $this->width - $box_width + $x_offset;
				$y = $this->height - $box_height + $y_offset + $box_height;
				break;
			case 'bottom' :
				$x = ($this->width / 2) - ($box_width / 2) + $x_offset;
				$y = $this->height - $box_height + $y_offset + $box_height;
				break;
			case 'left' :
				$x = 0 + $x_offset;
				$y = ($this->height / 2) - (($box_height / 2) - $box_height) + $y_offset;
				break;
			case 'right' :
				$x = $this->width - $box_width + $x_offset;
				$y = ($this->height / 2) - (($box_height / 2) - $box_height) + $y_offset;
				break;
			case 'center' :
			default :
				$x = ($this->width / 2) - ($box_width / 2) + $x_offset;
				$y = ($this->height / 2) - (($box_height / 2) - $box_height) + $y_offset;
				break;
		}
		imagettftext ( $this->image, $font_size, $angle, $x, $y, $color, $font_file, $text );
		return $this;
	}
	/**
	 * Outputs image without saving
	 *
	 * @param null|string $format
	 *        	or null - format of original file will be used, may be
	 *        	gif|jpg|png
	 * @param int|null $quality
	 *        	quality in percents 0-100
	 *        	
	 * @throws Exception
	 */
	function output($format = null, $quality = null) {
		$quality = $quality ? $quality : $this->quality;
		imageinterlace ( $this->image, true );
		switch (strtolower ( $format )) {
			case 'gif' :
				$mimetype = 'image/gif';
				break;
			case 'jpeg' :
			case 'jpg' :
				$mimetype = 'image/jpeg';
				break;
			case 'png' :
				$mimetype = 'image/png';
				break;
			default :
				$info = @getimagesize ( $this->filename );
				$mimetype = $info ['mime'];
				unset ( $info );
				break;
		}
		// Output the image
		header ( 'Content-Type: ' . $mimetype );
		switch ($mimetype) {
			case 'image/gif' :
				@imagegif ( $this->image );
				break;
			case 'image/jpeg' :
				@imagejpeg ( $this->image, null, round ( $quality ) );
				break;
			case 'image/png' :
				@imagepng ( $this->image, null, round ( 9 * $quality / 100 ) );
				break;
			default :
				throw new Exception ( 'Unsupported image format: ' . $this->filename );
				break;
		}
		// Since no more output can be sent, call the destructor to free up
		// memory
		$this->__destruct ();
	}
	/**
	 * Outputs image as data base64 to use as img src
	 *
	 * @param null|string $format
	 *        	or null - format of original file will be used, may be
	 *        	gif|jpg|png
	 * @param int|null $quality
	 *        	quality in percents 0-100
	 *        	
	 * @return string
	 * @throws Exception
	 */
	function output_base64($format = null, $quality = null) {
		$quality = $quality ? $quality : $this->quality;
		imageinterlace ( $this->image, true );
		switch (strtolower ( $format )) {
			case 'gif' :
				$mimetype = 'image/gif';
				break;
			case 'jpeg' :
			case 'jpg' :
				$mimetype = 'image/jpeg';
				break;
			case 'png' :
				$mimetype = 'image/png';
				break;
			default :
				$info = getimagesize ( $this->filename );
				$mimetype = $info ['mime'];
				unset ( $info );
				break;
		}
		ob_start ();
		// Output the image
		switch ($mimetype) {
			case 'image/gif' :
				@imagegif ( $this->image );
				break;
			case 'image/jpeg' :
				@imagejpeg ( $this->image, null, round ( $quality ) );
				break;
			case 'image/png' :
				@imagepng ( $this->image, null, round ( 9 * $quality / 100 ) );
				break;
			default :
				throw new Exception ( 'Unsupported image format: ' . $this->filename );
				break;
		}
		$image_data = ob_get_contents ();
		ob_end_clean ();
		// Returns formatted string for img src
		return 'data:' . $mimetype . ';base64,' . base64_encode ( $image_data );
	}
	/**
	 * Same as PHP's imagecopymerge() function, except preserves
	 * alpha-transparency in 24-bit PNGs
	 *
	 * @param
	 *        	$dst_im
	 * @param
	 *        	$src_im
	 * @param
	 *        	$dst_x
	 * @param
	 *        	$dst_y
	 * @param
	 *        	$src_x
	 * @param
	 *        	$src_y
	 * @param
	 *        	$src_w
	 * @param
	 *        	$src_h
	 * @param
	 *        	$pct
	 *        	
	 * @link http://www.php.net/manual/en/function.imagecopymerge.php#88456
	 */
	protected function imagecopymerge_alpha($dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h, $pct) {
		$pct /= 100;
		// Get image width and height
		$w = imagesx ( $src_im );
		$h = imagesy ( $src_im );
		// Turn alpha blending off
		imagealphablending ( $src_im, false );
		// Find the most opaque pixel in the image (the one with the smallest
		// alpha value)
		$minalpha = 127;
		for($x = 0; $x < $w; $x ++) {
			for($y = 0; $y < $h; $y ++) {
				$alpha = (imagecolorat ( $src_im, $x, $y ) >> 24) & 0xFF;
				if ($alpha < $minalpha) {
					$minalpha = $alpha;
				}
			}
		}
		// Loop through image pixels and modify alpha for each
		for($x = 0; $x < $w; $x ++) {
			for($y = 0; $y < $h; $y ++) {
				// Get current alpha value (represents the TANSPARENCY!)
				$colorxy = imagecolorat ( $src_im, $x, $y );
				$alpha = ($colorxy >> 24) & 0xFF;
				// Calculate new alpha
				if ($minalpha !== 127) {
					$alpha = 127 + 127 * $pct * ($alpha - 127) / (127 - $minalpha);
				} else {
					$alpha += 127 * $pct;
				}
				// Get the color index with new alpha
				$alphacolorxy = imagecolorallocatealpha ( $src_im, ($colorxy >> 16) & 0xFF, ($colorxy >> 8) & 0xFF, $colorxy & 0xFF, $alpha );
				// Set pixel with the new color + opacity
				if (! imagesetpixel ( $src_im, $x, $y, $alphacolorxy )) {
					return;
				}
			}
		}
		imagesavealpha ( $dst_im, true );
		imagealphablending ( $dst_im, true );
		imagesavealpha ( $src_im, true );
		imagealphablending ( $src_im, true );
		imagecopy ( $dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h );
	}
	/**
	 * Ensures $value is always within $min and $max range.
	 *
	 * If lower, $min is returned. If higher, $max is returned.
	 *
	 * @param int|float $value        	
	 * @param int|float $min        	
	 * @param int|float $max        	
	 * @return int float
	 */
	protected function keep_within($value, $min, $max) {
		if ($value < $min) {
			return $min;
		}
		if ($value > $max) {
			return $max;
		}
		return $value;
	}
	/**
	 * Returns the file extension of the specified file
	 *
	 * @param string $filename        	
	 * @return string
	 */
	protected function file_ext($filename) {
		if (! preg_match ( '/\./', $filename )) {
			return '';
		}
		return preg_replace ( '/^.*\./', '', $filename );
	}
	/**
	 * Converts a hex color value to its RGB equivalent
	 *
	 * @param string $color
	 *        	string, array(red, green, blue) or array(red, green, blue,
	 *        	alpha).
	 *        	Where red, green, blue - integers 0-255, alpha - integer 0-127
	 *        	
	 * @return array bool
	 */
	protected function normalize_color($color) {
		if (is_string ( $color )) {
			$color = trim ( $color, '#' );
			if (strlen ( $color ) == 6) {
				list ( $r, $g, $b ) = array (
						$color [0] . $color [1],
						$color [2] . $color [3],
						$color [4] . $color [5] 
				);
			} elseif (strlen ( $color ) == 3) {
				list ( $r, $g, $b ) = array (
						$color [0] . $color [0],
						$color [1] . $color [1],
						$color [2] . $color [2] 
				);
			} else {
				return false;
			}
			return array (
					'r' => hexdec ( $r ),
					'g' => hexdec ( $g ),
					'b' => hexdec ( $b ),
					'a' => 0 
			);
		} elseif (is_array ( $color ) && (count ( $color ) == 3 || count ( $color ) == 4)) {
			if (isset ( $color ['r'], $color ['g'], $color ['b'] )) {
				return array (
						'r' => $this->keep_within ( $color ['r'], 0, 255 ),
						'g' => $this->keep_within ( $color ['g'], 0, 255 ),
						'b' => $this->keep_within ( $color ['b'], 0, 255 ),
						'a' => $this->keep_within ( isset ( $color ['a'] ) ? $color ['a'] : 0, 0, 127 ) 
				);
			} elseif (isset ( $color [0], $color [1], $color [2] )) {
				return array (
						'r' => $this->keep_within ( $color [0], 0, 255 ),
						'g' => $this->keep_within ( $color [1], 0, 255 ),
						'b' => $this->keep_within ( $color [2], 0, 255 ),
						'a' => $this->keep_within ( isset ( $color [3] ) ? $color [3] : 0, 0, 127 ) 
				);
			}
		}
		return false;
	}
}
```
- EasyLog.php

```php
<?php
namespace lib\easy_php;
/**
 * 日志类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
class EasyLog {
	public static $_log_path;
	public static $_date_fmt = 'Y-m-d H:i:s';
	public static $_enabled = TRUE;
	public static function _init() {
		self::$_log_path = APP_DIR.'/logs';
		if (! is_dir ( self::$_log_path ) || ! is_writable ( self::$_log_path )) {
			self::$_enabled = FALSE;
			exit ( 'ERROR:目录[' . self::$_log_path . ']不可写入，请为其设置可写权限先！' );
		}
	}
	
	/**
	 * 记录log
	 *
	 * @param
	 *        	string	the error message
	 * @param
	 *        	string	the error level
	 * @return bool
	 */
	public static function log($msg, $level = 'error') {
		if (self::$_enabled === FALSE) {
			exit;
		}
		self::_init ();
		$level = strtoupper ( $level );
		
		$filepath = self::$_log_path . '/' . $level . '-' . date ( 'Y-m-d' ) . '.log';
		$message = '';
		if (! $fp = @fopen ( $filepath, 'ab' )) {
			return exit;
		}

// 		$message .= $level . '-' . date ( self::$_date_fmt ) . ' --> ' . $msg . "\n";
		$message .= date ( self::$_date_fmt ) . ' --> ' . $msg . "\n";
		
		flock ( $fp, LOCK_EX );
		fwrite ( $fp, $message );
		flock ( $fp, LOCK_UN );
		fclose ( $fp );
		
		@chmod ( $filepath, 0666 );
	}

    /**
     * @desc 记录错误 log
     * @param string $msg
     */
	public static function error($msg=''){
	    self::log($msg,'error');
    }
}
```
- EasyUtility.php

```php
<?php
namespace lib\easy_php;
/**
 *工具类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
class EasyUtility {
	
	/**
	 * 截取字符串，包括中文
	 *
	 * @param string $string        	
	 * @param integer $sublen        	
	 * @param integer $start        	
	 * @param string $tmp        	
	 * @param string $code        	
	 * @return string
	 */
	public static function utf8_substr($string, $sublen, $start = 0, $tmp = '...', $code = 'UTF-8') {
		if ($code == 'UTF-8') {
			$pa = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf7][\x80-\xbf][\x80-\xbf][\x80-\xbf]/";
			preg_match_all ( $pa, $string, $t_string );
			if (count ( $t_string [0] ) - $start > $sublen)
				return join ( '', array_slice ( $t_string [0], $start, $sublen ) ) . $tmp;
			return join ( '', array_slice ( $t_string [0], $start, $sublen ) );
		} else {
			$start = $start * 2;
			$sublen = $sublen * 2;
			$strlen = strlen ( $string );
			$tmpstr = '';
			for($i = 0; $i < $strlen; $i ++) {
				if ($i >= $start && $i < ($start + $sublen)) {
					if (ord ( substr ( $string, $i, 1 ) ) > 129) {
						$tmpstr .= substr ( $string, $i, 2 );
					} else {
						$tmpstr .= substr ( $string, $i, 1 );
					}
				}
				if (ord ( substr ( $string, $i, 1 ) ) > 129)
					$i ++;
			}
			if (strlen ( $tmpstr ) < $strlen)
				$tmpstr .= $tmp;
			return $tmpstr;
		}
	}
	
	public static function getByCURL($curl_url){
		$ch = curl_init ($curl_url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ;
		curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ;
		$data = curl_exec ( $ch );
		curl_close ( $ch );
		return $data;
	}
	
	/**
	 * 通过CURL方式post数据
	 * 需要在php.ini中启动curl
	 * linux中去掉"extension=php_curl.so"前的";"号，windows中去掉"extension=php_curl.dll"前的";"号，并保证php的ext文件夹中有curl的扩展
	 *
	 * @param string $curl_url
	 *        	string url address
	 * @param array $curl_data
	 *        	array data
	 * @return object
	 */
	public static function postByCURL($curl_url, $curl_data,$header='') {
		if (is_array ( $curl_data )) {
			$curl_data = http_build_query ( $curl_data );
		}
		$ch = curl_init ();
        if ($header){
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
            curl_setopt($ch, CURLOPT_HEADER, 0);
        }
		curl_setopt ( $ch, CURLOPT_URL, $curl_url );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $curl_data );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
// 		curl_setopt ( $ch, CURLOPT_POST,  true );
// 		curl_setopt ( $ch, CURLOPT_COOKIEJAR,   'postcookie' );
// 		curl_setopt ( $ch, CURLOPT_COOKIEFILE,  'postcookie' );
 		curl_setopt ( $ch, CURLOPT_USERAGENT, "Easy's CURL post data style" );

		$data = curl_exec ( $ch );
        if (curl_errno($ch)) {
//            echo 'Curl error: ' . curl_error($ch);
            EasyLog::log(curl_error($ch), 'curl-error');
        }
		curl_close ( $ch );
		EasyLog::log($data,'postByCurlRes');
		return $data;
	}
	
	/**
	 * 获取client真实IP
	 *
	 * @return string '127.0.0.1'
	 */
	public static function getRealIp() {
		static $realip = NULL;
		if ($realip !== NULL) {
			return $realip;
		}
		if (isset ( $_SERVER )) {
			if (isset ( $_SERVER ['HTTP_X_FORWARDED_FOR'] )) {
				$arr = explode ( ',', $_SERVER ['HTTP_X_FORWARDED_FOR'] );

				// 取X-Forwarded-for中第一个非unknown的有效Ip字符串
				foreach ( $arr as $ip ) {
					$ip = trim ( $ip );
					if ($ip != 'unknown') {
						$realip = $ip;
						break;
					}
				}
			} elseif (isset ( $_SERVER ['HTTP_CLIENT_IP'] )) {
				$realip = $_SERVER ['HTTP_CLIENT_IP'];
			} else {
				if (isset ( $_SERVER ['REMOTE_ADDR'] )) {
					$realip = $_SERVER ['REMOTE_ADDR'];
				} else {
					$realip = '0.0.0.0';
				}
			}
		} else {
			if (getenv ( 'HTTP_X_FORWARDED_FOR' )) {
				$realip = getenv ( 'HTTP_X_FORWARDED_FOR' );
			} elseif (getenv ( 'HTTP_CLIENT_IP' )) {
				$realip = getenv ( 'HTTP_CLIENT_IP' );
			} else {
				$realip = getenv ( 'REMOTE_ADDR' );
			}
		}
		$onlineip = null;
		preg_match ( "/[\d\.]{7,15}/", $realip, $onlineip );
		$realip = ! empty ( $onlineip [0] ) ? $onlineip [0] : '0.0.0.0';
		return $realip;
	}
	
	/**
	 * 获取当前url(不包含请求参数)
	 *
	 * @return string
	 */
	public static function getUrl() {
		$http = (isset ( $_SERVER ['HTTPS'] ) && $_SERVER ['HTTPS'] != 'off') ? 'https://' : 'http://';
		return $http . $_SERVER ['HTTP_HOST'] . $_SERVER ['REQUEST_URI'];
	}

	public static function getDomain(){
		$http = (isset ( $_SERVER ['HTTPS'] ) && $_SERVER ['HTTPS'] != 'off') ? 'https://' : 'http://';
		return $http . $_SERVER ['HTTP_HOST'];// . $_SERVER ['REQUEST_PORT'];
	}

	public static function getUrlPath(){
		$tmp = explode('?', $_SERVER ['REQUEST_URI']);
		return isset($tmp[0]) ? $tmp[0] : '';
	}
	public static function getHttpPrefix(){
        $http = (isset ( $_SERVER ['HTTPS'] ) && $_SERVER ['HTTPS'] != 'off') ? 'https://' : 'http://';
        return $http;
    }
	
	/**
	 * 生成随机字串
	 *
	 * @param integer $min
	 *        	起始长度.
	 * @param integer $max
	 *        	最大长度.
	 * @return string 返回一个随机字符串
	 */
	public static function genRandStr($min, $max) {
		if (is_int ( $max ) && $max > $min) {
			$min = mt_rand ( $min, $max );
			$output = '';
			for($i = 0; $i < $min; $i ++) {
				$which = mt_rand ( 0, 2 );
				if ($which === 0) {
					$output .= mt_rand ( 0, 9 );
				} elseif ($which === 1) {
					$output .= chr ( mt_rand ( 65, 90 ) );
				} else {
					$output .= chr ( mt_rand ( 97, 122 ) );
				}
			}
			return $output;
		}
		return false;
	}
	/**
	 * 生成盐字串
	 *
	 * @param
	 *        	NULL
	 * @return string
	 */
	public static function genSalt($len = 6) {
		$rand = range ( 'a', 'z' );
		shuffle ( $rand );
		return substr ( join ( '', $rand ), 0, $len );
	}
	public static function genSmsVcode($len = 6){
		$rand = range('0', '9');
		shuffle($rand);
		return substr(join('', $rand), 0, $len);
	}
	
	/**
	 * 生成可逆密文
	 *
	 * @param string $sting
	 *        	被加密字符
	 * @param string $operation
	 *        	DECODE 解密 | ENCODE 加密
	 * @param string $key
	 *        	密匙
	 * @param integer $expiry
	 *        	密文有效期
	 */
	public static function authcode($string, $operation = 'DECODE', $key = '', $expiry = 0) {
		if ($string === '' or is_null ( $string ))
			return '';
		$ckey_length = 4;
		$key = md5 ( $key ? $key : EZ_KEY );
		$keya = md5 ( substr ( $key, 0, 16 ) );
		$keyb = md5 ( substr ( $key, 16, 16 ) );
		$keyc = $ckey_length ? ($operation == 'DECODE' ? substr ( $string, 0, $ckey_length ) : substr ( md5 ( EZ_KEY ), - $ckey_length )) : '';
		
		$cryptkey = $keya . md5 ( $keya . $keyc );
		$key_length = strlen ( $cryptkey );
		
		$string = $operation == 'DECODE' ? base64_decode ( substr ( $string, $ckey_length ) ) : sprintf ( '%010d', $expiry ? $expiry + time () : 0 ) . substr ( md5 ( $string . $keyb ), 0, 16 ) . $string;
		$string_length = strlen ( $string );
		
		$result = '';
		$box = range ( 0, 255 );
		
		$rndkey = array ();
		for($i = 0; $i <= 255; $i ++) {
			$rndkey [$i] = ord ( $cryptkey [$i % $key_length] );
		}
		
		for($j = $i = 0; $i < 256; $i ++) {
			$j = ($j + $box [$i] + $rndkey [$i]) % 256;
			$tmp = $box [$i];
			$box [$i] = $box [$j];
			$box [$j] = $tmp;
		}
		
		for($a = $j = $i = 0; $i < $string_length; $i ++) {
			$a = ($a + 1) % 256;
			$j = ($j + $box [$a]) % 256;
			$tmp = $box [$a];
			$box [$a] = $box [$j];
			$box [$j] = $tmp;
			$result .= chr ( ord ( $string [$i] ) ^ ($box [($box [$a] + $box [$j]) % 256]) );
		}
		
		if ($operation == 'DECODE') {
			if ((substr ( $result, 0, 10 ) == 0 || substr ( $result, 0, 10 ) - time () > 0) && substr ( $result, 10, 16 ) == substr ( md5 ( substr ( $result, 26 ) . $keyb ), 0, 16 )) {
				return substr ( $result, 26 );
			} else {
				return '';
			}
		} else {
			return $keyc . str_replace ( '=', '', base64_encode ( $result ) );
		}
	}
	
	public static function getBirthdayByIDCard($IDCard){
		if(!eregi("^[1-9]([0-9a-zA-Z]{17}|[0-9a-zA-Z]{14})$",$IDCard)){
// 			"格式错误";
			return false;
		}else{
			if(strlen($IDCard)==18){
				$tyear=intval(substr($IDCard,6,4));
				$tmonth=intval(substr($IDCard,10,2));
				$tday=intval(substr($IDCard,12,2));
				if($tyear>date("Y")||$tyear<(date("Y")-100)){
					$flag=0;
				}
				elseif($tmonth<0||$tmonth>12){
					$flag=0;
				}
				elseif($tday<0||$tday>31){
					$flag=0;
				}else{
// 					$tdate=$tyear."-".$tmonth."-".$tday." 00:00:00";
					$tdate=$tyear."-".$tmonth."-".$tday;
					if((time()-mktime(0,0,0,$tmonth,$tday,$tyear))>18*365*24*60*60){
						$flag=0;
					}else{
						$flag=1;
					}
				}
				 
			}elseif(strlen($IDCard)==15){
				$tyear=intval("19".substr($IDCard,6,2));
				$tmonth=intval(substr($IDCard,8,2));
				$tday=intval(substr($IDCard,10,2));
				if($tyear>date("Y")||$tyear<(date("Y")-100)){
					$flag=0;
				}
				elseif($tmonth<0||$tmonth>12){
					$flag=0;
				}
				elseif($tday<0||$tday>31){
					$flag=0;
				}else{
// 					$tdate=$tyear."-".$tmonth."-".$tday." 00:00:00";
					$tdate=$tyear."-".$tmonth."-".$tday;
					if((time()-mktime(0,0,0,$tmonth,$tday,$tyear))>18*365*24*60*60){
						$flag=0;
					}else{
						$flag=1;
					}
				}
			}
		}
		return $tdate;
		}
	/**
	 * 根据生日计算年龄
	 *
	 * @param string $birthday
	 *        	生日
	 * @return integer
	 */
	public static function getAgeByBirthday($birthday) {
		$birthday = getDate ( strtotime ( $birthday ) );
		$now = getDate ();
		$month = 0;
		if ($now ['month'] > $birthday ['month'])
			$month = 1;
		if ($now ['month'] == $birthday ['month'])
			if ($now ['mday'] >= $birthday ['mday'])
				$month = 1;
		return $now ['year'] - $birthday ['year'] + $month;
	}
	
	/**
	 * 根据生日计算星座
	 * @param unknown_type $birthday
	 * @param unknown_type $format
	 * @return NULL|Ambigous <unknown, string>
	 */
	public static function getConstellationByBirthday($birthday, $format = null){
		if (!$birthday){
			return '';
		}
		$pattern = '/^\d{4}-\d{1,2}-\d{1,2}$/';
		if (! preg_match ( $pattern, $birthday, $matchs )) {
			return '';
		}
		$date = explode ( '-', $birthday );
		$year = $date [0];
		$month = $date [1];
		$day = $date [2];
		if ($month < 1 || $month > 12 || $day < 1 || $day > 31) {
			return null;
		}
		// 设定星座数组
		$constellations = array (
				'摩羯座',
				'水瓶座',
				'双鱼座',
				'白羊座',
				'金牛座',
				'双子座',
				'巨蟹座',
				'狮子座',
				'处女座',
				'天秤座',
				'天蝎座',
				'射手座'
		);
		
		// 设定星座结束日期的数组，用于判断
		$enddays = array (
				19,
				18,
				20,
				20,
				20,
				21,
				22,
				22,
				22,
				22,
				21,
				21
		);
		// 如果参数format被设置，则返回值采用format提供的数组，否则使用默认的数组
		
		if ($format != null) {
			$values = $format;
		} else {
			$values = $constellations;
		}
		// 根据月份和日期判断星座
		switch ($month) {
			case 1 :
				if ($day <= $enddays [0]) {
					$constellation = $values [0];
				} else {
					$constellation = $values [1];
				}
				break;
			case 2 :
				if ($day <= $enddays [1]) {
					$constellation = $values [1];
				} else {
					$constellation = $values [2];
				}
				break;
			case 3 :
				if ($day <= $enddays [2]) {
					$constellation = $values [2];
				} else {
					$constellation = $values [3];
				}
				break;
			case 4 :
				if ($day <= $enddays [3]) {
					$constellation = $values [3];
				} else {
					$constellation = $values [4];
				}
				break;
			case 5 :
				if ($day <= $enddays [4]) {
					$constellation = $values [4];
				} else {
					$constellation = $values [5];
				}
				break;
			case 6 :
				if ($day <= $enddays [5]) {
					$constellation = $values [5];
				} else {
					$constellation = $values [6];
				}
				break;
			case 7 :
				if ($day <= $enddays [6]) {
					$constellation = $values [6];
				} else {
					$constellation = $values [7];
				}
				break;
			case 8 :
				if ($day <= $enddays [7]) {
					$constellation = $values [7];
				} else {
					$constellation = $values [8];
				}
				break;
			case 9 :
				if ($day <= $enddays [8]) {
					$constellation = $values [8];
				} else {
					$constellation = $values [9];
				}
				break;
			case 10 :
				if ($day <= $enddays [9]) {
					$constellation = $values [9];
				} else {
					$constellation = $values [10];
				}
				break;
			case 11 :
				if ($day <= $enddays [10]) {
					$constellation = $values [10];
				} else {
					$constellation = $values [11];
				}
				break;
			case 12 :
				if ($day <= $enddays [11]) {
					$constellation = $values [11];
				} else {
					$constellation = $values [0];
				}
				break;
		}
		return $constellation;
	}
	
	/**
	 * 根据文件生成文件的实际文件夹
	 * @param string $filename
	 * @return BOOL
	 */
	public static function makedir($filename)
	{
		$dir = dirname ( $filename );
		if (file_exists ( $dir )) {
			@chmod ( $dir, 0777 );
		}
		if (@mkdir ( $dir, 0777, true )) {
			@chmod ( $dir, 0777 );
		}
		if (! is_writable ( $dir )) {
			return false;
		}
		return true;
	}

	/**
	 * 检测是否是手机设备
	 *
	 * @return boolean
	 */
	public static function isMobileDevice() {
		$user_agent = $_SERVER ['HTTP_USER_AGENT'];
		$mobile_agents = Array (
				"240x320",
				"acer",
				"acoon",
				"acs-",
				"abacho",
				"ahong",
				"airness",
				"alcatel",
				"amoi",
				"android",
				"anywhereyougo.com",
				"applewebkit/525",
				"applewebkit/532",
				"asus",
				"audio",
				"au-mic",
				"avantogo",
				"becker",
				"benq",
				"bilbo",
				"bird",
				"blackberry",
				"blazer",
				"bleu",
				"cdm-",
				"compal",
				"coolpad",
				"danger",
				"dbtel",
				"dopod",
				"elaine",
				"eric",
				"etouch",
				"fly ",
				"fly_",
				"fly-",
				"go.web",
				"goodaccess",
				"gradiente",
				"grundig",
				"haier",
				"hedy",
				"hitachi",
				"htc",
				"huawei",
				"hutchison",
				"inno",
				"ipad",
				"ipaq",
				"ipod",
				"jbrowser",
				"kddi",
				"kgt",
				"kwc",
				"lenovo",
				"lg ",
				"lg2",
				"lg3",
				"lg4",
				"lg5",
				"lg7",
				"lg8",
				"lg9",
				"lg-",
				"lge-",
				"lge9",
				"longcos",
				"maemo",
				"mercator",
				"meridian",
				"micromax",
				"midp",
				"mini",
				"mitsu",
				"mmm",
				"mmp",
				"mobi",
				"mot-",
				"moto",
				"nec-",
				"netfront",
				"newgen",
				"nexian",
				"nf-browser",
				"nintendo",
				"nitro",
				"nokia",
				"nook",
				"novarra",
				"obigo",
				"palm",
				"panasonic",
				"pantech",
				"philips",
				"phone",
				"pg-",
				"playstation",
				"pocket",
				"pt-",
				"qc-",
				"qtek",
				"rover",
				"sagem",
				"sama",
				"samu",
				"sanyo",
				"samsung",
				"sch-",
				"scooter",
				"sec-",
				"sendo",
				"sgh-",
				"sharp",
				"siemens",
				"sie-",
				"softbank",
				"sony",
				"spice",
				"sprint",
				"spv",
				"symbian",
				"tablet",
				"talkabout",
				"tcl-",
				"teleca",
				"telit",
				"tianyu",
				"tim-",
				"toshiba",
				"tsm",
				"up.browser",
				"utec",
				"utstar",
				"verykool",
				"virgin",
				"vk-",
				"voda",
				"voxtel",
				"vx",
				"wap",
				"wellco",
				"wig browser",
				"wii",
				"windows ce",
				"wireless",
				"xda",
				"xde",
				"zte",
                "okhttp"
		);
		$is_mobile = false;
		foreach ( $mobile_agents as $device ) {
			if (stristr ( $user_agent, $device )) {
				$is_mobile = true;
				break;
			}
		}
		return $is_mobile;
	}

    /**
     * 检测是否是 iPhone
     * @return bool
     */
    public static function isIphone(){
        $user_agent = $_SERVER ['HTTP_USER_AGENT'];
        $is_iphone = (strpos(strtolower($user_agent), 'iphone')) ? true : false;
        return $is_iphone;
    }
    /**
     * 检测是否是 Android
     * @return bool
     */
    public static function isAndroid(){
        $user_agent = $_SERVER ['HTTP_USER_AGENT'];
        $is_iphone = (strpos(strtolower($user_agent), 'android')) ? true : false;
        return $is_iphone;
    }

    /**
     * @desc 生成时分秒
     * @param int $seconds
     * @return string
     */
    public static function genLastTime($seconds=0){
        $hour = 0;
        if ($seconds>=3600){
            $hour = floor($seconds/3600);
        }
//        echo '$hour=',$hour,'<br/>';
        $min = 0;
        if (($seconds-($hour*3600))>=60){
            $min = floor(($seconds-($hour*3600)) / 60);
        }
//        echo '$min=',$min,'<br/>';
        $seconds = $seconds - $hour*3600 - $min*60;

//        echo '$seconds=',$seconds,'<br/>';
//        exit;
        return $hour.'小时'.$min.'分'.$seconds.'秒';
    }
	/**
	 * 生成短链
	 *
	 * @param string $url
	 *        	长链接
	 * @return string 短链接
	 */
	public static function genShortUrl($url) {
		//$appKey = EasyConfig::get ( 'wb.appKey' );
        $appKey = WEIBO_KEY;
		if (! $appKey) {
			return $url;
		}
		$apiUrl = 'http://api.t.sina.com.cn/short_url/shorten.json?source=' . $appKey . '&url_long=' . urlencode($url);
//		$response = file_get_contents ( $apiUrl ); // 获取json的内容
        $response = self::getByCURL($apiUrl );
        $json = json_decode ( $response ); // 对json格式内容进行编码
		$short = isset($json [0]->url_short)  && $json [0]->url_short?  $json [0]->url_short : $url;
        $short = str_replace('http://','',$short);
        $short = str_replace('https://','',$short);
        return $short;// 返回短链
	}
	/**
	 * 根据时间戳格式化创建时间
	 *
	 * @param integer $time
	 * @return string 刚刚|5秒前|10分钟前|2小时前|昨天|2月12日 15:10|9月9日|2015年1月29日
	 */
	public static function genCreateDate($time = NULL) {
		$text = '';
		$time = $time === NULL || $time > time () ? time () : intval ( $time );
		$t = time () - $time; // 时间差 （秒）
		$y = date ( 'Y', $time ) - date ( 'Y', time () ); // 是否跨年
		switch ($t) {
			case $t == 0 :
				$text = '刚刚';
				break;
			case $t < 60 :
				$text = $t . '秒前'; // 一分钟内
				break;
			case $t < 60 * 60 :
				$text = floor ( $t / 60 ) . '分钟前'; // 一小时内
				break;
			case $t < 60 * 60 * 24 :
				$text = floor ( $t / (60 * 60) ) . '小时前'; // 一天内
				break;
			case $t < 60 * 60 * 24 * 3 :
				$text = floor ( $time / (60 * 60 * 24) ) == 1 ? '昨天 ' . date ( 'H:i', $time ) : '前天 ' . date ( 'H:i', $time ); // 昨天和前天
				break;
			case $t < 60 * 60 * 24 * 30 :
				$text = date ( 'm月d日 H:i', $time ); // 一个月内
				break;
			case $t < 60 * 60 * 24 * 365 && $y == 0 :
				$text = date ( 'm月d日', $time ); // 一年内
				break;
			default :
				$text = date ( 'Y年m月d日', $time ); // 一年以前
				break;
		}
		if ($t == 0) {
			$text = '刚刚';
		}
		return $text;// $text.'['.$t.']';
	}
	/**
	 * 根据PHP各种类型变量生成唯一标识号
	 * @param mixed $mix 变量
	 * @return string
	 */
	public static function genGuidString($mix) {
		if (is_object($mix)) {
			return spl_object_hash($mix);
		} elseif (is_resource($mix)) {
			$mix = get_resource_type($mix) . strval($mix);
		} else {
			$mix = serialize($mix);
		}
		return md5($mix);
	}
	/**
	 * 获取ip信息
	 * @param string $ip
	 */
	public static function getIpAddress($ip=NULL){
		if (!$ip) {
			$ip = EasyUtility::getRealIp();
		}
		if ($ip == '127.0.0.1'){
            return '-';
        }
		$res = self::getIpLookUp($ip);
		$return = '';
		if (isset($res['province'])){
		    $return .= $res['province'];
        }
		if (isset($res['city'])){
		    $return .= '-'.$res['city'];
        }
		return $return;
		$ipContent   = @file_get_contents("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=".$ip);
		if ($ipContent){
            $jsonData = explode("=",$ipContent);
            if (isset($jsonData[1])){
                $jsonData = substr($jsonData[1], 0, -1);
                return $jsonData;
            }
        }
        return '-';
	}

    /**
     * @desc 获取ip的查询信息
     * @param $ip
     * @return bool|mixed|string
     */
	public static function getIpLookUp($ip){
	    if (!$ip){
	        $ip = self::getRealIp();
        }
        $key = 'lib_easy_php_getiplookup_'.md5($ip);
        $data = EasyFileCache::get($key);
        if ($data){
            return $data;
        }
        /*
        $res = @file_get_contents('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip='.$ip);
        if (empty($res)){
            return '';
        }
        $jsonMatches = [];
        preg_match('#\{.+?\}#', $res, $jsonMatches);
        if (!isset($jsonMatches[0])){
            return '';
        }
        $json = json_decode($jsonMatches[0], true);
        if (isset($json['ret']) && $json['ret'] == 1){
            $json['ip'] = $ip;
            unset($json['ret']);
        }else{
            return '';
        }
        //*/
        $res = @file_get_contents('http://ip.ws.126.net/ipquery?ip='.$ip);
//        return $res;
        if (!$res){
            return '';
        }
        $jsonData = explode("{",$res);
        $jsonData = explode("}",$jsonData[1]);
        $jsonData = explode(",",$jsonData[0]);
//        echo json_encode($jsonData);
        $json['province'] = explode(':',$jsonData[1]);
        $json['province'] = $json['province'][1];
        $json['city'] = explode(':',$jsonData[0]);
        $json['city'] = $json['city'][1];
        EasyFileCache::set($key, $json);
        return $json;
    }
	/**
	 * 判断是否从微信浏览器访问
	 * @return boolean
	 */
	public static function isInWeChat(){
		$user_agent = $_SERVER['HTTP_USER_AGENT'];
		if (strpos($user_agent, 'MicroMessenger') === false) {
			return false;
		} else {
			return true;
		}
		return false;
	}

    /**
     * 是否是IE浏览器
     * @return bool|int
     */
	public static function isIE(){
        $isIE = strpos(strtolower($_SERVER['HTTP_USER_AGENT']),"triden");
        return $isIE;
    }
    /**
     * emoji表情编码
     * @param $str
     * @return string
     */
	public static function emoji_encode($str){
        $strEncode = '';

        $length = mb_strlen($str,'utf-8');

        for ($i=0; $i < $length; $i++) {
            $_tmpStr = mb_substr($str,$i,1,'utf-8');
            if(strlen($_tmpStr) >= 4){
                $strEncode .= '[[EMOJI:'.rawurlencode($_tmpStr).']]';
            }else{
                $strEncode .= $_tmpStr;
            }
        }

        return $strEncode;
    }

    /**
     * emoji表情解码
     * @param $str
     * @return mixed
     */
    public static function emoji_decode($str){
        $strDecode = preg_replace_callback('|\[\[EMOJI:(.*?)\]\]|', function($matches){
            return rawurldecode($matches[1]);
        }, $str);

        return $strDecode;
    }

    /**
     * @desc 美化开始和结束时间
     * @param $start
     * @param $end
     * @param string $short
     * @return string
     */
    public static function beautyDatetime($start,$end,$short='~'){
        $start_timestamp = strtotime($start);
        $start_y = date('Y',$start_timestamp);
        $start_m = date('m',$start_timestamp);
        $start_d = date('d',$start_timestamp);
        $end_timestamp = strtotime($end);
        $end_y = date('Y',$end_timestamp);
        $end_m = date('m',$end_timestamp);
        $end_d = date('d',$end_timestamp);
        if ($start_y==$end_y){

            return $start_y.'-'.$start_m.'-'.$start_d.$short.$start_m.'-'.$end_d;
        }else{
            return $start_y.'-'.$start_m.'-'.$start_d.$short.$end_y.'-'.$end_m.'-'.$end_d;
        }
    }

    /**
     * @desc 格式化 pv
     * @param int $pv
     * @return int|string
     */
    public static function formatPv($pv=0){
        if (intval($pv)==0){
            return 0;
        }

        if ($pv >= 100000000 && $pv%100000000>=0){
            //100,000,000
            return floor($pv/100000000).floor(($pv%100000000)/10000000).'b+'; //亿
        }
        if ($pv >= 1000000 && $pv%1000000>=0){
            //1,000,000
            return floor($pv/1000000).floor(($pv%1000000)/100000).'m+'; //百万
        }
        if ($pv >= 100000 && $pv%100000>=0){
            //100,000
            return floor($pv/100000).floor(($pv%100000)/10000).'w+'; //十万
        }
        if ($pv >= 10000 && $pv%10000>=0){
            //10,000
            return floor($pv/10000).floor(($pv%10000)/1000).'k+'; //万
        }
        if ($pv >= 1000 && $pv%1000>=0){
            //1,000
            return floor($pv/1000).'.'.floor(($pv%1000)/100).'k+'; //千
        }
        return $pv;
    }
}
```
- EasyValidate.php

```php
<?php
namespace lib\easy_php;
/**
 *验证类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
final class EasyValidate {
	static public function is_php($version = '5.0.0') {
		static $_is_php;
		$version = ( string ) $version;
		
		if (! isset ( $_is_php [$version] )) {
			$_is_php [$version] = (version_compare ( PHP_VERSION, $version ) < 0) ? FALSE : TRUE;
		}
		return $_is_php [$version];
	}
	
	/**
	 * 检测是否为中文
	 *
	 * @param string $email
	 *        	email字符串.
	 * @return bool true | false
	 */
	static public function isChinese($str, $charset = 'utf8') {
		if ('utf8' == $charset) {
			return preg_match ( "/^[\x{4e00}-\x{9fa5}]+$/u", $str );
		} elseif ('gb2312' == $charset) {
			return preg_match ( "/^[" . chr ( 0xa1 ) . "-" . chr ( 0xff ) . "A-Za-z0-9_]+$/", $str );
		} else {
			return false;
		}
	}
	
	/**
	 * 检测email
	 *
	 * @param string $email
	 *        	email字符串.
	 * @return bool true | false
	 */
	static public function isEmail($email) {
		return preg_match ( "/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ix", $email );
	}
	
	/**
	 * 检测整数
	 *
	 * @param string $int
	 *        	整数字符串.
	 * @return bool true | false
	 */
	static public function isInt($int) {
		return is_int ( $int );
	}
	
	/**
	 * 检测变量是否为数字或数字字符串
	 *
	 * @param string $numeric
	 *        	变量字符串
	 * @return bool true | false true | false
	 */
	static public function isNumeric($numeric) {
		return is_int ( $numeric );
	}
	
	/**
	 * 检测浮点数
	 *
	 * @param string $float
	 *        	浮点数字符串.
	 * @return bool true | false
	 */
	static public function isFloat($float) {
		return is_float ( $float );
	}
	
	/**
	 * 检测字符串是否仅含数字和字母
	 *
	 * @param string $alnum
	 *        	变量字符串.
	 * @return bool true | false
	 */
	static public function isAlnum($alnum) {
		return preg_match ( '/^[a-z0-9]+$/i', $alnum );
	}
	
	/**
	 * 检测字符串是否仅含标点符号
	 *
	 * @param string $punct
	 *        	变量字符串.
	 * @return bool true | false
	 */
	static public function isPunct($punct) {
		return preg_match ( '/^[[:punct:]]$/', $punct );
	}
	
	/**
	 * 检测字符串是否仅字母
	 *
	 * @param string $alpha
	 *        	变量字符串
	 * @return bool true | false
	 */
	static public function isAlpha($alpha) {
		return preg_match ( '/^[a-z]+$/i', $alpha );
	}
	
	/**
	 * 检测日期是否合法，默认为检查YYYY-MM-DD格式
	 *
	 * @param
	 *        	string
	 * @param
	 *        	string
	 * @return bool true | false
	 */
	static public function isDate($date, $format = 'Y-m-d') {
		$matchDate = date ( $format, strtotime ( $date ) );
		return $date && $date == $matchDate;
	}
	
	/**
	 * 检测数字或字符是否在$value之间
	 *
	 * @param
	 *        	string
	 * @param
	 *        	string
	 * @param
	 *        	string
	 * @return bool true | false
	 */
	static public function isBetween($value, $down, $up) {
		$ord = ord ( $value );
		return $ord > $down && $ord < $up;
	}
	
	/**
	 * 检测字符串长度
	 *
	 * @param string $value
	 *        	变量字符串.
	 * @param integer $min
	 *        	最小值.
	 * @param integer $max
	 *        	最大值.
	 * @return bool true | false
	 */
	static public function isStrLength($value, $min = 0, $max = NULL) {
		return strlen ( $value ) > $min && strlen ( $value ) < $max;
	}
	
	/**
	 * 检测是否为合法邮编
	 *
	 * @param string $postcode
	 *        	邮编.
	 * @return bool true | false
	 */
	static public function isPostcode($postcode) {
		$mobile = null;
		return preg_match ( "/^[0-9]{6}$/", $mobile );
	}
	
	/**
	 * 检测是否为合法电话号码
	 *
	 * @param string $mobile
	 *        	电话号码.
	 * @return bool true | false
	 */
	static public function isMobile($mobile) {
		return preg_match ( "/^[0-9]{11}$/", $mobile );
	}
	/**
	 * 检测是否为合法的身份证号码
	 *
	 * @param string $idcard
	 *        	身份证号码
	 * @return boolean
	 */
	static public function isIdCard($idcard) {
		$vCity = array (
				'11',
				'12',
				'13',
				'14',
				'15',
				'21',
				'22',
				'23',
				'31',
				'32',
				'33',
				'34',
				'35',
				'36',
				'37',
				'41',
				'42',
				'43',
				'44',
				'45',
				'46',
				'50',
				'51',
				'52',
				'53',
				'54',
				'61',
				'62',
				'63',
				'64',
				'65',
				'71',
				'81',
				'82',
				'91' 
		);
		
		if (! preg_match ( '/^([\d]{17}[xX\d]|[\d]{15})$/', $idcard ))
			return false;
		
		if (! in_array ( substr ( $idcard, 0, 2 ), $vCity ))
			return false;
		
		$idcard = preg_replace ( '/[xX]$/i', 'a', $idcard );
		$vLength = strlen ( $idcard );
		
		if ($vLength == 18) {
			$vBirthday = substr ( $idcard, 6, 4 ) . '-' . substr ( $idcard, 10, 2 ) . '-' . substr ( $idcard, 12, 2 );
		} else {
			$vBirthday = '19' . substr ( $idcard, 6, 2 ) . '-' . substr ( $idcard, 8, 2 ) . '-' . substr ( $idcard, 10, 2 );
		}
		
		if (date ( 'Y-m-d', strtotime ( $vBirthday ) ) != $vBirthday)
			return false;
		if ($vLength == 18) {
			$vSum = 0;
			
			for($i = 17; $i >= 0; $i --) {
				$vSubStr = substr ( $idcard, 17 - $i, 1 );
				$vSum += (pow ( 2, $i ) % 11) * (($vSubStr == 'a') ? 10 : intval ( $vSubStr, 11 ));
			}
			
			if ($vSum % 11 != 1)
				return false;
		}
		
		return true;
	}
}
```
- dirty.inc.php

```php
<?php
namespace lib\easy_php\dirty;
// vim: set expandtab tabstop=4 shiftwidth=4 fdm=marker:
// +----------------------------------------------------------------------+
// | Tencent PHP Library.                                                 |
// +----------------------------------------------------------------------+
// | Copyright (c) 2004-2005 Tencent Inc. All Rights Reserved.            |
// +----------------------------------------------------------------------+
// | Authors: The Internet Services Dept., Tencent.                       |
// |          hyperjiang <hyperjiang@tencent.com>                         |
// +----------------------------------------------------------------------+

/**
 * @file    qp_dirty.php ( orginal: qp_dirty.php )
 * @version 1.0
 * @author  hyperjiang
 * @date    2005/11/14
 * @brief   class for filtrate dirty words.
 */


/**
 * QP DIRTY lib class.
 */
class qp_dirty
{
    /**
     * @access  private
     * @var     resource    File name.
     */
    var $file_name = "";

    /**
     * @access  private
     * @var     array       Dirty words.
     */
    var $dirty_words;

    /**
     * @access  private
     * @var     string      Separator.
     */
    var $sep = '|';

    /**
     * @access  private
     * @var     string      Note.
     */
    var $note = '#';

    /**
     * @access  private
     * @var     int         Level. 
     * @note    0: all levers, other: the higher the value, the lower the lever.
     */
    var $lev = 0;

    /**
     * @access  private
     * @var     string      Mark.
     */
    var $mark = '$';


    /* function qp_dirty( $filename, $lev, $sep, $note, $mark ) */
    /**
     * Initialize.
     *
     * @param   string  $filename   File name.
     * @param   int     $lev        Level.
     * @param   string  $sep        Separator.
     * @param   string  $note       Note.
     * @param   string  $mark       Mark.
     * @return          0: suc, other: fail.
     */
    function __construct( $filename = '', $lev = 0, $sep = '|', $note = '#', $mark = '$' )
    {
        $this->file_name    = $filename;
        $this->sep          = $sep;
        $this->note         = $note;
        $this->lev          = $lev;
        $this->mark         = $mark;
        if ( !empty($filename) ) {
            $this->read_dirty( $filename );
        } else {
            return(-1);
        } // if
        return(0);
    }
    /* }}} */
    
    function __destruct()
    {
    	
    }


    /*function set_file( $filename ) */
    /**
     * Set file.
     *
     * @param   string  $filename   File name.
     */
    function set_file( $filename )
    {
        $this->file_name = $filename;
        return(0);
    }
    /* }}} */


    /*function set_level( $lev ) */
    /**
     * Set level.
     *
     * @param   int     $lev        Level.
     */
    function set_level( $lev = 0 )
    {
        $this->lev = $lev;
        return(0);
    }
    /* }}} */


    /*function set_sep( $sep ) */
    /**
     * Set separator.
     *
     * @param   string  $sep        Separator.
     */
    function set_sep( $sep = '|' )
    {
        $this->sep = $sep;
        return(0);
    }
    /* }}} */


    /*function set_note( $note ) */
    /**
     * Set note.
     *
     * @param   string  $note       Note.
     */
    function set_note( $note = '#' )
    {
        $this->note = $note;
        return(0);
    }
    /* }}} */


    /*function set_mark( $mark ) */
    /**
     * Set mark.
     *
     * @param   string  $mark       Mark.
     */
    function set_mark( $mark = '$' )
    {
        $this->mark = $mark;
        return(0);
    }
    /* }}} */


    /*function read_dirty( $filename ) */
    /**
     * Read dirty words from file.
     *
     * @return  int     0: ok, other: fail.
     */
    function read_dirty( $filename = '' )
    {
        if ( empty($filename) ) {
            $filename = $this->file_name;
        } // if

        $lines = file( $filename );
        if ( empty($lines) ) {
            return(-1);
        } // if

        $level = 1;
        foreach ( $lines as $line ) {
            $line = trim( $line );
            if ( empty($line) ) {
                continue;
            } // if
            if ( $this->note == $line[0] ) {
                continue;
            } // if
            if ( $this->mark == $line[0] ) {
                $tmp    = explode( $this->mark, $line );
                $level  = trim( @$tmp[1] );
                continue;
            } // if
            $word = explode( $this->sep, $line );
            $this->dirty_words[ trim($word[0]) ] = $level;
        } // foreach
        return(0);
    }   
    /* }}} */


    /*function is_dirty( $word ) */
    /**
     * Check if a word is dirty.
     *
     * @param   string  $word       Note.
     * @return  int     1: dirty, 0: not dirty.
     */
    function is_dirty( $word )
    {
        $key = 'lib_easy_php_dirty_is_dirty_'.md5($word);
        $data = EasyFileCache::get($key);
        if ($data){
            return(1);
        }
        if ( !empty($this->dirty_words[$word]) 
                && ( ($this->dirty_words[$word] <= $this->lev)
                        || 0 == $this->lev ) ) {
            EasyFileCache::set($key, true);
            return(1);
        } // if
        return(0);
    }
    /* }}} */


    /*function has_dirty( $str ) */
    /**
     * Check if a string has dirty words.
     *
     * @param   string  $str        String.
     * @return  string  0: no dirty word, other: the dirty word found.
     */
    function has_dirty( $str )
    {
        reset( $this->dirty_words );
        while ( list($key, $val) = each($this->dirty_words) ) {
            if ( function_exists( "iconv_strpos" ) ) {
                $ret = @iconv_strpos( $str, $key, 0, "utf-8" );
            } else {
                $ret = strpos( $str, $key );
            } // if function_exists

            if ( $ret !== false 
                    && ( ($val <= $this->lev) || 0 == $this->lev ) ) {
                return( $key );
            } // if
        } // while
        return(0);
    }
    /* }}} */
    
    /**
     * 替换脏字程序
     * 将匹配到的脏字替换为***字符串
     *
     * @param string $source 源字串
     * @param string $target 目标字串，使用引用传递值
     * @return 0/errorno
     */
    function replace_dirty($source,&$target)
    {
    	$replace_str='***';
    	$target=$source;
    	foreach ($this->dirty_words as $key => $value)
    	{
    		$target=str_replace($key,$replace_str,$target);
    	}
    	return 0;
    }
}
?>

```
- dirty.txt

```
张三|
李四|
王五|
```


<div id="gitalk-container"></div>
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
<script src="/assets/js/md5.min.js"></script>
<script type="text/javascript">
const gitalk = new Gitalk({
  clientID: 'c8000586a21c80291476',
  clientSecret: '043d2b75bd32c8d03f65d088bbd475c563a287f4',
  repo: 'imoowi.github.io',
  owner: 'imoowi',
  admin: ['imoowi'],
  distractionFreeMode: false,
  id: md5(location.href)
});
gitalk.render('gitalk-container')
</script>