package main

import (
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

func serveBarChart(w http.ResponseWriter, r *http.Request) {
	ddoc, view, offset, limit :=
		mux.Vars(r)["ddoc"], mux.Vars(r)["view"], mux.Vars(r)["offset"], mux.Vars(r)["limit"]

	vr, err := fetchView(ddoc, view, limit)

	if err != nil {
		showError(w, r, err.Error(), 404)
		return
	}

	histo := vr.histo()
	if len(histo) == 0 {
		showError(w, r, "oops, empty results", 404)
		return
	}
	axes := []string{"x", "y"}
	i, _ := strconv.Atoi(offset)
	vr.bar(histo[i], axes, w)
}

func serveLineChart(w http.ResponseWriter, r *http.Request) {
	ddoc, view, offset, limit :=
		mux.Vars(r)["ddoc"], mux.Vars(r)["view"], mux.Vars(r)["offset"], mux.Vars(r)["limit"]

	vr, err := fetchView(ddoc, view, limit)

	if err != nil {
		showError(w, r, err.Error(), 404)
		return
	}

	histo := vr.histo()
	if len(histo) == 0 {
		showError(w, r, "oops, empty results", 404)
		return
	}
	axes := []string{"x", "y"}
	i, _ := strconv.Atoi(offset)
	vr.line(histo[i], axes, w)
}
