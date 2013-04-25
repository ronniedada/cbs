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

func fetchView(ddoc string, view string) (ViewResults, error) {
	log.Printf("fetching view: ddoc = %v, view = %v", ddoc, view)

	vr := ViewResults{}
	err := db.ViewCustom(ddoc, view, nil, &vr)

	return vr, err
}
