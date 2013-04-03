package main

import (
	"log"
	"fmt"
	"net/http"
	"encoding/json"
)

const baseURL = "http://ronniedada:Ronnie25@single.couchbase.net/cbstats"

// couchdb go lib does not work well, so here we go

func fetchView(ddoc string, view string, limit string) (vr *ViewResults, err error) {
	log.Println("fetching view")
	url := fmt.Sprintf("%s/_design/%s/_view/%s?reduce=false", baseURL, ddoc, view)
	
	if limit != "" && limit != "0" {
		url = fmt.Sprintf("%s&limit=%s", url, limit)
	}
	
	res, err := http.Get(url)
	if  err != nil {
		return nil, err
	}
	
	vr = new(ViewResults)
	d := json.NewDecoder(res.Body)
	if err = d.Decode(vr); err != nil {
		return nil, err
	}
	
	log.Println(url)
	return vr, err
}