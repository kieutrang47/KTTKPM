package com.example.partition.repository;

import com.example.partition.entity.UserMale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMaleRepository extends JpaRepository<UserMale, Integer> {
}
