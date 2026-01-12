package iuh.fit;

import redis.clients.jedis.Jedis;
import java.util.Scanner;

public class ChatProducer {

    public static void main(String[] args) {
        try (Jedis jedis = new Jedis("localhost", 6379);
             Scanner scanner = new Scanner(System.in)) {

            System.out.print(ConsoleColors.GREEN + "Nhập tên hiển thị của bạn: " + ConsoleColors.RESET);
            String name = scanner.nextLine();

            System.out.println(ConsoleColors.YELLOW + ">>> Đã tham gia phòng chat. Gõ tin nhắn và nhấn Enter." + ConsoleColors.RESET);

            while (true) {
                // In dấu nhắc lệnh màu đỏ cho ngầu
                System.out.print(ConsoleColors.RED + "You > " + ConsoleColors.RESET);
                String text = scanner.nextLine();

                if ("exit".equalsIgnoreCase(text)) {
                    System.out.println("Bye bye!");
                    break;
                }

                ChatMessage msg = new ChatMessage(name, text);
                jedis.publish("room-1", msg.serialize());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}