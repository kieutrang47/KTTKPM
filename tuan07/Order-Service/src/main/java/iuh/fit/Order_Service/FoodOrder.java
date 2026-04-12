package iuh.fit.Order_Service;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class FoodOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String customerName;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderItem> items = new ArrayList<>();
    
    private Double totalPrice;
    private String status; // ORDERED, PAID, DELIVERING, COMPLETED
    private String paymentMethod; // COD, Banking

    // Helper methods
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
        calculateTotalPrice();
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
        calculateTotalPrice();
    }

    public void calculateTotalPrice() {
        this.totalPrice = items.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
        // Không set bidirectional ở đây, để controller xử lý
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    // Backward compatibility - deprecated
    @Deprecated
    public String getFoodItem() {
        return items.isEmpty() ? null : items.get(0).getFoodItem();
    }

    @Deprecated
    public void setFoodItem(String foodItem) {
        // For backward compatibility with old API
    }

    @Deprecated
    public Double getPrice() {
        return totalPrice;
    }

    @Deprecated
    public void setPrice(Double price) {
        // For backward compatibility with old API
    }
}