package iuh;

import java.util.List;


public class LibraryManagementSystem {
    public static void main(String[] args) {
        System.out.println(" === HỆ THỐNG QUẢN LÝ THƯ VIỆN ===\n");

        // 1. SINGLETON: Lấy instance thư viện duy nhất
        System.out.println("1.SINGLETON PATTERN");
        System.out.println("========================");
        Library library = Library.getInstance();
        Library library2 = Library.getInstance();
        System.out.println("Kiểm tra: library == library2 ? " + (library == library2));
        System.out.println("Chỉ có 1 thư viện duy nhất trong hệ thống\n");

        // 2. FACTORY METHOD: Tạo sách bằng factory
        System.out.println("2.FACTORY METHOD PATTERN");
        System.out.println("===========================");
        BookFactory paperFactory = new PaperBookFactory();
        BookFactory ebookFactory = new EBookFactory();

        Book book1 = paperFactory.createBook("Design Patterns", "Erich Gamma", "Lập trình");
        Book book2 = ebookFactory.createBook("Clean Code", "Robert Martin", "Lập trình");
        Book book3 = paperFactory.createBook("Dế Mèn Phiêu Lưu Ký", "Tô Hoài", "Văn học");

        // Thêm sách vào thư viện
        library.addBook(book1);
        library.addBook(book2);
        library.addBook(book3);

        // 3. OBSERVER: Đăng ký nhận thông báo
        System.out.println("\n3.OBSERVER PATTERN");
        System.out.println("======================");
        Librarian librarian = new Librarian("Nguyễn Văn A");
        library.attach(librarian);

        // Thêm sách mới (sẽ tự động thông báo)
        Book book4 = ebookFactory.createBook("Java Programming", "James Gosling", "Lập trình");
        library.addBook(book4);

        // 4. STRATEGY: Tìm kiếm sách
        System.out.println("\n4.STRATEGY PATTERN");
        System.out.println("======================");
        BookSearcher searcher = new BookSearcher();

        System.out.println("--- Tìm theo tên ---");
        searcher.setStrategy(new SearchByTitle());
        List<Book> results = searcher.executeSearch(library.getBooks(), "Pattern");
        System.out.println("Tìm thấy " + results.size() + " sách:");
        for (Book book : results) {
            book.displayInfo();
        }

        System.out.println("\n--- Tìm theo tác giả ---");
        searcher.setStrategy(new SearchByAuthor());
        results = searcher.executeSearch(library.getBooks(), "Martin");
        System.out.println("Tìm thấy " + results.size() + " sách:");
        for (Book book : results) {
            book.displayInfo();
        }

        // 5. DECORATOR: Mượn sách với tính năng bổ sung
        System.out.println("\n5.DECORATOR PATTERN");
        System.out.println("=======================");

        System.out.println("--- Mượn cơ bản ---");
        BookBorrow basic = new BasicBorrow(book1, 14);
        basic.borrow();
        System.out.println("Mô tả: " + basic.getDescription());
        System.out.println("Chi phí: " + basic.getCost() + " VND\n");

        System.out.println("--- Mượn có gia hạn ---");
        BookBorrow extended = new ExtendedBorrow(basic, 7);
        extended.borrow();
        System.out.println("Mô tả: " + extended.getDescription());
        System.out.println("Tổng chi phí: " + extended.getCost() + " VND\n");

        System.out.println("--- Mượn nhiều tính năng ---");
        BookBorrow premium = new ExtendedBorrow(
                new ExtendedBorrow(
                        new BasicBorrow(book3, 21),
                        14
                ),
                7
        );
        premium.borrow();
        System.out.println("Mô tả: " + premium.getDescription());
        System.out.println("Tổng chi phí: " + premium.getCost() + " VND");

        // 6. TỔNG KẾT
        System.out.println("\n=== TỔNG KẾT HỆ THỐNG ===");
        System.out.println("===========================");
        System.out.println(library.getLibraryInfo());

        System.out.println("\n CÁC DESIGN PATTERN ĐÃ SỬ DỤNG:");
        System.out.println("1. Singleton: Đảm bảo 1 thư viện duy nhất");
        System.out.println("2. Factory Method: Tạo các loại sách khác nhau");
        System.out.println("3. Strategy: Tìm kiếm theo nhiều cách");
        System.out.println("4. Observer: Thông báo tự động khi có sách mới");
        System.out.println("5. Decorator: Thêm tính năng khi mượn sách");
    }
}