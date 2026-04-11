package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	target, err := url.Parse("http://localhost:5000")
	if err != nil {
		log.Fatal(err)
	}
	proxy := httputil.NewSingleHostReverseProxy(target)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Mount("/", proxy)

	s := http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	err = s.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
