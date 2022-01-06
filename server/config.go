package main

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	DB struct {
		URL      string `mapstructure:"url"`
		Host     string `mapstructure:"host"`
		Port     int    `mapstructure:"port"`
		User     string `mapstructure:"user"`
		Password string `mapstructure:"pass"`
		Name     string `mapstructure:"dbname"`
	} `mapstructure:"psql"`

	Server struct {
		Port int `mapstructure:"port"`
	} `mapstructure:"api"`
}

func LoadConfig() *Config {
	viper.AutomaticEnv()

	config := &Config{}
	if viper.GetString("HEROKU_ENV") == "" {
		viper.SetConfigName("app")
		viper.AddConfigPath(".")
		viper.SetConfigType("toml")
		if err := viper.ReadInConfig(); err != nil {
			panic(err)
		}
		if err := viper.Unmarshal(&config); err != nil {
			panic(err)
		}

		config.DB.URL = fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable", config.DB.User, config.DB.Password, config.DB.Host, config.DB.Port, config.DB.Name)
	} else {
		config.Server.Port = viper.GetInt("PORT")
		config.DB.URL = viper.GetString("DATABASE_URL")
	}

	return config
}
