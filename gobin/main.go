package main

import (
	"fmt"
	_ "net/http/pprof"
	"os"

	"github.com/DeanThompson/ginpprof"
	"github.com/eruca/bisel/cache"
	"github.com/eruca/bisel/logger"
	"github.com/eruca/bisel/manager"
	"github.com/eruca/gobooks/gobin/models"
	"github.com/eruca/gobooks/gobin/models/author"
	"github.com/eruca/gobooks/gobin/models/book"
	"github.com/eruca/gobooks/gobin/models/dict"
	"github.com/eruca/gobooks/gobin/models/settings"
	"github.com/eruca/gobooks/gobin/models/user"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	host   = "localhost"
	dbname = "gobooks"
)

func main() {
	logging := logger.NewLogger(logger.LogStderr)

	dsn := fmt.Sprintf("host=%s user=nick password=nickwill dbname=%s sslmode=disable TimeZone=Asia/Shanghai", host, dbname)
	logging.Infof(dsn)

	// db 作为元数据存储的数据库
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logging.Errorf("cannot open db: %v", err)
		os.Exit(1)
	}
	// 开启debug
	db = db.Debug()
	// gin.SetMode(gin.ReleaseMode)

	// Manager
	manager := manager.New(db, cache.New(logging), logging,
		models.JwtAction, nil, "pess/lock",
		&user.User{}, &dict.Dict{}, &author.Author{}, &book.Book{}, &settings.Setting{})

	// 配置gin
	engine := gin.Default()
	engine.Use(cors())
	// engine.GET("/", index)
	// engine.StaticFS("/static", http.Dir("./static"))
	manager.InitSystem(engine, nil)
	ginpprof.Wrap(engine)

	err = engine.Run(":8080")
	if err != nil {
		logging.Errorf("Router.Run: %v", err)
		os.Exit(1)
	}
}

// func index(c *gin.Context) {
// 	http.ServeFile(c.Writer, c.Request, "static/index.html")
// }

// CORSMiddleware 实现跨域
func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
