package dal

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

type ScoreRequestDTO struct {
	ID    int
	Name  string
	Score int
	Time  int
}

type ScoreResponseDTO struct {
	ID         int
	Rank       int
	Percentile int
	Name       string
	Score      int
	Time       string
}

const (
	driver string = "sqlite3"
	dbPath string = "./scoreboard.db"
)

var Db *sql.DB

func Setup() error {
	var err error
	Db, err = sql.Open(driver, dbPath)
	if err != nil {
		return err
	}
	stmt, err := Db.Prepare(`
		CREATE TABLE IF NOT EXISTS "scores" (
			"id" INTEGER PRIMARY KEY AUTOINCREMENT,
			"name" NVARCHAR(20) NOT NULL,
			"score" INTEGER NOT NULL,
			"time" INTEGER NOT NULL
		);`)
	if err != nil {
		return err
	}
	_, err = stmt.Exec()
	if err != nil {
		return err
	}
	return nil
}

// CRUD
func InsertScore(requestDTO ScoreRequestDTO) (int64, error) {
	// scoreDTO := ConvertScoreToDTO(scoreRequest)
	stmt, err := Db.Prepare(`INSERT INTO "scores" (
		name,
		score,
		time) VALUES (?, ?, ?);`)
	if err != nil {
		return -1, err
	}
	res, err := stmt.Exec(requestDTO.Name, requestDTO.Score, requestDTO.Time)
	if err != nil {
		return -1, err
	}
	return res.LastInsertId()
}

func GetAllScores() ([]ScoreRequestDTO, error) {
	rows, err := Db.Query(`SELECT * FROM "scores"`)
	if err != nil {
		return nil, err
	}
	var result []ScoreRequestDTO
	for rows.Next() {
		var next ScoreRequestDTO
		err = rows.Scan(&next.ID, &next.Name, &next.Score, &next.Time)
		if err != nil {
			return nil, err
		}
		result = append(result, next)
	}
	return result, nil
}
