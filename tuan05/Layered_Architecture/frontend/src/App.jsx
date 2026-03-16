import { useState, useEffect } from "react";

function App() {
  // Kho chứa dữ liệu: Danh sách bài viết, tiêu đề và nội dung đang nhập
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Gọi anh Shipper đi lấy danh sách bài viết từ Backend (Spring Boot)
  const fetchPosts = () => {
    fetch("http://localhost:8080/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Lỗi òi:", error));
  };

  // Vừa bật web lên là bắt anh Shipper chạy đi lấy data ngay
  useEffect(() => {
    fetchPosts();
  }, []);

  // Xử lý khi bấm nút "Đăng bài"
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang gây giật lag

    // Đóng gói dữ liệu chuẩn bị gửi đi
    const newPost = { title: title, content: content };

    // Cử Shipper mang gói hàng (newPost) sang cho Backend
    fetch("http://localhost:8080/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((response) => {
        if (response.ok) {
          fetchPosts(); // Đăng xong thì load lại danh sách mới nhất
          setTitle(""); // Quét dọn form cho sạch sẽ
          setContent("");
        } else {
          alert("Backend từ chối nhận hàng. Nhớ bật Spring Boot nha!");
        }
      })
      .catch((error) => alert("Lỗi gửi bài: " + error));
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1 style={{ color: "#2c3e50" }}> Hệ thống CMS Đỉnh Cao </h1>

      {/* Khu vực tạo bài viết mới */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>✍️ Viết bài mới</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nhập tiêu đề ở đây..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <textarea
            placeholder="Nhập nội dung xịn xò vào đây..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              height: "100px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Đăng Bài Ngay
          </button>
        </form>
      </div>

      {/* Khu vực hiển thị danh sách bài viết */}
      <h3>📚 Danh sách bài viết:</h3>
      {posts.length === 0 ? (
        <p>Chưa có bài nào, hãy làm người bóc tem đi!</p>
      ) : null}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          <h4 style={{ margin: "0 0 5px 0", color: "#e74c3c" }}>
            {post.title}
          </h4>
          <p style={{ margin: 0 }}>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
