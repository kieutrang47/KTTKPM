package iuh;

import java.util.*;

// ==================== 1. SINGLETON PATTERN ====================
class Library {
    private static Library instance;
    private List<Book> books;
    private List<LibraryObserver> observers;
    private String libraryName;

    // Private constructor
    private Library() {
        this.books = new ArrayList<>();
        this.observers = new ArrayList<>();
        this.libraryName = "Thư Viện Trung Tâm Thành Phố";
        System.out.println(" " + libraryName + " (Singleton) đã được khởi tạo");
    }

    public static Library getInstance() {
        if (instance == null) {
            instance = new Library();
        }
        return instance;
    }

    public void addBook(Book book) {
        books.add(book);
        System.out.println("Đã thêm sách: " + book.getTitle());
        notifyObservers("Sách mới: " + book.getTitle());
    }

    public List<Book> getBooks() {
        return new ArrayList<>(books);
    }

    // Observer methods
    public void attach(LibraryObserver observer) {
        observers.add(observer);
        System.out.println(" " + observer + " đã đăng ký nhận thông báo");
    }

    private void notifyObservers(String message) {
        for (LibraryObserver observer : observers) {
            observer.update(message);
        }
    }

    public String getLibraryInfo() {
        return libraryName + " | Số sách: " + books.size() + " | Số người theo dõi: " + observers.size();
    }
}

// ==================== 2. FACTORY METHOD PATTERN ====================
abstract class Book {
    protected String title;
    protected String author;
    protected String category;

    public Book(String title, String author, String category) {
        this.title = title;
        this.author = author;
        this.category = category;
    }

    public abstract void displayInfo();

    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getCategory() { return category; }
}

class PaperBook extends Book {
    public PaperBook(String title, String author, String category) {
        super(title, author, category);
    }

    @Override
    public void displayInfo() {
        System.out.println(" Sách giấy: " + title + " - " + author);
    }
}

class EBook extends Book {
    public EBook(String title, String author, String category) {
        super(title, author, category);
    }

    @Override
    public void displayInfo() {
        System.out.println(" Sách điện tử: " + title + " - " + author);
    }
}

// Factory Interface
interface BookFactory {
    Book createBook(String title, String author, String category);
}

class PaperBookFactory implements BookFactory {
    @Override
    public Book createBook(String title, String author, String category) {
        return new PaperBook(title, author, category);
    }
}

class EBookFactory implements BookFactory {
    @Override
    public Book createBook(String title, String author, String category) {
        return new EBook(title, author, category);
    }
}

// ==================== 3. STRATEGY PATTERN ====================
interface SearchStrategy {
    List<Book> search(List<Book> books, String keyword);
}

class SearchByTitle implements SearchStrategy {
    @Override
    public List<Book> search(List<Book> books, String keyword) {
        List<Book> results = new ArrayList<>();
        for (Book book : books) {
            if (book.getTitle().toLowerCase().contains(keyword.toLowerCase())) {
                results.add(book);
            }
        }
        return results;
    }
}

class SearchByAuthor implements SearchStrategy {
    @Override
    public List<Book> search(List<Book> books, String keyword) {
        List<Book> results = new ArrayList<>();
        for (Book book : books) {
            if (book.getAuthor().toLowerCase().contains(keyword.toLowerCase())) {
                results.add(book);
            }
        }
        return results;
    }
}

class BookSearcher {
    private SearchStrategy strategy;

    public void setStrategy(SearchStrategy strategy) {
        this.strategy = strategy;
    }

    public List<Book> executeSearch(List<Book> books, String keyword) {
        return strategy.search(books, keyword);
    }
}

// ==================== 4. OBSERVER PATTERN ====================
interface LibraryObserver {
    void update(String message);
}

class Librarian implements LibraryObserver {
    private String name;

    public Librarian(String name) {
        this.name = name;
    }

    @Override
    public void update(String message) {
        System.out.println("[Thủ thư " + name + "] Thông báo: " + message);
    }

    @Override
    public String toString() {
        return "Thủ thư " + name;
    }
}

// ==================== 5. DECORATOR PATTERN ====================
interface BookBorrow {
    void borrow();
    String getDescription();
    double getCost();
}

class BasicBorrow implements BookBorrow {
    private Book book;
    private int days;

    public BasicBorrow(Book book, int days) {
        this.book = book;
        this.days = days;
    }

    @Override
    public void borrow() {
        System.out.println(" Mượn sách: " + book.getTitle() + " trong " + days + " ngày");
    }

    @Override
    public String getDescription() {
        return "Mượn cơ bản: " + book.getTitle() + " (" + days + " ngày)";
    }

    @Override
    public double getCost() {
        return 0.0;
    }
}

abstract class BorrowDecorator implements BookBorrow {
    protected BookBorrow decoratedBorrow;

    public BorrowDecorator(BookBorrow decoratedBorrow) {
        this.decoratedBorrow = decoratedBorrow;
    }

    @Override
    public void borrow() {
        decoratedBorrow.borrow();
    }

    @Override
    public String getDescription() {
        return decoratedBorrow.getDescription();
    }

    @Override
    public double getCost() {
        return decoratedBorrow.getCost();
    }
}

class ExtendedBorrow extends BorrowDecorator {
    private int extraDays;

    public ExtendedBorrow(BookBorrow decoratedBorrow, int extraDays) {
        super(decoratedBorrow);
        this.extraDays = extraDays;
    }

    @Override
    public void borrow() {
        super.borrow();
        System.out.println("  + Gia hạn thêm " + extraDays + " ngày");
    }

    @Override
    public String getDescription() {
        return super.getDescription() + " + Gia hạn (" + extraDays + " ngày)";
    }

    @Override
    public double getCost() {
        return super.getCost() + (extraDays * 0.50);
    }
}

