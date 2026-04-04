package com.example.partition.service;

import com.example.partition.entity.UserFemale;
import com.example.partition.entity.UserMale;
import com.example.partition.repository.UserFemaleRepository;
import com.example.partition.repository.UserMaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMaleRepository maleRepo;
    private final UserFemaleRepository femaleRepo;

    /**
     * Tự động điều hướng (Routing) lưu vào bảng tương ứng dựa vào giới tính
     */
    public Object saveUser(String name, String gender, String email) {
        if ("Nam".equalsIgnoreCase(gender)) {
            UserMale male = new UserMale();
            male.setName(name);
            male.setGender("Nam");
            male.setEmail(email);
            return maleRepo.save(male); // Lưu vào table_user_01
        } else if ("Nữ".equalsIgnoreCase(gender) || "Nu".equalsIgnoreCase(gender)) {
            UserFemale female = new UserFemale();
            female.setName(name);
            female.setGender("Nữ");
            female.setEmail(email);
            return femaleRepo.save(female); // Lưu vào table_user_02
        } else {
            throw new IllegalArgumentException("Giới tính phải là 'Nam' hoặc 'Nữ'");
        }
    }

    /**
     * Tự động query từ 1 bảng cố định nếu biết trước giới tính
     * -> Tăng performance cho Database
     */
    public List<?> getUsersByGender(String gender) {
        if ("Nam".equalsIgnoreCase(gender)) {
            return maleRepo.findAll();
        } else if ("Nữ".equalsIgnoreCase(gender) || "Nu".equalsIgnoreCase(gender)) {
            return femaleRepo.findAll();
        }
        
        // Nếu không có gender, sẽ phải query cả 2 bảng (tốn tài nguyên hơn) 
        List<Object> all = new ArrayList<>();
        all.addAll(maleRepo.findAll());
        all.addAll(femaleRepo.findAll());
        return all;
    }
}
