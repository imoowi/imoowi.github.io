---
layout: default
title:  "laravel 命令"
parent: Php
---

# laravel 命令
- 参考地址 https://learnku.com/docs/laravel/8.x/installation/9354
- 创建项目

```bash
laravel new ProjectName
//或者使用composer
composer create-project --prefer-dist laravel/laravel ProjectName "6.*"
```

- 设置目录权限
```bash
cd ProjectName
chmod -R 777 storage bootstrap/cache
```
- 生成应用密匙
```bash
php artisan key:generate
```
- Nginx配置
```nginx
root /path/to/ProjectName
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```
- 创建 migrate

```bash
cd project_root
./artisan make:migration create_live_table

#打开 database/migrations/xxx_create_lives_table.php,填入以下内容
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLivesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lives', function (Blueprint $table) {
            $table->id();
            $table->string('liveid')->unique()->nullable(false)->comment('对外展示的直播 id');
            $table->string('title')->nullable(false)->comment('直播标题');
            $table->tinyInteger('status')->default(0)->comment('直播状态');//0 预约 1 直播中 2 直播结束 3 回放
            $table->string('cover')->nullable(false)->comment('直播封面');
            $table->text('content')->nullable()->comment('直播内容');
            $table->dateTime('start_time')->comment('直播开始时间');
            $table->string('rtmp')->nullable(false)->comment('推流地址');
            $table->string('m3u8')->nullable(false)->comment('m3u8 地址');
            $table->string('record')->comment('回放地址');
            $table->integer('uid')->nullable(false)->comment('创建者用户 id');
            $table->integer('oid')->nullable(false)->comment('组织 id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lives');
    }
}


```
- 创建 model

```bash
cd project_root
./artisan make:model Live
```
- 创建 controller
```bash
cd project_root
#这个命令将会生成一个控制器 app/Http/Controllers/LivesController.php
./artisan make:controller LivesController --resource
#接下来，你可以给控制器注册一个资源路由：
Route::resource('photos', PhotoController::class);
#你可以通过将数组传参到 resources 方法中的方式来一次性的创建多个资源控制器：
Route::resources([
    'photos' => PhotoController::class,
    'posts' => PostController::class,
]);
```
资源控制器操作处理

	| Verb	| URI	| Action	| Route Name |
	| ----- | ----- | --------- | ---------- |
	| GET	| /photos	| index	| photos.index |
	| GET	| /photos/create	| create	| photos.create |
	| POST	| /photos	| store	| photos.store |
	| GET	| /photos/{photo}	| show	| photos.show |
	| GET	| /photos/{photo}/edit	| edit	| photos.edit |
	| PUT/PATCH	| /photos/{photo}	| update	| photos.update |
	| DELETE	| /photos/{photo}	| destroy	| photos.destroy |

- 上传文件

```bash
php artisan storage:link

```



