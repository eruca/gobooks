package dict

import (
	"github.com/eruca/bisel/btypes"
	"github.com/eruca/bisel/logger"
	"github.com/eruca/bisel/middlewares"
	"github.com/eruca/gobooks/gobin/utils"
	"github.com/lib/pq"
)

const tableName = "dicts"

var _ btypes.Tabler = (*Dict)(nil)

type Dict struct {
	btypes.GormModel
	Category string            `json:"category,omitempty"`
	FatherID uint              `json:"father_id,omitempty" gorm:"default:0"`
	Tags     pq.Int64Array     `json:"tags,omitempty" gorm:"type:int[]"`
	Name     string            `json:"name,omitempty" gorm:"unique"`
	Pinyin   string            `json:"pinyin,omitempty"`
	Desc     btypes.NullString `json:"desc,omitempty"`
	AuthorId uint              `json:"author_id,omitempty"`
}

func (dict *Dict) New() btypes.Tabler {
	return &Dict{}
}

func (*Dict) TableName() string { return tableName }
func (*Dict) Size() int         { return -1 }

func (dict *Dict) Register(handlers map[string]btypes.ContextConfig) {
	// 这里的j实际上是Manager.New时传入的对象
	// 这个对象应该一直都是空值，只是作为调用
	handlers[tableName+"/fetch"] = btypes.QueryHandler(dict, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/insert"] = btypes.InsertHandler(dict, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/update"] = btypes.UpdateHandler(dict, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/delete"] = btypes.DeleteHandler(dict, middlewares.TimeElapsed, middlewares.UseCache)
}

func (dict *Dict) Insert(c *btypes.Context, _ btypes.Tabler, jwt btypes.JwtSession) (result btypes.Result, err error) {
	c.Logger.Infof("into dict Insert")
	if dict.Pinyin == "" {
		dict.Pinyin = utils.FirstLetters(dict.Name)
	}
	result, err = dict.GormModel.Insert(c, dict, jwt)
	if err != nil {
		return
	}
	result.Payloads.Push("data", dict)
	result.Broadcast = true
	return
}

func (dict *Dict) Update(c *btypes.Context, _ btypes.Tabler, jwt btypes.JwtSession) (result btypes.Result, err error) {
	c.Logger.Infof("update Dict")
	if dict.Pinyin == "" {
		dict.Pinyin = utils.FirstLetters(dict.Name)
	}
	result, err = dict.GormModel.Update(c, dict, jwt)
	if err != nil {
		return
	}
	result.Payloads.Push("data", dict)
	result.Broadcast = true
	return
}

func (dict *Dict) Delete(c *btypes.Context, _ btypes.Tabler, jwt btypes.JwtSession) (result btypes.Result, err error) {
	result, err = dict.GormModel.Delete(c, dict, jwt)
	if err != nil {
		return
	}
	result.Payloads.Push("data", dict)
	result.Broadcast = true
	return
}

func (dict *Dict) Push(db *btypes.DB, cacher btypes.Cacher, log logger.Logger,
	crt btypes.ConfigResponseType) btypes.Responder {

	return btypes.DefaultPush(db, cacher, log, crt, dict, "fetch")
}
