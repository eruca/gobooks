package book

import (
	"github.com/eruca/bisel-next/btypes"
	"github.com/eruca/bisel-next/logger"
	"github.com/eruca/bisel-next/middlewares"
	"github.com/lib/pq"
)

const tableName = "books"

type Book struct {
	btypes.GormModel
	// 中英文书名
	NameChinese btypes.NullString `json:"name_chinese,omitempty"`
	NameEnglish btypes.NullString `json:"name_english,omitempty"`
	ISBN        string            `json:"isbn,omitempty"`
	PublishYear int               `json:"publish_year,omitempty"`
	// 书系列
	BookSeries btypes.NullString `json:"book_series,omitempty"`
	// 标签
	Tags pq.Int64Array `json:"tags,omitempty" gorm:"type:int[]"`

	// 作者IDS
	AuthorsID    pq.Int64Array     `json:"authors_id,omitempty" gorm:"type:int[]"`
	PressesID    pq.Int64Array     `json:"presses_id,omitempty" gorm:"type:int[]"`
	Price        float64           `json:"price,omitempty"`
	Pages        int               `json:"pages,omitempty"`
	Introduction btypes.NullString `json:"introduction,omitempty"`

	// 3维及重量
	Length float64 `json:"length,omitempty"`
	Width  float64 `json:"width,omitempty"`
	Height float64 `json:"height,omitempty"`
	Weight float64 `json:"weight,omitempty"`

	Comment btypes.NullString `json:"comment,omitempty"`
}

func (book *Book) New() btypes.Tabler {
	return &Book{}
}

func (*Book) TableName() string { return tableName }

func (book *Book) Register(handlers map[string]btypes.ContextConfig) {
	// 这里的j实际上是Manager.New时传入的对象
	// 这个对象应该一直都是空值，只是作为调用
	handlers[tableName+"/fetch"] = btypes.QueryHandler(book, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/insert"] = btypes.InsertHandler(book, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/update"] = btypes.UpdateHandler(book, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/delete"] = btypes.DeleteHandler(book, middlewares.TimeElapsed, middlewares.UseCache)
}

func (book *Book) Push(db *btypes.DB, cacher btypes.Cacher, log logger.Logger,
	crt btypes.ConfigResponseType) btypes.Responder {

	return btypes.DefaultPush(db, cacher, log, crt, book, "fetch")
}
