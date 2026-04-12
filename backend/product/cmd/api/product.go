package main

import "net/http"

func (app *application) createProductHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Message From createProductHandler\n"))
}
