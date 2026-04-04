package com.example.partition.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * HORIZONTAL PARTITION - Entity base
 * Spring Boot không hỗ trợ routing sang bảng khác tự động,
 * nên ta dùng 2 entity riêng map vào 2 bảng khác nhau.
 */

// Entity cho bảng NAM (table_user_01)
@Entity
@Table(name = "table_user_01")  // map vào bảng nam
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserMale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 10)
    private String gender = "Nam";

    @Column(length = 150)
    private String email;
}
