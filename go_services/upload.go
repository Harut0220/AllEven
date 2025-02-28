package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
	"github.com/gin-gonic/gin"
	"math/rand"
	"github.com/gabriel-vasile/mimetype"
)


func uploadSingleFile(ctx *gin.Context) {
	file, header, err := ctx.Request.FormFile("file")
	file2, header2, err2 := ctx.Request.FormFile("file") // hard
	if err != nil {
		ctx.String(http.StatusBadRequest, fmt.Sprintf("file err : %s", err.Error()))
		return
	}

	if err2 != nil {
		ctx.String(http.StatusBadRequest, fmt.Sprintf("file err : %s", err.Error()))
		return
	}

	_ = header2

	mimetype.SetLimit(0) // No limit, whole file content used.

	mtype, err := mimetype.DetectReader(file2)


	fileExt := mtype.Extension()

	originalFileName := strings.TrimSuffix(filepath.Base(header.Filename), fileExt)
	now := time.Now()
	filename := strings.ReplaceAll(strings.ToLower(originalFileName), " ", "-") +  "-" + fmt.Sprintf("%v", rand.Intn(10000)) + "-" + fmt.Sprintf("%v", now.Unix()) + fileExt
	filePath := "uploads/" + filename

	out, err := os.Create("../storage/uploads/" + filename)

	if err != nil {
		log.Fatal(err)
	}
	defer out.Close()
	_, err = io.Copy(out, file)
	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, gin.H{"path": filePath})
}

func uploadMultipleFile(ctx *gin.Context) {
	form, _ := ctx.MultipartForm()
	files := form.File["file"]

	filePaths := []string{}
	for _, file := range files {
		readerFileF, _ := file.Open()
		mtype, err := mimetype.DetectReader(readerFileF)

		fileExt := mtype.Extension()
		originalFileName := strings.TrimSuffix(filepath.Base(file.Filename), mtype.Extension())
		now := time.Now()
		filename := strings.ReplaceAll(strings.ToLower(originalFileName), " ", "-") + "-" + fmt.Sprintf("%v", rand.Intn(10000)) + "-" + fmt.Sprintf("%v", now.Unix()) + fileExt
		filePath := "uploads/" + filename

		filePaths = append(filePaths, filePath)
		out, err := os.Create("../storage/uploads/" + filename)
		if err != nil {
			log.Fatal(err)
		}
		defer out.Close()

		readerFile, _ := file.Open()

		_, err = io.Copy(out, readerFile)
		if err != nil {
			log.Fatal(err)
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"paths": filePaths})
	
}

func main() {
	router := gin.Default()
	rand.Seed(time.Now().UnixNano())


	router.POST("/upload/single", uploadSingleFile)
	router.POST("/upload/multiple", uploadMultipleFile)

	router.Run(":8000")
}
