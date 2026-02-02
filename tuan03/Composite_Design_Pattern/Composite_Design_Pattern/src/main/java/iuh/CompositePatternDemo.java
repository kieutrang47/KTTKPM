package iuh;

// ========== CLIENT CODE ==========
/**
 * Điểm mạnh: client có thể xử lý File và Directory mà không cần biết chi tiết
 */
public class CompositePatternDemo {
    public static void main(String[] args) {
        System.out.println(" === COMPOSITE PATTERN DEMO ===\n");

        // Tạo các file (leaf nodes)
        FileSystemComponent resume = new File("resume.pdf", "John Doe's Resume");
        FileSystemComponent photo = new File("photo.jpg", "Vacation Photo");
        FileSystemComponent notes = new File("notes.txt", "Meeting Notes");
        FileSystemComponent config = new File("config.xml", "System Configuration");

        // Tạo các directory (composite nodes)
        Directory root = new Directory("Root");
        Directory documents = new Directory("Documents");
        Directory pictures = new Directory("Pictures");
        Directory work = new Directory("Work");

        System.out.println("\n Building File System Structure:");
        System.out.println("===================================");

        // Xây dựng cấu trúc cây
        documents.add(resume);
        documents.add(notes);

        pictures.add(photo);

        work.add(config);
        documents.add(work);  // Directory chứa directory khác

        root.add(documents);
        root.add(pictures);

        System.out.println("\n Complete File System:");
        System.out.println("========================");
        root.display();

        System.out.println("\n Statistics:");
        System.out.println("==============");
        System.out.println("Total size of root directory: " + root.getTotalSize() + " bytes");

        System.out.println("\n Uniform Client Treatment:");
        System.out.println("===========================");

        // Client xử lý File và Directory như nhau
        FileSystemComponent[] items = {resume, documents};
        for (FileSystemComponent item : items) {
            System.out.println("\nCalling display() on component:");
            item.display();
        }

        System.out.println("\n Accessing Child Components:");
        System.out.println("==============================");

        // Truy cập thành phần con
        FileSystemComponent child = documents.getChild(0);
        if (child != null) {
            System.out.print("First child of Documents: ");
            child.display();
        }
    }
}
