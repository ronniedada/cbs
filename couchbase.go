package main

import (
	"log"

	"github.com/couchbaselabs/go-couchbase"
)

func dbConnect(serv, bucket string) (*couchbase.Bucket, error) {

	log.Printf("Connecting to couchbase bucket %v at %v",
		bucket, serv)
	rv, err := couchbase.GetBucket(serv, "default", bucket)
	if err != nil {
		return nil, err
	}

	return rv, nil
}

func fetchView(ddoc string, view string, args map[string]interface{}) (ViewResults, error) {
	log.Printf("fetching view: ddoc = %v, view = %v, args = %v", ddoc, view, args)

	vr := ViewResults{}
	err := db.ViewCustom(ddoc, view, args, &vr)

	return vr, err
}
