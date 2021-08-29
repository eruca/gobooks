package settings

import (
	"github.com/eruca/bisel/btypes"
	"github.com/eruca/bisel/logger"
	"github.com/eruca/bisel/middlewares"
	"gorm.io/datatypes"
)

const tableName = "settings"

type Setting struct {
	btypes.GormModel
	Key     string            `json:"key,omitempty"`
	Value   datatypes.JSON    `json:"value,omitempty"`
	Comment btypes.NullString `json:"comment,omitempty"`
}

func (set *Setting) New() btypes.Tabler {
	return &Setting{}
}

func (*Setting) TableName() string { return tableName }

func (set *Setting) Register(handlers map[string]btypes.ContextConfig) {
	// 这里的j实际上是Manager.New时传入的对象
	// 这个对象应该一直都是空值，只是作为调用
	handlers[tableName+"/fetch"] = btypes.QueryHandler(set, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/insert"] = btypes.InsertHandler(set, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/update"] = btypes.UpdateHandler(set, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/delete"] = btypes.DeleteHandler(set, middlewares.TimeElapsed, middlewares.UseCache)
}

func (set *Setting) Push(db *btypes.DB, cacher btypes.Cacher, log logger.Logger,
	crt btypes.ConfigResponseType) btypes.Responder {

	return btypes.DefaultPush(db, cacher, log, crt, set, "fetch")
}
