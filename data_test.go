package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"testing"
)

func TestViewResultsUnmarshaling(t *testing.T) {
	js := `{"total_rows":3,"offset":0,"rows":[
		{"id":"id0","key":[0, 1],"value":0},
		{"id":"id1","key":[1, 2],"value":1},
		{"id":"id2","key":[2, 3],"value":2}
		]}`

	vr := new(ViewResults)
	d := json.NewDecoder(strings.NewReader(js))

	if err := d.Decode(vr); err != nil {
		t.Fatalf("Error unmarshal to json object: %v", err)
	}

	// verify
	if vr.TotalRows != 3 || vr.Offset != 0 {
		t.Fatalf("TotalRows or Offset doesn't match")
	}

	for i, row := range vr.Rows {
		if row.Id != fmt.Sprintf("id%d", i) {
			t.Fatalf("Id doesn't match: expected %v, got %v", i, row.Id)
		} else if v, ok := row.Value.(float64); !ok || v != float64(i) {
			t.Fatalf("Values don't match: expected %v, got %v, ok %v", i, v, ok)
		}
		for j, key := range row.Key {
			if v, ok := key.(float64); !ok || v != float64(i+j) {
				t.Fatalf("Keys don't match: expected %v, got %v, ok %v, i %v, v %v",
					float64(i+j), v, ok, i, v)
			}
		}
	}
}
