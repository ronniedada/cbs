package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/couchbaselabs/go-couchbase"
	"github.com/gorilla/mux"
)

var db *couchbase.Bucket

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
	cbServ := flag.String("couchbase", "http://localhost:8091/",
		"URL to couchbase")
	cbBucket := flag.String("bucket", "default", "couchbase bucket")
	flag.Parse()

	r := mux.NewRouter()
	r.HandleFunc("/api/bar/{ddoc}/{view}/", serveBarChart).Methods("GET")
	r.HandleFunc("/api/line/{ddoc}/{view}/", serveLineChart).Methods("GET")
	r.HandleFunc("/api/stackedbar/{ddoc}/{view}/", serveStackedBarChart).Methods("GET")

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

	var err error
	db, err = dbConnect(*cbServ, *cbBucket)
	if err != nil {
		log.Printf("Error connecting to couchbase server: %v", err)
	}

	defer db.Close()

	log.Printf("Listening on %v", *addr)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
