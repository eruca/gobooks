package author

import (
	"github.com/eruca/bisel-next/bin/utils"
	"github.com/eruca/bisel-next/btypes"
	"github.com/eruca/bisel-next/logger"
	"github.com/eruca/bisel-next/middlewares"
)

const tableName = "authors"

type Author struct {
	btypes.GormModel
	NameChinese  btypes.NullString `json:"name_chinese,omitempty"`
	Pinyin       btypes.NullString `json:"pinyin,omitempty"`
	NameEnglish  btypes.NullString `json:"name_english,omitempty"`
	Nationality  uint              `json:"nationality,omitempty"`
	Introduction btypes.NullString `json:"introduction,omitempty"`
}

func (*Author) New() btypes.Tabler { return &Author{} }
func (*Author) TableName() string  { return tableName }
func (au *Author) Register(handlers map[string]btypes.ContextConfig) {

	// 这里的j实际上是Manager.New时传入的对象
	// 这个对象应该一直都是空值，只是作为调用
	handlers[tableName+"/fetch"] = btypes.QueryHandler(au, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/insert"] = btypes.InsertHandler(au, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/update"] = btypes.UpdateHandler(au, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/delete"] = btypes.DeleteHandler(au, middlewares.TimeElapsed, middlewares.UseCache)
}

func (author *Author) Insert(c *btypes.Context, _ btypes.Tabler, jwt btypes.JwtSession) (result btypes.Result, err error) {
	c.Logger.Infof("into dict Insert")
	if author.NameChinese.Valid && (!author.Pinyin.Valid || author.Pinyin.String == "") {
		author.Pinyin.String = utils.FirstLetters(author.NameChinese.String)
		author.Pinyin.Valid = true
	}

	result, err = author.GormModel.Insert(c, author, jwt)
	if err != nil {
		return
	}
	result.Payloads.Push("data", author)
	return
}

func (author *Author) Update(c *btypes.Context, _ btypes.Tabler, jwt btypes.JwtSession) (result btypes.Result, err error) {
	c.Logger.Infof("update Dict")
	if author.NameChinese.Valid && (!author.Pinyin.Valid || author.Pinyin.String == "") {
		author.Pinyin.String = utils.FirstLetters(author.NameChinese.String)
		author.Pinyin.Valid = true
	}

	result, err = author.GormModel.Update(c, author, jwt)
	if err != nil {
		return
	}
	result.Payloads.Push("data", author)
	return
}

func (au *Author) Push(db *btypes.DB, cacher btypes.Cacher, log logger.Logger,
	crt btypes.ConfigResponseType) btypes.Responder {

	return btypes.DefaultPush(db, cacher, log, crt, au, "fetch")
}
