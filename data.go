package main

import (
	"log"
	"fmt"
	"io"
	"encoding/csv"
)

type ViewResults struct {
	TotalRows 	float64 			`json:"total_rows"`
	Offset		float64				`json:"offset"`
	
	Rows []struct {
		Id		string				`json:"id"`
		Key		[]interface{}		`json:"key"`
        Value	interface{}			`json:"value"`
    }	 							`json:"rows"`  
}

func (vr ViewResults) histo() []map[interface{}]int {
	log.Println("gen histogram")
	if vr.Rows == nil || len(vr.Rows) == 0 {
		log.Println("Error generating histogram : empty result set")
		return nil
	}
	histo := make([]map[interface{}]int, len(vr.Rows[0].Key))
	for _, row := range vr.Rows {
		for i, v := range row.Key {
			if c, ok := histo[i][v]; ok {
				histo[i][v] = c + 1
			} else {
				if histo[i] == nil {
					histo[i] = make(map[interface{}]int)
				}
				histo[i][v] = 1
			}
		}
	}
	return histo
}

func (vr ViewResults) bar(histo map[interface{}]int,
		axes []string, writer io.Writer) {
		
	if len(axes) != 2 {
		log.Println("Error generating bar data : invalid title length")
		return
	}
	
	c := csv.NewWriter(writer)
	c.Write(axes)
	
	for k, v := range histo {
		c.Write([]string{fmt.Sprintf("%v", k), fmt.Sprintf("%d", v)})
	}
	
	c.Flush()
}

func (vr ViewResults) line(histo map[interface{}]int,
		axes []string, writer io.Writer) {
	vr.bar(histo, axes, writer);
}