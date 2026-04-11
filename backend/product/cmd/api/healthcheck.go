package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func (app *application) healthcheckHandler(w http.ResponseWriter, r *http.Request) {
	env := envelope{
		"status": "available",
		"system_info": map[string]string{
			"environment": app.config.env,
			"version":     version,
		},
	}

	jsonData, err := json.MarshalIndent(env, "", "  ")
	if err != nil {
		log.Fatal("marshal json")
	}

	jsonData = append(jsonData, '\n')

	w.Write(jsonData)
}
