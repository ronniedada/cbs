package main

import (
	"testing"
)

func BenchmarkViewFetch(b *testing.B) {
	for i := 0; i < b.N; i++ {
		fetchView("ram", "os_ram_sizes", "0")
	}
}
