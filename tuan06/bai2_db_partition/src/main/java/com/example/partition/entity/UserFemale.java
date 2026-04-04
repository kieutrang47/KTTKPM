package com.example.partition.entity;

import jakarta.persistence.*;
import lombok.*;

// Entity cho bảng NỮ (table_user_02)
@Entity
@Table(name = "table_user_02")  // map vào bảng nữ
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFemale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 10)
    private String gender = "Nữ";

    @Column(length = 150)
    private String email;
}
