package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"sort"
	"strconv"
)

type ViewResults struct {
	TotalRows float64 `json:"total_rows"`
	Offset    float64 `json:"offset"`

	Rows []struct {
		Id    string        `json:"id"`
		Key   []interface{} `json:"key"`
		Value interface{}   `json:"value"`
	} `json:"rows"`
}

func sortedKeys(histo map[interface{}]int) ([]string, bool) {
	var keys []string
	for k := range histo {
		if v, ok := k.(string); ok {
			keys = append(keys, v)
		} else {
			return keys, false
		}
	}
	sort.Strings(keys)
	return keys, true
}

func (vr ViewResults) histo() []map[interface{}]int {

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

	if keys, ok := sortedKeys(histo); ok {
		for _, k := range keys {
			c.Write([]string{fmt.Sprintf("%v", k), fmt.Sprintf("%d", histo[k])})
		}
	} else {
		for k, v := range histo {
			c.Write([]string{fmt.Sprintf("%v", k), fmt.Sprintf("%d", v)})
		}
	}

	c.Flush()
}

func (vr ViewResults) line(histo map[interface{}]int,
	axes []string, writer io.Writer) {
	vr.bar(histo, axes, writer)
}

func (vr ViewResults) stackedBar(xIndex int, rangeIndex int,
	ran int, writer io.Writer) {
	/*
		Sample output:

		x,0 to 10,10 to 20,20 to 30,30 to 40,40 to 50
		Chrome,247412,4095,179,717,146
		Firefox,82463,1139,2381,0,1
		IE,227005,910,0,0,0
		Opera,5287,116,5,0,0
		Others,70,0,0,0,0
		Safari,12563,179,47,0,0
		SeaMonkey,1,0,0,0,0
	*/
	c := csv.NewWriter(writer)
	bins := make(map[interface{}]map[interface{}]int)
	maxQuotient := 0

	for _, row := range vr.Rows {
		if _, ok := bins[row.Key[xIndex]]; !ok {
			bins[row.Key[xIndex]] = make(map[interface{}]int)
		}

		var quotient int
		if v, ok := row.Key[rangeIndex].(float64); ok {
			quotient = int(v) / ran
			if quotient > maxQuotient {
				maxQuotient = quotient
			}
		} else {
			continue
		}

		var val int
		var err error
		switch t := row.Value.(type) {
		case string:
			val, err = strconv.Atoi(t)
			if err != nil {
				val = 0
			}
		case float64:
			val = int(t)
		default:
			val = 0
		}

		if _, ok := bins[row.Key[xIndex]][quotient]; !ok {
			bins[row.Key[xIndex]][quotient] = val
		} else {
			bins[row.Key[xIndex]][quotient] += val
		}
	}

	var keys []string
	for k := range bins {
		if v, ok := k.(string); ok {
			keys = append(keys, v)
		}
	}
	sort.Strings(keys)

	title := []string{"x"}
	for i := 0; i < maxQuotient; i++ {
		title = append(title, fmt.Sprintf("%v to %v", i*ran, (i+1)*ran))
	}
	c.Write(title)
	for _, xaxis := range keys {
		line := []string{xaxis}
		for i := 0; i < maxQuotient; i++ {
			if v, ok := bins[xaxis][i]; ok {
				line = append(line, fmt.Sprintf("%v", v))
			} else {
				line = append(line, "0")
			}
		}
		c.Write(line)
	}

	c.Flush()
}
