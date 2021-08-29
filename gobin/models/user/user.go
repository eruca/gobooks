package user

import (
	"fmt"

	"github.com/eruca/bisel/btypes"
	"github.com/eruca/bisel/middlewares"
	"github.com/eruca/gobooks/gobin/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/datatypes"
)

const tableName = "users"

var (
	_ btypes.Tabler       = (*User)(nil)
	_ middlewares.Loginer = (*User)(nil)
)

type User struct {
	btypes.GormModel
	Email     string            `json:"email,omitempty"`
	Password  string            `json:"password,omitempty"`
	Name      string            `json:"name,omitempty"`
	Role      int               `json:"role"`
	Privilege int               `json:"privilege"`
	Settings  datatypes.JSONMap `json:"settings,omitempty"`
}

func (*User) New() btypes.Tabler { return &User{} }

func (user *User) TableName() string { return tableName }

func (user *User) Register(handlers map[string]btypes.ContextConfig) {
	handlers[tableName+"/fetch"] = btypes.QueryHandler(user, middlewares.TimeElapsed, models.JwtAction, middlewares.UseCache)
	handlers[tableName+"/insert"] = btypes.InsertHandler(user, middlewares.TimeElapsed, middlewares.UseCache)
	handlers[tableName+"/update"] = btypes.UpdateHandler(user, middlewares.TimeElapsed, models.JwtAction, middlewares.UseCache)
	handlers[tableName+"/delete"] = btypes.DeleteHandler(user, middlewares.TimeElapsed, models.JwtAction, middlewares.UseCache)

	handlers[tableName+"/login"] = models.LoginHandler(user, &models.JwtSess{}, middlewares.TimeElapsed)
	// todo: UseCache好像可以删除
	handlers[tableName+"/logout"] = middlewares.LogoutHandler(user, middlewares.TimeElapsed, models.JwtAction, middlewares.UseCache)
}

func (*User) QueryOmits() []string { return []string{"password"} }

func (user *User) Insert(c *btypes.Context, _ btypes.Tabler, jwt btypes.JwtSession) (result btypes.Result, err error) {
	c.Logger.Infof("into user Insert")
	if user.Password == "" {
		err = fmt.Errorf("the password from client is nil")
		c.Logger.Warnf(err.Error())
		return
	}

	var pswd []byte
	pswd, err = bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.Logger.Warnf(err.Error())
		return
	}
	user.Password = string(pswd)

	return user.GormModel.Insert(c, user, jwt)
}

func (user *User) GetAccount() btypes.PairStringer {
	return btypes.PairStringer{
		Key:   "email",
		Value: btypes.ValueString(user.Email),
	}
}

func (user *User) GetPassword() btypes.PairStringer {
	return btypes.PairStringer{
		Key:   "password",
		Value: btypes.ValueString(user.Password),
	}
}

func (user *User) DeletePassword() { user.Password = "" }

func (user *User) PessimisticLock() bool { return true }
