package iuh;

import java.util.ArrayList;
import java.util.List;

// ========== COMPONENT INTERFACE ==========
/**
 * Giao diện Component - định nghĩa phương thức chung cho tất cả các thành phần
 * Đây là trái tim của Composite Pattern, cho phép client xử lý đối tượng đơn và nhóm đối tượng một cách thống nhất
 */
interface FileSystemComponent {
    void display();  // Hiển thị thông tin
    void add(FileSystemComponent component);  // Thêm thành phần con (chỉ Directory dùng)
    void remove(FileSystemComponent component);  // Xóa thành phần con
    FileSystemComponent getChild(int index);  // Lấy thành phần con theo index
}

// ========== LEAF CLASS - FILE ==========
/**
 * Leaf Class - đại diện cho đối tượng không có con (leaf node)
 * Tương ứng với file trong hệ thống thực tế
 * Các phương thức thêm/xóa sẽ throw exception vì file không thể có con
 */
class File implements FileSystemComponent {
    private String name;
    private String content;
    private int size;

    public File(String name, String content) {
        this.name = name;
        this.content = content;
        this.size = content.length();
    }

    @Override
    public void display() {
        System.out.println(" File: " + name + " | Size: " + size + " bytes | Content: \"" + content + "\"");
    }

    @Override
    public void add(FileSystemComponent component) {
        throw new UnsupportedOperationException(" Cannot add to a File - Files are leaf nodes");
    }

    @Override
    public void remove(FileSystemComponent component) {
        throw new UnsupportedOperationException(" Cannot remove from a File");
    }

    @Override
    public FileSystemComponent getChild(int index) {
        throw new UnsupportedOperationException(" File has no children");
    }

    // Getter methods
    public String getName() { return name; }
    public String getContent() { return content; }
    public int getSize() { return size; }
}

// ========== COMPOSITE CLASS - DIRECTORY ==========
/**
 * Composite Class - đại diện cho đối tượng có thể chứa con (composite node)
 * Tương ứng với directory/folder trong hệ thống thực tế
 * Có thể chứa cả File (leaf) và Directory (composite) khác
 */
class Directory implements FileSystemComponent {
    private String name;
    private List<FileSystemComponent> children;

    public Directory(String name) {
        this.name = name;
        this.children = new ArrayList<>();
    }

    @Override
    public void display() {
        System.out.println("\n Directory: " + name);
        System.out.println("├─ Contents (" + children.size() + " items):");

        // Sử dụng đệ quy để hiển thị toàn bộ cây
        for (int i = 0; i < children.size(); i++) {
            System.out.print("│  ");
            if (i == children.size() - 1) {
                System.out.print("└─ ");
            } else {
                System.out.print("├─ ");
            }
            // Gọi đệ quy - đây là sức mạnh của Composite Pattern
            children.get(i).display();
        }
    }

    @Override
    public void add(FileSystemComponent component) {
        children.add(component);
        System.out.println(" Added " +
                (component instanceof File ? "file" : "directory") +
                " to directory: " + name);
    }

    @Override
    public void remove(FileSystemComponent component) {
        if (children.remove(component)) {
            System.out.println(" Removed from directory: " + name);
        }
    }

    @Override
    public FileSystemComponent getChild(int index) {
        if (index >= 0 && index < children.size()) {
            return children.get(index);
        }
        return null;
    }

    public int getTotalSize() {
        int total = 0;
        for (FileSystemComponent child : children) {
            if (child instanceof File) {
                total += ((File) child).getSize();
            } else if (child instanceof Directory) {
                total += ((Directory) child).getTotalSize();
            }
        }
        return total;
    }
}
