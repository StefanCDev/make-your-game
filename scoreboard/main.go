package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"scoreboard/dal"
	"sort"
	"strconv"
)

const (
	expectedArgc   int    = 2
	defaultPortStr string = ":8080"
)

func main() {
	argc := len(os.Args)
	var portStr string
	switch argc {
	case expectedArgc:
		portArg, err := strconv.ParseUint(os.Args[1], 10, 16)
		if err != nil {
			log.Fatal("invalid port number specified")
		}
		port := uint16(portArg)
		portStr = fmt.Sprintf(":%v", port)
	default:
		portStr = defaultPortStr
	}
	err := dal.Setup()
	if err != nil {
		log.Fatal(err.Error())
	}
	http.HandleFunc("/api/highscores", GetHighScores)
	http.HandleFunc("/api/score", PostScore)
	err = http.ListenAndServe(portStr, nil)
	if err != nil {
		log.Fatal(err.Error())
	}
}

func GetHighScores(w http.ResponseWriter, r *http.Request) {
	logRequest(r)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	statusCode := http.StatusOK
	switch r.Method {
	case http.MethodGet:
		scores, err := dal.GetAllScores()
		if err != nil {
			statusCode = http.StatusInternalServerError
			logResponse(statusCode)
			http.Error(w, "There was a problem retrieving the high scores from the database.", statusCode)
			return
		}
		if len(scores) > 100 {
			scores = scores[:100]
		}
		sort.Slice(scores, func(i, j int) bool {
			if scores[i].Score < scores[j].Score {
				return false
			}
			if scores[i].Score > scores[j].Score {
				return true
			}
			return scores[i].Time < scores[j].Time
		})
		var result []dal.ScoreResponseDTO
		for i, v := range scores {
			next := dal.ScoreResponseDTO{ID: v.ID, Rank: i + 1, Percentile: (i + 1) * 100 / len(scores), Name: v.Name, Score: v.Score}
			minStr := strconv.Itoa(v.Time / 60)
			sec := v.Time % 60
			var secStr string
			if sec < 10 {
				secStr = fmt.Sprintf("0%d", sec)
			} else {
				secStr = strconv.Itoa(sec)
			}
			next.Time = fmt.Sprintf("%s:%s", minStr, secStr)
			result = append(result, next)
		}
		w.WriteHeader(statusCode)
		jsonEncoder := json.NewEncoder(w)
		err = jsonEncoder.Encode(result)
		if err != nil {
			statusCode = http.StatusInternalServerError
			logResponse(statusCode)
			http.Error(w, "There was a problem retrieving the high scores from the database.", statusCode)
			return
		}
		logResponse(statusCode)
	default:
		statusCode = http.StatusBadRequest
		logResponse(statusCode)
		errMsg := fmt.Sprintf("Only %s HTTP methods are allowed at %s endpoint.", http.MethodGet, r.URL.Path)
		http.Error(w, errMsg, statusCode)
		return
	}
}

func PostScore(w http.ResponseWriter, r *http.Request) {
	var rowId int64
	logRequest(r)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	statusCode := http.StatusCreated
	switch r.Method {
	case http.MethodPost:
		jsonDecoder := json.NewDecoder(r.Body)
		var s dal.ScoreRequestDTO
		err := jsonDecoder.Decode(&s)
		if err != nil {
			statusCode = http.StatusBadRequest
			logResponse(statusCode)
			http.Error(w, "Invalid Score Format.", statusCode)
			return
		}
		rowId, err = dal.InsertScore(s)
		if err != nil {
			statusCode = http.StatusInternalServerError
			logResponse(statusCode)
			http.Error(w, "There was a problem adding the score to the database.", statusCode)
			return
		}

	default:
		statusCode = http.StatusBadRequest
		logResponse(statusCode)
		errMsg := fmt.Sprintf("Only %s HTTP methods are allowed at %s endpoint.", http.MethodPost, r.URL.Path)
		http.Error(w, errMsg, statusCode)
		return
	}
	w.WriteHeader(statusCode)
	idStr := strconv.Itoa(int(rowId))
	w.Write([]byte(idStr))
}

func logRequest(r *http.Request) {
	log.Printf("Request Received - Method: %s. Endpoint: %s\n", r.Method, r.URL.Path)
}

func logResponse(statusCode int) {
	log.Printf("Response - Status Code: %d\n", statusCode)
}
