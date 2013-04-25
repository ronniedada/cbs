package main

import (
	"testing"
)

func BenchmarkViewFetch(b *testing.B) {
	var err error
	db, err = dbConnect("http://localhost:8091/", "default")
	if err != nil {
		b.Fatalf("unable to connect to Couchbase server: %v", err)
	}
	for i := 0; i < b.N; i++ {
		fetchView("ram", "os_ram_sizes")
	}
}
