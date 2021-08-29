package models

import (
	"github.com/eruca/bisel-next/btypes"
	"github.com/eruca/bisel-next/middlewares"
)

const (
	Expire = 122
	Salt   = "bisel"
)

var (
	JwtAction    = middlewares.JWTAuthorize(&JwtSess{}, Salt)
	LoginHandler = middlewares.ConfigLoginHandler(Expire, Salt)
)

// JwtSess 是作为自己定义JWT里需要存放的数据
type JwtSess struct {
	UserId uint
}

func (jwt *JwtSess) New() btypes.JwtSession {
	return &JwtSess{}
}

func (jwt *JwtSess) UserID() uint { return jwt.UserId }
