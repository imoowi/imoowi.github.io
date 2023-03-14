---
layout: default
title:  "Golang-goRESTApiGen(RESTFUL API 生成器)"
parent: 手把手教你
---

# goRESTApiGen
## goRESTApiGen是什么？
goRESTApiGen 是一个用go语言写的 RESTFUL API 生成工具，支持生成控制器、service层和model层，包括swagger注释，目前只支持mongodb
## 安装
```go
go install github.com/imoowi/goRESTApiGen@latest
```
## 使用
切换到项目根目录下，执行以下操作
```go
goRESTApiGen -a appname
```
例如我要生成对商品（goods）的api
```go
$ goRESTApiGen -a goods
module=goRESTApiGen-goods
appname= goods
path= goods
service= goods
model= goods
modelpath makedir success.
modelFile path =  ./models/goods.model.go
file[models/GoodsModel.model.go] generated!
servicepath makedir success.
modelFile path =  ./services/goods.service.go
file[services/GoodsService.service.go] generated!
apppath makedir success.
modelFile path =  ./app/goods/goods.handler.go
file[app/goods/goods.handler.go] generated!
modelFile path =  ./app/goods/router.go
file[app/goods/router.go] generated!
```
会生成以下文件
```go
$ tree
.
|-- app
|   `-- goods
|       |-- goods.handler.go
|       `-- router.go
|-- go.mod
|-- models
|   `-- goods.model.go
`-- services
    `-- goods.service.go

4 directories, 5 files
```
- app/goods/goods.handler.go

```go

package goods
import (
	"net/http"
	"github.com/gin-gonic/gin"
	"goRESTApiGen-goods/models"
	"goRESTApiGen-goods/services"
	"github.com/imoowi/goRESTApiGen/util/response"
	"github.com/spf13/cast"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var goodsService *services.GoodsService
	

//	@Summary	列表
//	@Tags		goods
//	@Accept		application/json
//	@Produce	application/json
//	@Param		Authorization	header	string	true	"Bearer 用户令牌"
//	@Param		page			query	int		true	"页码 (1)"
//	@Param		pageSize		query	int		false	"页数"
//	@Success	200
//	@Failure	400
//	@Failure	500
//	@Router		/api/goods [get]
func List(c *gin.Context) {
	searchKey := c.DefaultQuery("searchKey", "")
	page := cast.ToInt64(c.DefaultQuery("page", "1"))
	pageSize := cast.ToInt64(c.DefaultQuery("pageSize", "20"))
	pages, list := goodsService.List(searchKey, page, pageSize)
	res := gin.H{
		"pages": pages,
		"list":  list,
	}
	response.OK(res, c)
}



//	@Summary	添加
//	@Tags		goods
//	@Accept		application/json
//	@Produce	application/json
//	@Param		Authorization	header	string				true	"Bearer 用户令牌"
//	@Param		body			body	models.GoodsModel	true	"models.GoodsModel"
//	@Success	200
//	@Failure	400
//	@Failure	500
//	@Router		/api/goods [post]
func Add(c *gin.Context) {
	var goodsModel *models.GoodsModel
	err := c.ShouldBindJSON(&goodsModel)
	if err != nil {
		response.Error(err.Error(), http.StatusBadRequest, c)
		return
	}
	id, err := goodsService.Add(goodsModel)
	if err != nil {
		response.Error(err.Error(), http.StatusBadRequest, c)
		return
	}
	response.OK(id, c)
}


//	@Summary	修改
//	@Tags		goods
//	@Accept		application/json
//	@Produce	application/json
//	@Param		Authorization	header	string				true	"Bearer 用户令牌"
//	@Param		id				query	string				true	"id"
//	@Param		body			body	models.GoodsModel	true	"models.GoodsModel"
//	@Success	200
//	@Failure	400
//	@Failure	500
//	@Router		/api/goods/:id [put]
func Update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error("pls input id", http.StatusBadRequest, c)
		return
	}
	var goodsModel *models.GoodsModel
	err := c.ShouldBindJSON(&goodsModel)
	if err != nil {
		response.Error(err.Error(), http.StatusBadRequest, c)
		return
	}
	goodsModel.Id, err = primitive.ObjectIDFromHex(id)
	if err != nil {
		response.Error(err.Error(), http.StatusBadRequest, c)
		return
	}
	updated, err := goodsService.Update(goodsModel)
	if err != nil {
		response.Error(err.Error(), http.StatusBadRequest, c)
		return
	}
	response.OK(updated, c)
}


//	@Summary	删除
//	@Tags		goods
//	@Accept		application/json
//	@Produce	application/json
//	@Param		Authorization	header	string	true	"Bearer 用户令牌"
//	@Param		id				query	string	true	"id"
//	@Success	200
//	@Failure	400
//	@Failure	500
//	@Router		/api/goods/:id [delete]
func Delete(c *gin.Context) {
	id := c.Param("id")
	if id == " "{
		response.Error("pls input id", http.StatusBadRequest, c)
		return
	}
	deleted, err := goodsService.Delete(id)
	if err != nil {
		response.Error(err.Error(), http.StatusBadRequest, c)
		return
	}
	response.OK(deleted, c)
}

//	@Summary	单个信息
//	@Tags		goods
//	@Accept		application/json
//	@Produce	application/json
//	@Param		Authorization	header	string	true	"Bearer 用户令牌"
//	@Param		id				query	string	true	"id"
//	@Success	200
//	@Failure	400
//	@Failure	500
//	@Router		/api/goods/:id [get]
func GetOne(c *gin.Context) {
	id := c.Param("id")
	if id == " "{
		response.Error("pls input id", http.StatusBadRequest, c)
		return
	}
	info, err := goodsService.GetOne(id)
	if err != nil {
		response.Error(err.Error(), http.StatusBadRequest, c)
		return
	}
	response.OK(info, c)
}



```
- app/goods/router.go

```go

package goods
import (
	"goRESTApiGen-goods/middleware"
	"goRESTApiGen-goods/router"

	"github.com/gin-gonic/gin"
)

func init() {
	router.RegisterRoute(Routers)
}


func Routers(e *gin.Engine) {

	e.Use(middleware.RuntimeMiddleware())
	_goods := e.Group("/api/goods")
	{
		//验证登录
		_goods.Use(middleware.JWTAuthMiddleware())
		//验证权限
		_goods.Use(middleware.CasbinMiddleware())

		_goods.GET("", List)
		_goods.POST("", Add)
		_goods.PUT("/:id", Update)
		_goods.DELETE("/:id", Delete)
		_goods.GET("/:id", GetOne)
	}
}


```
- models/goods.model.go

```go

package models

import (
	"context"
	"log"
	"time"
	"goRESTApiGen-goods/global"
	"github.com/imoowi/goRESTApiGen/util/response"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)
const TABLE_NAME_GOODS = "goods"

type GoodsModel struct {
	Id        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name      string             `json:"name" bson:"name" binding:"required"`
	CreatedAt int64              `json:"createdAt" bson:"createdAt"`
	Deleted   bool               `json:"-" bson:"deleted"`
	// add your code below

}
	
// 列表
func (m *GoodsModel) List(searchKey string, page int64, pageSize int64) (pages response.Pages, res []*GoodsModel) {
	coll := global.Mongo.Collection(TABLE_NAME_GOODS)
	filter := bson.M{}
	filter["deleted"] = false
	if searchKey != "" {
		filter["name"] = bson.M{"$regex": primitive.Regex{Pattern: searchKey, Options: "i"}}
	}

	count, err := coll.CountDocuments(context.TODO(), filter)
	if err != nil {
		log.Fatal(err)
	}
	cur, err := coll.Find(context.TODO(),
			filter,
			options.Find().SetLimit(pageSize),
			options.Find().SetSkip(pageSize*(page-1)),
			options.Find().SetSort(bson.M{
				"createdAt": -1,
			}),
	)
	if err != nil {
		log.Fatal(err)
	}
	cur.All(context.TODO(), &res)
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	cur.Close(context.TODO())
	pages = response.MakePages(count, page, pageSize)
	return
}	

// 添加
func (m *GoodsModel) Add(goodsModel *GoodsModel) (newId string, err error) {
	goodsModel.CreatedAt = time.Now().Unix()
	coll := global.Mongo.Collection(TABLE_NAME_GOODS)
	res, err := coll.InsertOne(context.TODO(), goodsModel)
	insertedId := res.InsertedID
	newId = insertedId.(primitive.ObjectID).Hex()
	return
}


// 修改
func (m *GoodsModel) Update(goodsModel *GoodsModel) (updated bool, err error) {
	coll := global.Mongo.Collection(TABLE_NAME_GOODS)
	_id, _ := primitive.ObjectIDFromHex(goodsModel.Id.Hex())
	wareByte, _ := bson.Marshal(goodsModel)
	updateFields := bson.M{}
	bson.Unmarshal(wareByte, &updateFields)
	update := bson.M{
		"$set": updateFields,
	}
	res, err := coll.UpdateByID(context.TODO(), _id, update)
	return res.ModifiedCount > 0, err
}



// 软删除
func (m *GoodsModel) Delete(id string) (deleted bool, err error) {
	coll := global.Mongo.Collection(TABLE_NAME_GOODS)
	_id, _ := primitive.ObjectIDFromHex(id)
	updateFields := bson.M{}
	updateFields["deleted"] = true
	update := bson.M{
		"$set": updateFields,
	}
	res, err := coll.UpdateByID(context.TODO(), _id, update)
	return res.ModifiedCount > 0, err
}


// 查询一个
func (m *GoodsModel) GetOne(id string) (goodsModel *GoodsModel, err error) {
	coll := global.Mongo.Collection(TABLE_NAME_GOODS)
	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id, "deleted": false}
	err = coll.FindOne(context.TODO(), filter).Decode(&goodsModel)
	return
}


```
- services/goods.service.go

```go
package services

import (
	"goRESTApiGen-goods/models"
	"github.com/imoowi/goRESTApiGen/util/response"
)
var goodsModel *models.GoodsModel
type GoodsService struct {
	
}

// 列表
func (s *GoodsService) List(searchKey string, page int64, pageSize int64) (pages response.Pages, res []*models.GoodsModel) {
	pages, res = goodsModel.List(searchKey, page, pageSize)
	return
}

// 添加
func (s *GoodsService) Add(lightModel *models.GoodsModel) (newId string, err error) {
	newId, err = goodsModel.Add(lightModel)
	return
}


// 修改
func (s *GoodsService) Update(lightModel *models.GoodsModel) (updated bool, err error) {
	updated, err = goodsModel.Update(lightModel)
	return
}


// 删除
func (s *GoodsService) Delete(id string) (deleted bool, err error) {
	deleted, err = goodsModel.Delete(id)
	return
}

// 查询一个
func (s *GoodsService) GetOne(id string) (lightModel *models.GoodsModel, err error) {
	lightModel, err = goodsModel.GetOne(id)
	return
}


```
## 项目地址
[https://github.com/imoowi/goRESTApiGen](https://github.com/imoowi/goRESTApiGen){:target="_blank"}