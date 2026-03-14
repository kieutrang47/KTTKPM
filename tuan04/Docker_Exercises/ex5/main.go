package main
import (
    "fmt"
    "net/http"
)
func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello Trang! Day la ung dung Go chay tu Docker")
    })
    fmt.Println("Server dang khoi chay tai cong 8080...")
    http.ListenAndServe(":8080", nil)
}