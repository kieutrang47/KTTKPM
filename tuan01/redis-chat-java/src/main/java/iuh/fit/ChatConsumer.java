package iuh.fit;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

public class ChatConsumer {

    public static void main(String[] args) {
        // Dùng try-with-resources để tự động đóng kết nối nếu có lỗi
        try (Jedis jedis = new Jedis("localhost", 6379)) {

            System.out.println(ConsoleColors.YELLOW + ">>> Đang kết nối vào phòng chat 'room-1'..." + ConsoleColors.RESET);

            jedis.subscribe(new JedisPubSub() {
                @Override
                public void onMessage(String channel, String message) {
                    try {
                        ChatMessage msg = ChatMessage.deserialize(message);

                        // In ra format: [Giờ] [Tên]: Nội dung
                        System.out.println(
                                ConsoleColors.CYAN + "[" + msg.getFormattedTime() + "] " +
                                        ConsoleColors.PURPLE_BOLD + msg.from + ": " +
                                        ConsoleColors.RESET + msg.content
                        );
                    } catch (Exception e) {
                        System.err.println("Lỗi nhận tin: " + e.getMessage());
                    }
                }
            }, "room-1");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}