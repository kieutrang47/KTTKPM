package iuh.fit;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ChatMessage {
    public String from;
    public String content;
    public long time;

    public ChatMessage(String from, String content) {
        this.from = from;
        this.content = content;
        this.time = System.currentTimeMillis();
    }

    public String serialize() {
        // Cấu trúc: Tên|Thời_gian|Nội_dung
        // Đổi thứ tự một chút để xử lý nội dung dễ hơn
        return from + "|" + time + "|" + content;
    }

    public static ChatMessage deserialize(String raw) {
        // Quan trọng: limit = 3 nghĩa là chỉ cắt ở 2 dấu gạch đứng đầu tiên
        // Phần còn lại (nội dung) dù có chứa "|" cũng được giữ nguyên
        String[] arr = raw.split("\\|", 3);

        ChatMessage msg = new ChatMessage(arr[0], arr[2]); // arr[2] là content
        msg.time = Long.parseLong(arr[1]); // arr[1] là time
        return msg;
    }

    // hàm print có format
    public String getFormattedTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        return sdf.format(new Date(time));
    }
}