package main

import (
	"flag"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func rewriteURL(to string, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = to
		h.ServeHTTP(w, r)
	})
}

func showError(w http.ResponseWriter, r *http.Request,
	msg string, code int) {
	log.Printf("Reporting error %v/%v", code, msg)
	http.Error(w, msg, code)
}

func main() {
	addr := flag.String("addr", ":2569", "http listen address")
	flag.Parse()

	r := mux.NewRouter()
	r.HandleFunc("/api/bar/{ddoc}/{view}/{offset:[0-9]+}/{limit:[0-9]+}", serveBarChart).Methods("GET")
	r.HandleFunc("/api/line/{ddoc}/{view}/{offset:[0-9]+}/{limit:[0-9]+}", serveLineChart).Methods("GET")

	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	// application pages
	appPages := []string{
		"/chart/",
	}

	for _, p := range appPages {
		r.PathPrefix(p).Handler(rewriteURL("app.html",
			http.FileServer(http.Dir("static"))))
	}

	r.Handle("/", http.RedirectHandler("/static/app.html", 302))
	http.Handle("/", r)

	log.Printf("Listening on %v", *addr)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
